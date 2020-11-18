
module suncore {
    /**
     * MsgQ消息体中间件
     */
    export class MsgQMsg {
        /**
         * 对象池
         */
        static $pool: MsgQMsg[] = [];

        /**
         * 响应消息的模块
         */
        dst: MsgQModEnum = MsgQModEnum.ANY;

        /**
         * 消息序号
         */
        seqId: number = 0;

        /**
         * 消息编号
         */
        id: number = 0;

        /**
         * 消息挂载的数据
         */
        data: any = null;

        setTo(dst: MsgQModEnum, seqId: number, id: number, data: any): MsgQMsg {
            this.id = id;
            this.dst = dst;
            this.data = data;
            this.seqId = seqId;
            return this;
        }

        recover(): void {
            if (this.seqId > 0) {
                this.seqId = 0;
                MsgQMsg.$pool.push(this);
            }
            else {
                throw Error(`对象己被回收，若很久未报错，则可移除 if 以提升性能`);
            }
        }

        static create(): MsgQMsg {
            return this.$pool.length > 0 ? this.$pool.pop() : new MsgQMsg();
        }
    }
}