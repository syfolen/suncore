
module suncore {
    /**
     * MsgQ的模块枚举
     * export
     */
    export enum MsgQModEnum {
        /**
         * 空模块
         */
        NIL = -1,

        /**
         * 系统层
         */
        SYS = 0,

        /**
         * 内核层
         * 说明：
         * 1. 请勿修改此值，否则可能会引起MsgQ消息传递合法性校验失效
         * export
         */
        KAL = 1,

        /**
         * 表现层
         * 说明：
         * 1. 表现层的消息允许往CUI或GUI模块传递
         * export
         */
        MMI,

        /**
         * 通用界面
         * export
         */
        CUI,

        /**
         * 游戏界面
         * export
         */
        GUI,

        /**
         * 逻辑层
         * export
         */
        L4C,

        /**
         * 网络层
         * export
         */
        NSL,

        /**
         * 任意层
         */
        ANY
    }
}