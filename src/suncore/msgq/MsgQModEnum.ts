
module suncore {
    /**
     * MsgQ的模块枚举
     * export
     */
    export enum MsgQModEnum {
        /**
         * 空模块
         */
        E_NIL = -1,

        /**
         * 内核层
         * 说明：
         * 1. 请勿修改此值，否则可能会引起MsgQ消息传递合法性校验失效
         */
        E_KAL = 0,

        /**
         * 表现层
         * 说明：
         * 1. 表现层的消息允许往CUI或GUI模块传递
         * 2. 请勿修改此值，否则可能会引起MsgQ消息传递合法性校验失效
         * export
         */
        MMI = 1,

        /**
         * 逻辑层
         * export
         */
        L4C,

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
         * 网络层
         * export
         */
        NSL,

        /**
         * 任意层
         */
        E_ANY
    }
}