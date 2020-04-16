
module suncore {
    /**
     * 命令枚举
     * export
     */
    export namespace NotifyKey {
        /**
         * 启动命令
         * export
         */
        export const STARTUP: string = "suncore.NotifyKey.STARTUP";

        /**
         * 停止命令
         * depends
         */
        export const SHUTDOWN: string = "suncore.NotifyKey.SHUTDOWN";

        /**
         * 启用时间轴 { mod: ModuleEnum, pause: boolean }
         * @mod: 时间轴模块
         * @pause: 若为true，时间轴开始后将处于暂停模式
         * 说明：
         * 1. 参数pause并不会对SYSTEM模块的时间轴生效
         * export
         */
        export const START_TIMELINE: string = "suncore.NotifyKey.START_TIMELINE";

        /**
         * 暂停时间轴 { mod: ModuleEnum, stop: boolean }
         * @mod: 时间轴模块
         * @stop: 若为true，时间轴将被停止而非暂停
         * 说明：
         * 1. 时间轴停止后，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         * depends
         */
        export const PAUSE_TIMELINE: string = "suncore.NotifyKey.PAUSE_TIMELINE";

        /**
         * 物理帧事件（后于物理预处理事件执行）
         * 说明：
         * 1. 此事件在物理计算之后派发，故物理世界中的数据应当在此事件中被读取
         * 2. 物理计算优先于定时器事件
         * 比如：
         * 1. 你应当在此事件中获取对象的物理数据来计算，以确保你的所使用的都是物理计算完成之后的数据
         * export
         */
        export const PHYSICS_FRAME: string = "suncore.NotifyKey.PHYSICS_FRAME";

        /**
         * 物理预处理事件（先于物理帧事件执行）
         * 说明：
         * 1. 此事件在物理计算之前派发，故外部的数据应当在此事件中传入物理引擎
         * 比如：
         * 1. 你可以在此事件中直接更改物理对象的位置，引擎会使用你传入的位置来参与碰撞
         * depends
         */
        export const PHYSICS_PREPARE: string = "suncore.NotifyKey.PHYSICS_PREPARE";

        /**
         * 帧事件（进入事件）
         * 说明：
         * 1. 该事件优先于Message消息机制执行
         * export
         */
        export const ENTER_FRAME: string = "suncore.NotifyKey.ENTER_FRAME";

        /**
         * 帧事件（晚于事件）
         * 说明：
         * 1. 该事件次后于Message消息机制执行
         * depends
         */
        export const LATER_FRAME: string = "suncore.NotifyKey.LATER_FRAME";

        /**
         * MsgQ消息
         */
        export const MSG_Q_BUSINESS: string = "suncore.NotifyKey.MSG_Q_BUSINESS";
    }
}