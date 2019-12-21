
module suncore {
    /**
     * MsgQ的消息对象
     * export
     */
    export interface IMsgQMsg {
        /**
         * 发送消息的模块
         * export
         */
        src: MsgQModEnum;

        /**
         * 接收消息的模块
         * export
         */
        dest: MsgQModEnum;

        /**
         * 消息序号
         */
        seqId: number;

        /**
         * 消息编号
         * export
         */
        id: MsgQIdEnum;

        /**
         * 消息挂载的数据
         * export
         */
        data: any;
    }
}