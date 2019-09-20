
module suncore {

    /**
     * 消息队列
     */
    export class MessageQueue implements IMessageQueue {
        /**
         * 所属模块
         */
        private $mod: ModuleEnum;

        /**
         * 队列节点列表
         */
        private $queues: Array<Array<Message>> = [];

        /**
         * 临时消息队列
         * 说明：
         * 1. 因为消息可能产生消息，所以当前帧中所有新消息都会被放置在临时队列中，在帧结束之前统一整理至消息队列
         */
        private $messages0: Array<Message> = [];

        constructor(mod: ModuleEnum) {
            // 所属模块
            this.$mod = mod;
            // 初始化消息队列
            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority] = [];
            }
        }

        /**
         * 添加消息
         */
        putMessage(message: Message): void {
            this.$messages0.push(message);
        }

        /**
         * 处理消息
         */
        dealMessage(): number {
            // 总处理条数统计
            let dealCount: number = 0;
            // 剩余消息条数
            let remainCount: number = 0;

            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                const queue: Array<Message> = this.$queues[priority];

                // 跳过惰性消息
                if (priority === MessagePriorityEnum.PRIORITY_LAZY) {
                    continue;
                }
                // 若系统被暂停，则忽略网络消息
                if (priority === MessagePriorityEnum.PRIORITY_SOCKET && System.timeStamp.paused === true) {
                    continue;
                }
                // 剩余消息条数累计
                remainCount += queue.length;

                // 任务消息
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    // 任务消息在返回 true 表示任务己完成
                    if (queue.length > 0) {
                        if (this.$dealTaskMessage(queue[0]) === true) {
                            // 此时应当移除任务
                            queue.shift();
                        }
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 网络消息
                else if (priority === MessagePriorityEnum.PRIORITY_SOCKET) {
                    // 消息队列不为空
                    if (queue.length > 0) {
                        // 处理消息
                        this.$dealSocketMessage(queue.shift());
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 触发器消息
                else if (priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    // 任务消息在返回 true 表示任务己完成
                    while (queue.length && this.$dealTriggerMessage(queue[0]) == true) {
                        // 此时应当移除任务
                        queue.shift();
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 其它类型消息
                else if (queue.length > 0) {
                    // 处理统计
                    let count: number = 0;
                    // 忽略统计
                    let ignoreCount: number = 0;
                    // 消息总条数
                    const totalCount: number = this.$getDealCountByPriority(priority);

                    // 若 totalCount 为 0 ，则表示处理所有消息
                    for (; queue.length && (totalCount == 0 || count < totalCount); count++) {
                        if (this.$dealCustomMessage(queue.shift()) === false) {
                            count--;
                            ignoreCount++;
                        }
                    }

                    // 总处理条数累加
                    dealCount += count;
                }
            }

            // 若只剩下惰性消息，则处理惰性消息
            if (remainCount === 0 && this.$messages0.length === 0) {
                const queue: Array<Message> = this.$queues[MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    this.$dealCustomMessage(queue.shift());
                    dealCount++;
                }
            }

            return dealCount;
        }

        /**
         * 任务消息处理逻辑
         */
        private $dealTaskMessage(message: Message): boolean {
            const task: ITask = message.task;

            // 若任务没有被开启，则开启任务
            if (message.active === false) {
                message.active = true;
                if (task.run() === true) {
                    task.done = true;
                }
            }

            return task.done == true;
        }

        /**
         * 网络消息处理逻辑
         */
        private $dealSocketMessage(message: Message): void {
            const data: ISocketData = message.data;
            // NetConnectionNotifier.notify(data.cmd, data.socData);
        }

        /**
         * 触发器消息处理逻辑
         */
        private $dealTriggerMessage(message: Message): boolean {
            // 触发条件未达成
            if (message.timeout > System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            message.handler.run();

            return true;
        }

        /**
         * 其它类型消息处理逻辑
         */
        private $dealCustomMessage(message: Message): boolean {
            const res: boolean = message.handler.run();
            if (res === false) {
                return false;
            }
            return true;
        }

        /**
         * 根据优先级返回每帧允许处理的消息条数
         */
        private $getDealCountByPriority(priority: MessagePriorityEnum): number {
            if (priority === MessagePriorityEnum.PRIORITY_0) {
                return 0;
            }
            if (priority === MessagePriorityEnum.PRIORITY_HIGH) {
                return 7;
            }
            if (priority === MessagePriorityEnum.PRIORITY_NOR) {
                return 2;
            }
            if (priority === MessagePriorityEnum.PRIORITY_LOW) {
                return 1;
            }
            throw Error("错误的消息优先级");
        }

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void {
            while (this.$messages0.length) {
                const message: Message = this.$messages0.shift();
                if (message.priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    this.$addTriggerMessage(message);
                }
                else {
                    this.$queues[message.priority].push(message);
                }
            }
        }

        /**
         * 添加触发器消息
         */
        private $addTriggerMessage(message: Message): void {
            const queue: Array<Message> = this.$queues[MessagePriorityEnum.PRIORITY_TRIGGER];

            let min: number = 0;
            let mid: number = 0;
            let max: number = queue.length - 1;

            let index: number = -1;

            while (max - min > 1) {
                mid = Math.floor((min + max) * 0.5);
                if (queue[mid].timeout <= message.timeout) {
                    min = mid;
                }
                else if (queue[mid].timeout > message.timeout) {
                    max = mid;
                }
                else {
                    break;
                }
            }

            for (let i: number = min; i <= max; i++) {
                if (queue[i].timeout > message.timeout) {
                    index = i;
                    break;
                }
            }

            if (index < 0) {
                queue.push(message);
            }
            else {
                queue.splice(index, 0, message);
            }
        }

        /**
         * 清除指定模块下的所有消息
         */
        clearMessages(): void {
            this.$messages0.length = 0;
            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority].length = 0;
            }
        }

        /**
         * 取消任务
         * @message: 目前只有task才需要被取消
         */
        private $cancelMessage(message: Message): void {
            message.task && message.task.cancel();
        }
    }
}