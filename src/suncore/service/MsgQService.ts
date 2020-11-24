
module suncore {
    /**
     * MsgQ服务类（主要用于模块间的解偶）
     * 说明：
     * 1. 理论上每个MsgQ模块都必须实现一个MsgQService对象，否则此模块的消息不能被处理
     * export
     */
    export abstract class MsgQService extends BaseService {

        /**
         * 启动回调
         * export
         */
        protected $onRun(): void {
            MsgQ.setModuleActive(this.msgQMod, true);
            this.facade.registerObserver(NotifyKey.MSG_Q_BUSINESS, this.$_onMsgQBusiness, this);
        }

        /**
         * 停止回调
         * export
         */
        protected $onStop(): void {
            MsgQ.setModuleActive(this.msgQMod, false);
            this.facade.removeObserver(NotifyKey.MSG_Q_BUSINESS, this.$_onMsgQBusiness, this);
        }

        /**
         * 响应MsgQ消息
         * @mod: 若值为MsgQModEnum.NSL，则只获取需要广播的网络数据（请参考Engine.ts）
         * 说明：
         * 1. 这样做能提高网络消息响应的及时性
         */
        private $_onMsgQBusiness(mod: MsgQModEnum): void {
            let msg: MsgQMsg = null;
            // 非指定模块不响应指定的业务
            if (mod === void 0 || mod === this.msgQMod) {
                while (true) {
                    if (mod === MsgQModEnum.NSL) {
                        msg = MsgQ.fetch(MsgQModEnum.NSL, 2);
                    }
                    else if (this.msgQMod === MsgQModEnum.NSL) {
                        msg = MsgQ.fetch(MsgQModEnum.NSL, 1);
                    }
                    else {
                        msg = MsgQ.fetch(this.msgQMod);
                    }
                    if (msg === null) {
                        break;
                    }
                    this.$dealMsgQMsg(msg.id, msg.data);
                    msg.recover();
                }
                // 更新批次编号
                MsgQ.batchIndex++;
            }
        }

        /**
         * 处理MsgQ消息
         * export
         */
        protected abstract $dealMsgQMsg(id: number, data: any): void;
    }
}