
module suncore {
    /**
     * 互斥体，用于实现模块之间的消息互斥
     * export
     */
    export namespace Mutex {
        /**
         * MMI通用消息前缀
         */
        export const MMI_COMMAND_PREFIX: string = "MMI";

        /**
         * 系统消息前缀（通用消息）
         */
        export const SYSTEM_COMMAND_PREFIX: string = "sun";

        /**
         * MsgQ消息传递互斥信息
         */
        const data: MutexLocker = new MutexLocker();

        /**
         * MsgQ对象互斥锁
         */
        const locker: MutexLocker = new MutexLocker();

        /**
         * 是否校验消息前缀，默认为false
         * export
         */
        export let checkPrefix: boolean = false;

        /**
         * MsgQ模块集
         * export
         */
        export const msgQMap: { [prefix: string]: MsgQModEnum } = { "sun": MsgQModEnum.SYS, "MMI": MsgQModEnum.MMI };

        /**
         * MsgQ模块前缀集
         * export
         */
        export const msgQCmd: { [msgQMod: number]: string } = {};

        /**
         * 表现层MsgQ模块集
         * export
         */
        export const mmiMsgQMap: { [msgQMod: number]: boolean } = {};

        /**
         * 获取命令前缀
         */
        function getCommandPrefix(name: string): string {
            if (name.substr(0, 3) === SYSTEM_COMMAND_PREFIX) {
                return SYSTEM_COMMAND_PREFIX;
            }
            const index: number = name.indexOf("_");
            if (index < 1) {
                throw Error(`必须为命令指定一个模块名，格式如 MOD_${name}`);
            }
            const prefix: string = name.substr(0, index);
            if (msgQMap[prefix] === void 0) {
                throw Error(`未注册的MsgQ消息前缀：${prefix}`);
            }
            return prefix;
        }

        /**
         * 判断是否允许执行MMI的行为
         * export
         */
        export function enableMMIAction(): boolean {
            if (checkPrefix === false) {
                return true;
            }
            if (data.curMsgQMod === MsgQModEnum.NIL || data.curMsgQMod === MsgQModEnum.SYS || data.curMsgQMod === MsgQModEnum.MMI) {
                return true;
            }
            return mmiMsgQMap[data.curMsgQMod] === true;
        }

        /**
         * 激活互斥体
         * export
         */
        export function active(msgQMod: MsgQModEnum): void {
            if (checkPrefix === false) {
                return;
            }
            data.active(msgQMod);
        }

        /**
         * 关闭互斥体
         * export
         */
        export function deactive(): void {
            if (checkPrefix === false) {
                return;
            }
            data.deactive();
        }

        /**
         * 锁定互斥体
         * export
         */
        export function lock(name: string): void {
            if (checkPrefix === false) {
                return;
            }

            const prefix: string = getCommandPrefix(name);
            const msgQMod: MsgQModEnum = msgQMap[prefix];

            data.asserts(msgQMod, null);
            data.lock(msgQMod);
        }

        /**
         * 释放互斥体
         * export
         */
        export function unlock(name: string): void {
            if (checkPrefix === false) {
                return;
            }
            const prefix: string = getCommandPrefix(name);
            const msgQMod: MsgQModEnum = msgQMap[prefix];

            data.asserts(msgQMod, null);
            data.unlock(msgQMod);
        }

        /**
         * 为对象初始化一个互斥量
         * export
         */
        export function create(name: string, target: Object): void {
            if (checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }

            const prefix: string = getCommandPrefix(name);
            const msgQMod: MsgQModEnum = msgQMap[prefix];

            locker.update(target);
            locker.lock(msgQMod);
        }

        /**
         * 释放互斥量
         * export
         */
        export function release(name: string, target: Object): void {
            if (checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }

            const prefix: string = getCommandPrefix(name);
            const msgQMod: MsgQModEnum = msgQMap[prefix];

            locker.update(target);
            locker.unlock(msgQMod);
        }

        /**
         * 备份快照，并锁定target指定的模块
         * export
         */
        export function backup(target: Object): void {
            if (checkPrefix === true) {
                data.backup(target);
            }
        }

        /**
         * 恢复快照中的数据（自动从上次备份的快照中获取）
         * export
         */
        export function restore(): void {
            if (checkPrefix === true) {
                data.restore();
            }
        }
    }
}