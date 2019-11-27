var suncore;
(function (suncore) {
    /**
     * 消息优先级
     * 设计说明：
     * 1. 使用消息机制的意义主要在于解决游戏表现层的流畅性问题
     * 2. 由于消息机制中并没有提供由使用者主动取消消息的功能，所以消息机制并不适用于作线性逻辑方面的构建
     * 3. 消息机制被用于实现场景跳转只是一个意外，因为场景跳转的逻辑是不可回滚的
     * export
     */
    var MessagePriorityEnum;
    (function (MessagePriorityEnum) {
        /**
         * 枚举开始
         */
        MessagePriorityEnum[MessagePriorityEnum["MIN"] = 0] = "MIN";
        /**
         * 始终立即响应
         * export
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_0"] = 1] = "PRIORITY_0";
        /**
         * 每帧至多响应十次消息
         * export
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_HIGH"] = 2] = "PRIORITY_HIGH";
        /**
         * 每帧至多响应三次的消息
         * export
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_NOR"] = 3] = "PRIORITY_NOR";
        /**
         * 每帧至多响应一次的消息
         * export
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LOW"] = 4] = "PRIORITY_LOW";
        /**
         * 惰性消息
         * 说明：
         * 1. 当前帧若没有处理过任何消息，则会处理此类型的消息
         * 2. 当消息优先级为 [0, HIGH, NOR, LOW] 的消息回调执行后的返回值为false，则该次执行将会被LAZY忽略
         * export
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LAZY"] = 5] = "PRIORITY_LAZY";
        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         * 3. 此类型的消息存在的唯一原因是消息机制不能感知定时器的存在
         * export
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TRIGGER"] = 6] = "PRIORITY_TRIGGER";
        /**
         * 任务消息
         * 说明：
         * 1. 任务消息在执行时，会阻塞整个消息队列，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         * export
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TASK"] = 7] = "PRIORITY_TASK";
        /**
         * 枚举结束
         */
        MessagePriorityEnum[MessagePriorityEnum["MAX"] = 8] = "MAX";
    })(MessagePriorityEnum = suncore.MessagePriorityEnum || (suncore.MessagePriorityEnum = {}));
})(suncore || (suncore = {}));
//# sourceMappingURL=MessagePriorityEnum.js.map