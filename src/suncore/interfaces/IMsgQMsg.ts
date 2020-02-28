
module suncore {
    /**
     * MsgQ消息体接口
     * export
     */
    export interface IMsgQMsg {
        /**
         * 响应消息的模块
         * export
         */
        dst: MsgQModEnum;

        /**
         * 消息序号
         */
        seqId: number;

        /**
         * 消息编号
         * export
         */
        id: number;

        /**
         * 消息挂载的数据
         * export
         */
        data: any;
    }
}