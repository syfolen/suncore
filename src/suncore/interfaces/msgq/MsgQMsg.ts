
module suncore {
    /**
     * MsgQ消息体中间件
     */
    export interface IMsgQMsg {
        /**
         * 响应消息的模块
         */
        dst: MsgQModEnum;

        /**
         * 消息编号
         */
        id: number;

        /**
         * 消息挂载的数据
         */
        data: any;

        /**
         * 批次编号
         */
        batchIndex: number;

        setTo(dst: MsgQModEnum, id: number, data: any, batchIndex: number): IMsgQMsg;

        recover(): void;
    }
}