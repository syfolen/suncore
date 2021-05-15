
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
         * 任务消息列表
         */
        private $tasks: IMessage[][] = [];

        /**
         * 其它消息队列
         */
        private $queues: IMessage[][] = [];

        /**
         * 临时消息队列
         * 说明：
         * 1. 因为消息可能产生消息，所以当前帧中所有新消息都会被放置在临时队列中，在帧结束之前统一整理至消息队列
         */
        private $messages0: IMessage[] = [];

        /**
         * 消息是否取消执行
         */
        private $canceled: boolean = false;

        /**
         * 当前承诺的权重（防止执行队列为空但临时队列不为空时添加承诺时权重出现混乱）
         */
        private $weights: number = 0;

        constructor(mod: ModuleEnum) {
            this.$mod = mod;

            let priority: MessagePriorityEnum;
            // 初始化消息队列
            for (priority = 0; priority < MessagePriorityEnum.E_MAX; priority++) {
                this.$queues[priority] = [];
            }
        }

        /**
         * 添加消息
         */
        putMessage(message: IMessage): void {
            this.$messages0.push(message);
            // 新消息为承诺
            if (message.priority === MessagePriorityEnum.PRIORITY_PROMISE) {
                this.$initPromiseWeights(message);
            }
        }

        /**
         * 初始化承诺的权重
         */
        private $initPromiseWeights(message: IMessage): void {
            let promise: IMessage, promises: IMessage[] = this.$queues[MessagePriorityEnum.PRIORITY_PROMISE];
            if (promises.length === 0) {
                message.weights = this.$weights;
            }
            else {
                promise = promises[0];
                if (promise.task.running === false) {
                    message.weights = this.$weights;
                }
                else {
                    // 当前正在执行承诺，故新的承诺级别应当比当前正在执行的承诺高一级
                    message.weights = this.$weights = promises[0].weights + 1;
                }
            }
        }

        /**
         * 处理消息
         */
        dealMessage(): void {
            // 总处理条数统计
            let dealCount: number = 0;
            // 剩余消息条数
            let remainCount: number = 0;

            let id: number, okCount: number, totalCount: number, queue: any[], tasks: IMessage[], message: IMessage, priority: MessagePriorityEnum;

            // 执行一般消息
            for (priority = 0; priority < MessagePriorityEnum.E_MAX; priority++) {
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    queue = this.$tasks;
                }
                else {
                    queue = this.$queues[priority];
                }
                // 跳过空队列和惰性消息
                if (queue.length === 0 || priority === MessagePriorityEnum.PRIORITY_LAZY) {
                    continue;
                }
                // 任务消息
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    // 并行触发
                    for (id = this.$tasks.length - 1; id > -1; id--) {
                        tasks = this.$tasks[id];
                        if (tasks.length > 0 && this.$dealTaskMessage(tasks[0]) === true) {
                            tasks.shift().recover();
                            dealCount++;
                        }
                        if (tasks.length > 1) {
                            remainCount += tasks.length - 1;
                        }
                        else if (tasks.length === 0) {
                            this.$tasks.splice(id, 1);
                        }
                    }
                }
                // 承诺
                else if (priority === MessagePriorityEnum.PRIORITY_PROMISE) {
                    while (queue.length > 0) {
                        dealCount++;

                        message = queue[0];
                        if (this.$dealTaskMessage(message) === false) {
                            break;
                        }
                        queue.shift().recover();
                        // 若当前承诺权重高于正在执行的承诺权重，则跳出循环
                        if (this.$weights > message.weights) {
                            break;
                        }
                    }
                }
                // 触发器消息
                else if (priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    // 返回true时应当移除触发器
                    while (queue.length > 0 && this.$dealTriggerMessage(queue[0]) === true) {
                        queue.shift().recover();
                        if (this.$canceled === false) {
                            dealCount++;
                        }
                    }
                }
                // 其它类型消息
                else {
                    // 消息总条数
                    totalCount = this.$getDealCountByPriority(priority);
                    // 若 totalCount 为 0 ，则表示处理所有消息
                    for (okCount = 0; queue.length > 0 && (totalCount === 0 || okCount < totalCount); okCount++) {
                        message = queue.shift();
                        if (this.$dealCustomMessage(message) === false) {
                            okCount--;
                        }
                        message.recover();
                    }
                    // 总处理条数累加
                    dealCount += okCount;
                }
                // 剩余消息条数累计
                remainCount += queue.length;
            }

            // 若只剩下惰性消息，则处理惰性消息
            if (remainCount === 0 && dealCount === 0 && this.$messages0.length === 0) {
                queue = this.$queues[MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    message = queue.shift();
                    this.$dealCustomMessage(message);
                    dealCount++;
                    message.recover();
                }
            }
        }

        /**
         * 任务消息处理逻辑
         */
        private $dealTaskMessage(message: IMessage): boolean {
            const task: ITask = message.task;

            // 若任务没有被开启，则开启任务
            if (task.running === false) {
                task.running = true;
                if (task.run() === true) {
                    task.done = true;
                }
            }

            // 己处理任务应当移除
            return task.done === true;
        }

        /**
         * 触发器消息处理逻辑
         */
        private $dealTriggerMessage(message: IMessage): boolean {
            // 触发条件未达成
            if (message.timeout > System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            this.$canceled = message.method.apply(message.caller, message.args) === false;
            return true;
        }

        /**
         * 其它类型消息处理逻辑
         * 执行器的返回值意义请参考 MessagePriorityEnum 的 PRIORITY_LAZY 注释
         */
        private $dealCustomMessage(message: IMessage): boolean {
            return message.method.apply(message.caller, message.args) !== false;
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
            throw Error(`错误的消息优先级`);
        }

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void {
            let message: IMessage;
            while (this.$messages0.length > 0) {
                message = this.$messages0.shift();
                if (message.priority === MessagePriorityEnum.PRIORITY_TASK) {
                    this.$addTaskMessage(message);
                }
                else if (message.priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    this.$addTriggerMessage(message);
                }
                else if (message.priority === MessagePriorityEnum.PRIORITY_PROMISE) {
                    this.$addPromiseMessage(message);
                }
                else {
                    this.$queues[message.priority].push(message);
                }
            }
        }

        /**
         * 添加承诺
         */
        private $addPromiseMessage(message: IMessage): void {
            const messages: IMessage[] = this.$queues[MessagePriorityEnum.PRIORITY_PROMISE];

            let i: number, index: number = -1, promise: IMessage;
            for (i = 0; i < messages.length; i++) {
                promise = messages[i];
                if (promise.task.running === true) {
                    continue;
                }
                if (promise.weights < message.weights) {
                    index = i;
                    break;
                }
            }

            if (index === -1) {
                messages.push(message);
            }
            else {
                messages.splice(index, 0, message);
            }
        }

        /**
         * 添加触发器消息
         */
        private $addTriggerMessage(message: IMessage): void {
            const queue: IMessage[] = this.$queues[MessagePriorityEnum.PRIORITY_TRIGGER];

            let min: number = 0;
            let mid: number = 0;
            let max: number = queue.length - 1;

            let i: number, index: number = -1;

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

            for (i = min; i <= max; i++) {
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
         * 添加任务消息
         */
        private $addTaskMessage(message: IMessage): void {
            let i: number, index: number = -1, tasks: IMessage[];

            for (i = 0; i < this.$tasks.length; i++) {
                tasks = this.$tasks[i];
                if (tasks.length > 0 && tasks[0].groupId === message.groupId) {
                    index = i;
                    break;
                }
            }

            if (index === -1) {
                this.$tasks.unshift([message]);
            }
            else {
                this.$tasks[index].push(message);
            }
        }

        /**
         * 清除指定模块下的所有消息
         * 说明：
         * 1. 考虑到执行干扰问题，所以正式消息队列中的消息不会立即移除
         */
        clearMessages(): void {
            let i: number, priority: MessagePriorityEnum, queue: IMessage[];

            while (this.$messages0.length > 0) {
                this.$cancelMessage(this.$messages0.shift());
            }
            for (i = 0; i < this.$tasks.length; i++) {
                queue = this.$tasks[i];
                while (queue.length > 0) {
                    this.$cancelMessage(queue.shift());
                }
            }
            for (priority = 0; priority < MessagePriorityEnum.E_MAX; priority++) {
                queue = this.$queues[priority];
                while (queue.length > 0) {
                    this.$cancelMessage(queue.shift());
                }
            }
        }

        /**
         * 取消消息（目前只有task才需要被取消）
         */
        private $cancelMessage(message: IMessage): void {
            if (message.priority === MessagePriorityEnum.PRIORITY_TASK) {
                message.task.done = true;
            }
            message.recover();
        }

        /**
         * 取消任务
         */
        cancelTaskByGroupId(mod: ModuleEnum, groupId: number): void {
            let id: number, message: IMessage, messages: IMessage[];
            for (id = 0; id < this.$tasks.length; id++) {
                messages = this.$tasks[id];
                if (messages.length > 0 && messages[0].groupId === groupId) {
                    while (messages.length > 0) {
                        message = messages.shift();
                        message.task.done = true;
                        message.recover();
                    }
                    break;
                }
            }
        }
    }
}