
module suncore {
    /**
     * MsgQ消息体中间件
     */
    export class MsgQMsg {
        /**
         * 响应消息的模块
         */
        dst: MsgQModEnum = MsgQModEnum.ANY;

        /**
         * 消息编号
         */
        id: number = 0;

        /**
         * 消息挂载的数据
         */
        data: any = null;

        /**
         * 批次编号
         */
        batchIndex: number = 0;

        setTo(dst: MsgQModEnum, id: number, data: any, batchIndex: number): MsgQMsg {
            this.id = id;
            this.dst = dst;
            this.data = data;
            this.batchIndex = batchIndex;
            return this;
        }

        recover(): void {
            this.data = null;
            suncom.Pool.recover("suncore.MsgQMsg", this);
        }
    }
}