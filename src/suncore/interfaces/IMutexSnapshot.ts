
module suncore {
    /**
     * 互斥锁快照
     */
    export interface IMutexSnapshot {
        /**
         * 互斥数据
         */
        data: any;

        /**
         * 激活互斥锁的模块
         */
        actMsgQMod: MsgQModEnum;

        /**
         * 当前锁定的模块
         */
        curMsgQMod: MsgQModEnum;
    }
}