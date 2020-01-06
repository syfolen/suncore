
module suncore {
    /**
     * MsgQ的模块枚举
     * export
     */
    export enum MsgQModEnum {
        /**
         * 系统层
         * 说明：
         * 1. 此为保留值，仅用于支持puremvc框架中对通用指令的传递合法性校验
         * 2. 请勿修改此值，否则可能会引起MsgQ消息传递合法性校验失效
         * export
         */
        KAL = 0,

        /**
         * 表现层
         * 说明：
         * 1. 同MMI
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
        NSL
    }
}