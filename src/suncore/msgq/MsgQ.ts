
module suncore {
    /**
     * MsgQ机制
     * 设计说明：
     * 1. 设计MsgQ的主要目的是为了对不同的模块进行彻底的解耦
     * 2. 考虑到在实际环境中，网络可能存在波动，而UI层可能会涉及到资源的动态加载与释放管理，故MsgQ中的消息是以异步的形式进行派发的
     * 3. 由于MsgQ的异步机制，故每条消息的处理都必须考虑并避免因模块间的数据可能的不同步而带来的报错问题
     * export
     */
    export namespace MsgQ {
        /**
         * 消息列表
         */
        const $queues: { [mod: number]: MsgQMsg[] } = {};

        /**
         * 模块状态
         */
        const $modStats: { [mod: number]: boolean } = {};

        /**
         * 批次编号
         */
        export let batchIndex: number = 1;

        /**
         * 发送消息（异步）
         * export
         */
        export function send(dst: MsgQModEnum, id: number, data?: any): void {
            if (isModuleActive(dst) === false) {
                suncom.Logger.warn(suncom.DebugMode.ANY, `消息发送失败，模块己暂停 mod:${MsgQModEnum[dst]}`);
                return;
            }
            if (check(dst, id) === false) {
                suncom.Logger.warn(suncom.DebugMode.ANY, `消息发送失败，消息ID非法 mod:${dst}, id:${id}`);
                return;
            }
            let array: MsgQMsg[] = $queues[dst];
            if (array === void 0) {
                array = $queues[dst] = [];
            }
            const msg: MsgQMsg = suncom.Pool.getItemByClass<MsgQMsg>("suncore.MsgQMsg", MsgQMsg);
            array.push(msg.setTo(dst, id, data, batchIndex));
        }

        /**
         * 获取消息
         * @id: 只获取指定ID的消息，若为void 0则不校验
         */
        export function fetch(mod: MsgQModEnum, id?: number): MsgQMsg {
            const queue: MsgQMsg[] = $queues[mod];
            // 消息队列为空
            if (queue === void 0 || queue.length === 0) {
                return null;
            }
            for (let i: number = 0; i < queue.length; i++) {
                const msg: MsgQMsg = queue[i];
                if (mod === MsgQModEnum.NSL || msg.batchIndex < batchIndex) {
                    if (id === void 0 || msg.id === id) {
                        queue.splice(i, 1);
                        return msg;
                    }
                }
            }
            return null;
        }

        /**
         * 校验消息ID的合法性
         */
        function check(mod: MsgQModEnum, id: MsgQIdEnum): boolean {
            let min: number = suncom.Mathf.MIN_SAFE_INTEGER;
            let max: number = suncom.Mathf.MAX_SAFE_INTEGER;
            if (mod === MsgQModEnum.MMI) {
                min = MsgQIdEnum.MMI_MSG_ID_BEGIN;
                max = MsgQIdEnum.MMI_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.CUI) {
                min = MsgQIdEnum.CUI_MSG_ID_BEGIN;
                max = MsgQIdEnum.CUI_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.GUI) {
                min = MsgQIdEnum.GUI_MSG_ID_BEGIN;
                max = MsgQIdEnum.GUI_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.L4C) {
                min = MsgQIdEnum.L4C_MSG_ID_BEGIN;
                max = MsgQIdEnum.L4C_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.NSL) {
                min = MsgQIdEnum.NSL_MSG_ID_BEGIN;
                max = MsgQIdEnum.NSL_MSG_ID_END;
            }
            else {
                throw Error(`未知的消息范围 mod:${mod}`);
            }
            return id >= min && id < max;
        }

        /**
         * 判断模块是否己激活
         */
        export function isModuleActive(mod: MsgQModEnum): boolean {
            return $modStats[mod] === true;
        }

        /**
         * 设置模块是否己激活
         */
        export function setModuleActive(mod: MsgQModEnum, active: boolean): void {
            $modStats[mod] = active;
            if (active === false) {
                const array: MsgQMsg[] = $queues[mod] || [];
                while (array.length > 0) {
                    suncom.Pool.recover("suncore.MsgQMsg", array.pop());
                }
                delete $queues[mod];
            }
        }
    }
}