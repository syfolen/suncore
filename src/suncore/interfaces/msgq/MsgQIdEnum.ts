
module suncore {
    /**
     * MsgQId枚举
     * export
     */
    export enum MsgQIdEnum {
        /**
         * 网络层消息枚举
         * export
         */
        NSL_MSG_ID_BEGIN = 1,

        /**
         * export
         */
        NSL_MSG_ID_END = 10,

        /**
         * MMI消息枚举
         * export
         */
        MMI_MSG_ID_BEGIN = NSL_MSG_ID_END,

        /**
         * export
         */
        MMI_MSG_ID_END = 100,

        /**
         * CUI消息枚举
         * export
         */
        CUI_MSG_ID_BEGIN = MMI_MSG_ID_END,

        /**
         * export
         */
        CUI_MSG_ID_END = CUI_MSG_ID_BEGIN + 100,

        /**
         * GUI消息枚举
         * export
         */
        GUI_MSG_ID_BEGIN = CUI_MSG_ID_END,

        /**
         * export
         */
        GUI_MSG_ID_END = GUI_MSG_ID_BEGIN + 200,

        /**
         * 逻辑层消息枚举
         * export
         */
        L4C_MSG_ID_BEGIN = GUI_MSG_ID_END,

        /**
         * export
         */
        L4C_MSG_ID_END = L4C_MSG_ID_BEGIN + 300
    }
}