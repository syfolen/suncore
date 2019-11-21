
module suncore {

    /**
     * 消息优先级
     * export
     */
    export enum MessagePriorityEnum {
        /**
         * 枚举开始
         */
        MIN = 0,

        /**
         * 网络消息
         * 说明：
         * 1. 网络消息以帧序号为批次，每帧会派发同一批次中的所有消息
         * 2. 为了防止被清除，网络消息始终会被添加到系统消息队列中
         * 3. 当系统被暂停时，网络消息不会被广播
         * export
         */
        PRIORITY_SOCKET = 0,

        /**
         * 始终立即响应
         * export
         */
        PRIORITY_0,

        /**
         * 每帧至多响应十次消息
         * export
         */
        PRIORITY_HIGH,

        /**
         * 每帧至多响应三次的消息
         * export
         */
        PRIORITY_NOR,

        /**
         * 每帧至多响应一次的消息
         * export
         */
        PRIORITY_LOW,

        /**
         * 惰性消息
         * 说明：
         * 1. 当前帧若没有处理过任何消息，则会处理此类型的消息
         * export
         */
        PRIORITY_LAZY,

        /**
         * 基于消息列表的帧事件
         * export
         */
        PRIORITY_FRAME,

        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         * export
         */
        PRIORITY_TRIGGER,

        /**
         * 任务消息
         * 说明：
         * 1. 任务消息会反复执行，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         * export
         */
        PRIORITY_TASK,

        /**
         * 枚举结束
         */
        MAX
    }
}