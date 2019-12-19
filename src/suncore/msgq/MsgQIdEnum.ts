
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
        NET_MSG_ID_BEGIN = 1,

        /**
         * export
         */
        NET_MSG_ID_END = 10,

        /**
         * CUI消息枚举
         * export
         */
        CUI_MSG_ID_BEGIN = NET_MSG_ID_END,

        /**
         * export
         */
        CUI_MSG_ID_END = 100,

        /**
         * GUI消息枚举
         * export
         */
        GUI_MSG_ID_BEGIN = CUI_MSG_ID_END,

        /**
         * export
         */
        GUI_MSG_ID_END = 200,

        /**
         * 逻辑层消息枚举
         * export
         */
        OSL_MSG_ID_BEGIN = GUI_MSG_ID_END,

        /**
         * export
         */
        OSL_MSG_ID_END = 300
    }
}