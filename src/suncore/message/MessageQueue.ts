
module suncore {
    /**
     * 消息队列
     */
    export class MessageQueue {
        /**
         * 所属模块
         */
        private $mod: ModuleEnum;

        /**
         * 队列节点列表
         */
        private $queues: Array<Array<IMessage>> = [];

        /**
         * 临时消息队列
         * 说明：
         * 1. 因为消息可能产生消息，所以当前帧中所有新消息都会被放置在临时队列中，在帧结束之前统一整理至消息队列
         */
        private $messages0: Array<IMessage> = [];

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
        putMessage(message: IMessage): void {
            this.$messages0.push(message);
        }

        /**
         * 处理消息
         */
        dealMessage(): void {
            // 总处理条数统计
            let dealCount: number = 0;
            // 剩余消息条数
            let remainCount: number = 0;

            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                const queue: Array<IMessage> = this.$queues[priority];

                // 跳过惰性消息
                if (priority === MessagePriorityEnum.PRIORITY_LAZY) {
                    continue;
                }

                // 任务消息
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    if (queue.length > 0) {
                        // 返回true时应当移除任务
                        if (this.$dealTaskMessage(queue[0]) === true) {
                            queue.shift();
                        }
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 触发器消息
                else if (priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    // 触发器执行结果寄存器
                    const out: { canceled: boolean } = { canceled: false };
                    // 返回true时应当移除触发器
                    while (queue.length > 0 && this.$dealTriggerMessage(queue[0], out) === true) {
                        queue.shift();
                        // 总处理条数累加
                        if (out.canceled === false) {
                            dealCount++;
                        }
                    }
                }
                // 其它类型消息
                else if (queue.length > 0) {
                    // 处理统计
                    let okCount: number = 0;
                    // 消息总条数
                    const totalCount: number = this.$getDealCountByPriority(priority);

                    // 若 totalCount 为 0 ，则表示处理所有消息
                    for (; queue.length > 0 && (totalCount === 0 || okCount < totalCount); okCount++) {
                        if (this.$dealCustomMessage(queue.shift()) === false) {
                            okCount--;
                        }
                    }

                    // 总处理条数累加
                    dealCount += okCount;
                }

                // 剩余消息条数累计
                remainCount += queue.length;
            }

            // 若只剩下惰性消息，则处理惰性消息
            if (remainCount === 0 && dealCount === 0 && this.$messages0.length === 0) {
                const queue: Array<IMessage> = this.$queues[MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    this.$dealCustomMessage(queue.shift());
                    dealCount++;
                }
            }
        }

        /**
         * 任务消息处理逻辑
         */
        private $dealTaskMessage(message: IMessage): boolean {
            const task: AbstractTask = message.task as AbstractTask;

            // 若任务没有被开启，则开启任务
            if (task.running === false && task.destroyed === false) {
                task.running = true;
                if (task.run() === true) {
                    task.done = true;
                }
            }

            // 己处理或己销毁的任务均应当移除
            return task.done === true || task.destroyed === true;
        }

        /**
         * 触发器消息处理逻辑
         * @out: 执行结果寄存器（输出值）
         * 说明：
         * 1. 若触发器执行结果返回false，则应当将寄存器中的canceled的值置为true，否则置为false
         */
        private $dealTriggerMessage(message: IMessage, out: { canceled: boolean }): boolean {
            // 触发条件未达成
            if (message.timeout > System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            out.canceled = message.handler.run() === false;
            return true;
        }

        /**
         * 其它类型消息处理逻辑
         * 执行器的返回值意义请参考 MessagePriorityEnum 的 PRIORITY_LAZY 注释
         */
        private $dealCustomMessage(message: IMessage): boolean {
            return message.handler.run() !== false;
        }

        /**
         * 根据优先级返回每帧允许处理的消息条数
         */
        private $getDealCountByPriority(priority: MessagePriorityEnum): number {
            if (priority === MessagePriorityEnum.PRIORITY_0) {
                return 0;
            }
            if (priority === MessagePriorityEnum.PRIORITY_HIGH) {
                return 10;
            }
            if (priority === MessagePriorityEnum.PRIORITY_NOR) {
                return 3;
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
                const message: IMessage = this.$messages0.shift();
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
        private $addTriggerMessage(message: IMessage): void {
            const queue: Array<IMessage> = this.$queues[MessagePriorityEnum.PRIORITY_TRIGGER];

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
            while (this.$messages0.length > 0) {
                this.$cancelMessage(this.$messages0.pop());
            }
            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                const queue: IMessage[] = this.$queues[priority];
                while (queue.length > 0) {
                    this.$cancelMessage(queue.pop());
                }
            }
        }

        /**
         * 取消任务
         * @message: 目前只有task才需要被取消
         */
        private $cancelMessage(message: IMessage): void {
            if (message.priority === MessagePriorityEnum.PRIORITY_TASK) {
                if (message.task.destroyed === false) {
                    message.task.cancel();
                }
            }
        }
    }
}