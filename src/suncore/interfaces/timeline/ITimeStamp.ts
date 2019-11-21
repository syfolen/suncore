
module suncore {

    /**
     * 系统时间戳接口
     * export
     */
    export interface ITimeStamp extends ITimeline {

        /**
         * 定时器管理器
         */
        readonly timerManager: ITimerManager;

        /**
         * 消息管理器
         */
        readonly messageManager: IMessageManager;
    }
}