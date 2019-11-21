var suncore;
(function (suncore) {
    /**
     * 消息队列
     */
    var MessageQueue = /** @class */ (function () {
        function MessageQueue(mod) {
            /**
             * 队列节点列表
             */
            this.$queues = [];
            /**
             * 临时消息队列
             * 说明：
             * 1. 因为消息可能产生消息，所以当前帧中所有新消息都会被放置在临时队列中，在帧结束之前统一整理至消息队列
             */
            this.$messages0 = [];
            // 所属模块
            this.$mod = mod;
            // 初始化消息队列
            for (var priority = suncore.MessagePriorityEnum.MIN; priority < suncore.MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority] = [];
            }
        }
        /**
         * 添加消息
         */
        MessageQueue.prototype.putMessage = function (message) {
            this.$messages0.push(message);
            if (message.priority === suncore.MessagePriorityEnum.PRIORITY_FRAME && message.active === false) {
                var queue = this.$queues[message.priority];
                for (var i = 0; i < queue.length; i++) {
                    var msg = queue[i];
                    if (msg.method === message.method && msg.caller === message.caller) {
                        msg.active = false;
                    }
                }
            }
        };
        /**
         * 处理消息
         */
        MessageQueue.prototype.dealMessage = function () {
            // 总处理条数统计
            var dealCount = 0;
            // 剩余消息条数
            var remainCount = 0;
            for (var priority = suncore.MessagePriorityEnum.MIN; priority < suncore.MessagePriorityEnum.MAX; priority++) {
                var queue = this.$queues[priority];
                // 跳过惰性消息
                if (priority === suncore.MessagePriorityEnum.PRIORITY_LAZY) {
                    continue;
                }
                // 若系统被暂停，则忽略网络消息
                if (priority === suncore.MessagePriorityEnum.PRIORITY_SOCKET && suncore.System.timeStamp.paused === true) {
                    continue;
                }
                // 剩余消息条数累计，不包括FRAME类型的消息
                if (priority !== suncore.MessagePriorityEnum.PRIORITY_FRAME) {
                    remainCount += queue.length;
                }
                // 任务消息
                if (priority === suncore.MessagePriorityEnum.PRIORITY_TASK) {
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
                else if (priority === suncore.MessagePriorityEnum.PRIORITY_SOCKET) {
                    // 消息队列不为空
                    while (queue.length > 0) {
                        // 处理消息
                        this.$dealSocketMessage(queue.shift());
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 触发器消息
                else if (priority === suncore.MessagePriorityEnum.PRIORITY_TRIGGER) {
                    // 任务消息在返回 true 表示任务己完成
                    while (queue.length && this.$dealTriggerMessage(queue[0]) == true) {
                        // 此时应当移除任务
                        queue.shift();
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 帧事件
                else if (priority === suncore.MessagePriorityEnum.PRIORITY_FRAME) {
                    for (var i = 0; i < queue.length; i++) {
                        var msg = queue[i];
                        msg.method.call(msg.caller);
                    }
                }
                // 其它类型消息
                else if (queue.length > 0) {
                    // 处理统计
                    var count_1 = 0;
                    // 忽略统计
                    var ignoreCount = 0;
                    // 消息总条数
                    var totalCount = this.$getDealCountByPriority(priority);
                    // 若 totalCount 为 0 ，则表示处理所有消息
                    for (; queue.length > 0 && (totalCount == 0 || count_1 < totalCount); count_1++) {
                        if (this.$dealCustomMessage(queue.shift()) === false) {
                            count_1--;
                            ignoreCount++;
                        }
                    }
                    // 总处理条数累加
                    dealCount += count_1;
                }
            }
            // 若只剩下惰性消息，则处理惰性消息
            if (remainCount === 0 && this.$messages0.length === 0) {
                var queue = this.$queues[suncore.MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    this.$dealCustomMessage(queue.shift());
                    dealCount++;
                }
            }
            return dealCount;
        };
        /**
         * 任务消息处理逻辑
         */
        MessageQueue.prototype.$dealTaskMessage = function (message) {
            var task = message.task;
            // 若任务没有被开启，则开启任务
            if (message.active === false) {
                message.active = true;
                if (task.run() === true) {
                    task.done = true;
                }
            }
            return task.done == true;
        };
        /**
         * 网络消息处理逻辑
         */
        MessageQueue.prototype.$dealSocketMessage = function (message) {
            var data = message.data;
            suncore.MessageNotifier.notify(data.name, data.socData);
        };
        /**
         * 触发器消息处理逻辑
         */
        MessageQueue.prototype.$dealTriggerMessage = function (message) {
            // 触发条件未达成
            if (message.timeout > suncore.System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            message.handler.run();
            return true;
        };
        /**
         * 其它类型消息处理逻辑
         */
        MessageQueue.prototype.$dealCustomMessage = function (message) {
            var res = message.handler.run();
            if (res === false) {
                return false;
            }
            return true;
        };
        /**
         * 根据优先级返回每帧允许处理的消息条数
         */
        MessageQueue.prototype.$getDealCountByPriority = function (priority) {
            if (priority === suncore.MessagePriorityEnum.PRIORITY_0) {
                return 0;
            }
            if (priority === suncore.MessagePriorityEnum.PRIORITY_HIGH) {
                return 7;
            }
            if (priority === suncore.MessagePriorityEnum.PRIORITY_NOR) {
                return 2;
            }
            if (priority === suncore.MessagePriorityEnum.PRIORITY_LOW) {
                return 1;
            }
            throw Error("错误的消息优先级");
        };
        /**
         * 将临时消息按优先级分类
         */
        MessageQueue.prototype.classifyMessages0 = function () {
            for (var i = this.$messages0.length - 1; i > -1; i--) {
                var message = this.$messages0[i];
                if (message.priority === suncore.MessagePriorityEnum.PRIORITY_FRAME) {
                    if (message.active === false) {
                        this.$addFrameMessage(message);
                        this.$messages0.splice(i, 1);
                    }
                }
            }
            while (this.$messages0.length) {
                var message = this.$messages0.shift();
                if (message.priority === suncore.MessagePriorityEnum.PRIORITY_TRIGGER) {
                    this.$addTriggerMessage(message);
                }
                else if (message.priority === suncore.MessagePriorityEnum.PRIORITY_FRAME) {
                    this.$addFrameMessage(message);
                }
                else {
                    this.$queues[message.priority].push(message);
                }
            }
        };
        /**
         * 添加帧消息
         */
        MessageQueue.prototype.$addFrameMessage = function (message) {
            var queue = this.$queues[message.priority];
            if (message.active === true) {
                var exist = false;
                for (var i = 0; i < queue.length; i++) {
                    var msg = queue[i];
                    if (msg.method === message.method && msg.caller === message.caller) {
                        exist = true;
                        break;
                    }
                }
                if (exist === false) {
                    queue.push(message);
                }
            }
            else {
                for (var i = queue.length - 1; i > -1; i--) {
                    var msg = queue[i];
                    if (msg.method === message.method && msg.caller === message.caller) {
                        queue.splice(i, 1);
                        break;
                    }
                }
            }
        };
        /**
         * 添加触发器消息
         */
        MessageQueue.prototype.$addTriggerMessage = function (message) {
            var queue = this.$queues[suncore.MessagePriorityEnum.PRIORITY_TRIGGER];
            var min = 0;
            var mid = 0;
            var max = queue.length - 1;
            var index = -1;
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
            for (var i = min; i <= max; i++) {
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
        };
        /**
         * 清除指定模块下的所有消息
         */
        MessageQueue.prototype.clearMessages = function () {
            while (this.$messages0.length > 0) {
                this.$cancelMessage(this.$messages0.pop());
            }
            for (var priority = suncore.MessagePriorityEnum.MIN; priority < suncore.MessagePriorityEnum.MAX; priority++) {
                var queue = this.$queues[priority];
                while (queue.length > 0) {
                    this.$cancelMessage(queue.pop());
                }
            }
        };
        /**
         * 取消任务
         * @message: 目前只有task才需要被取消
         */
        MessageQueue.prototype.$cancelMessage = function (message) {
            if (message.priority === suncore.MessagePriorityEnum.PRIORITY_TASK) {
                message.task.cancel();
            }
        };
        return MessageQueue;
    }());
    suncore.MessageQueue = MessageQueue;
})(suncore || (suncore = {}));
//# sourceMappingURL=MessageQueue.js.map