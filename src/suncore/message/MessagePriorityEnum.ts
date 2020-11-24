
module suncore {
    /**
     * 消息优先级
     * 设计说明：
     * 1. 所有的Message消息都是异步执行的
     * 2. 使用消息机制的意义主要在于解决游戏表现层的流畅性问题
     * 3. 由于消息机制中并没有提供由使用者主动取消消息的功能，所以消息机制并不适用于作线性逻辑方面的构建
     * 4. 消息机制被用于实现场景跳转只是一个意外，因为场景跳转的逻辑是不可回滚的
     * export
     */
    export enum MessagePriorityEnum {
        /**
         * 始终立即响应
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         * export
         */
        PRIORITY_0 = 0,

        /**
         * 每帧至多响应十次消息
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         * export
         */
        PRIORITY_HIGH,

        /**
         * 每帧至多响应三次消息
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         * export
         */
        PRIORITY_NOR,

        /**
         * 每帧至多响应一次消息
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         * export
         */
        PRIORITY_LOW,

        /**
         * 惰性消息
         * 说明：
         * 1. 当前帧若没有处理过任何消息，则会处理此类型的消息
         * 2. 当消息优先级为 [0, HIGH, NOR, LOW] 的消息回调执行后的返回值为false，则该次执行将会被LAZY忽略
         * export
         */
        PRIORITY_LAZY,

        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         * 3. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         * 4. 此类型的消息存在的唯一原因是惰性消息的机制无法感知定时器的存在
         * export
         */
        PRIORITY_TRIGGER,

        /**
         * 任务消息
         * 说明：
         * 1. 任务消息在执行时，会阻塞整个消息队列，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         * export
         */
        PRIORITY_TASK,

        /**
         * 承诺消息
         * 说明：
         * 1. 此消息是取代原生js的Promise机制用的
         * 2. 与任务消息类似，承诺也是阻塞式执行的
         * 3. 影响承诺执行优先级的除了承诺的被添加顺序之外，还有承诺的批次
         * 4. 当你在承诺执行的过程中添加新的承诺时，这些承诺将被视为新的批次
         * 5. 新批次的承诺拥有更高的执行优先级，它们将在当前承诺执行完毕之后开始执行
         * 6. 当当前批次中的所有承诺全部执行完毕之后，上一批承诺将会继续执行，直至整个消息队列为空
         * export
         */
        PRIORITY_PROMISE,

        /**
         * 枚举结束
         */
        MAX
    }
}