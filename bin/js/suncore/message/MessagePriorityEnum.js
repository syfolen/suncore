var suncore;
(function (suncore) {
    /**
     * 消息优先级
     */
    var MessagePriorityEnum;
    (function (MessagePriorityEnum) {
        /**
         * 枚举开始
         */
        MessagePriorityEnum[MessagePriorityEnum["MIN"] = 0] = "MIN";
        /**
         * 始终立即响应
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_0"] = 0] = "PRIORITY_0";
        /**
         * 每帧至多响应十次消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_HIGH"] = 1] = "PRIORITY_HIGH";
        /**
         * 每帧至多响应三次的消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_NOR"] = 2] = "PRIORITY_NOR";
        /**
         * 每帧至多响应一次的消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LOW"] = 3] = "PRIORITY_LOW";
        /**
         * 惰性消息
         * 说明：
         * 1. 当前帧若没有处理过任何消息，则会处理此类型的消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LAZY"] = 4] = "PRIORITY_LAZY";
        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TRIGGER"] = 5] = "PRIORITY_TRIGGER";
        /**
         * 任务消息
         * 说明：
         * 1. 任务消息会反复执行，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TASK"] = 6] = "PRIORITY_TASK";
        /**
         * 网络消息
         * 说明：
         * 1. 网络消息每帧只会被派发一个
         * 2. 为了防止网络消息被清除，网络消息始终会被添加到系统消息队列中
         * 3. 当系统被暂停时，网络消息不会被广播
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_SOCKET"] = 7] = "PRIORITY_SOCKET";
        /**
         * 枚举结束
         */
        MessagePriorityEnum[MessagePriorityEnum["MAX"] = 8] = "MAX";
    })(MessagePriorityEnum = suncore.MessagePriorityEnum || (suncore.MessagePriorityEnum = {}));
})(suncore || (suncore = {}));
//# sourceMappingURL=MessagePriorityEnum.js.map