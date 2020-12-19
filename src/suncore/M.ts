
module suncore {
    /**
     * 数据中心
     */
    export namespace M {
        /**
         * 核心类
         */
        export let engine: Engine = null;

        /**
         * 游戏时间轴
         */
        export let timeline: ITimeline = null;

        /**
         * 场景时间轴
         */
        export let timeStamp: ITimeline = null;

        /**
         * 定时器管理器
         */
        export let timerManager: ITimerManager = null;

        /**
         * 消息管理器
         */
        export let messageManager: IMessageManager = null;
    }
}