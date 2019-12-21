
module suncore {
    /**
     * 互斥体，用于实现模块之间的互斥
     * export
     */
    export namespace Mutex {
        /**
         * 系统命令前缀
         */
        const SYSTEM_COMMAND_PREFIX: string = "sun";

        /**
         * 互斥前缀标记
         */
        const MUTEX_PREFIX_KEY: string = "suncore$mutex$prefix";

        /**
         * 互斥量计数标记
         */
        const MUTEX_MUTEXES_KEY: string = "suncore$mutex$mutexes";

        /**
         * 互斥引用计数标记
         */
        const MUTEX_REFERENCES_KEY: string = "suncore$mutex$references";

        /**
         * 互斥量
         * 说明：
         * 1. 当互斥量不为0时，只允许传递指定前缀的消息和系统消息
         */
        let mutexes: number = 0;

        /**
         * 互斥计数（主要用于帮助识别激活互斥体的模块）
         * 说明：
         * 1. 当消息开始传递，且互斥计数为0时，激活互斥体的MsgQ模块将被记录
         * 2. 若没有成功识别到激活互斥体的模块，则默认为MMI模块，故默认的消息发送模块为MMI模块
         */
        let references: number = 0;

        /**
         * 当前正在传递的消息前缀
         * 说明：
         * 1. 为空时允许传递所有消息
         */
        let currentPrefix: string = null;

        /**
         * 激活互斥体的MsgQ模块
         * 说明：
         * 1. 当此变量的值为-1时，允许激活互斥体
         * 2. 首次引用互斥体视为激活互斥体
         * 3. 激活互斥体的模块将被记录在此变量中
         * 4. 若激活消息的模块为MMI模块，则此记录值允许被替换成其它MMI模块的消息，仅第一次生效
         * 5. 此变量会在互斥引用为0时重新置为-1
         * export
         */
        export let actMsgQMod: MsgQModEnum = -1;

        /**
         * 是否校验消息前缀，默认为false
         * export
         */
        export let checkPrefix: boolean = false;

        /**
         * 表现层模块集
         * export
         */
        export const mmiMsgQMap: { [prefix: string]: MsgQModEnum } = {};

        /**
         * 表现层前缀集
         * export
         */
        export const mmiMsgQCmd: { [msgQMod: number]: string } = {};

        /**
         * 获取命令前缀
         */
        function getCommandPrefix(name: string): string {
            const index: number = name.indexOf("_");
            if (index < 1) {
                throw Error(`必须为命令指定一个模块名，格式为 MOD_${name}`);
            }
            return name.substr(0, index);
        }

        /**
         * 判断是否为通用消息
         */
        function isSunCmd(name: string): boolean {
            return name.substr(0, 3) === SYSTEM_COMMAND_PREFIX;
        }

        /**
         * 判断是否为MMI的消息前缀
         */
        function isMMIPrefix(prefix: string): boolean {
            const msgQMod: MsgQModEnum = mmiMsgQMap[prefix] || -1;
            return msgQMod !== -1;
        }

        /**
         * 根据消息前缀校验可执行性
         */
        function asserts(prefix: string): string {
            const yes: boolean = isMMIPrefix(prefix);
            // 互斥体由MMI层激活
            if (actMsgQMod === MsgQModEnum.MMI) {
                // 若消息为MMI消息，则应当对当前正在传递的消息前缀进行转化
                if (yes === true) {
                    actMsgQMod = mmiMsgQMap[prefix];
                    currentPrefix = prefix;
                }
                // 否则不允许传递
                else {
                    throw Error(`禁止跨模块传递消息 src:MMI, dest:${prefix}`);
                }
            }
            return prefix;
        }

        /**
         * 激活互斥体
         * export
         */
        export function active(msgQMod: MsgQModEnum): void {
            if (checkPrefix === false) {
                return;
            }
            if (actMsgQMod === -1) {
                actMsgQMod = msgQMod;
            }
        }

        /**
         * 关闭互斥体
         * export
         */
        export function deactive(): void {
            if (checkPrefix === false) {
                return;
            }
            if (references === 0 && actMsgQMod !== -1) {
                actMsgQMod = -1;
            }
        }

        /**
         * 锁定互斥体
         * export
         */
        export function lock(name: string): void {
            if (checkPrefix === false) {
                return;
            }
            // 锁定通用模块不会产生互斥量，但会产生引用计数
            if (isSunCmd(name) === true) {
                references++;
            }
            else {
                const prefix: string = asserts(getCommandPrefix(name));
                if (currentPrefix === null || currentPrefix === prefix) {
                    mutexes++;
                    // 消息前缀将在非通用模块首次活动时被锁定
                    if (mutexes === 1) {
                        currentPrefix = prefix;
                    }
                }
                else {
                    throw Error(`禁止跨模块传递消息，src:${prefix}, dest:${getCommandPrefix(name)}`);
                }
            }
        }

        /**
         * 释放互斥体
         * export
         */
        export function unlock(name: string): void {
            if (checkPrefix === false) {
                return;
            }
            // 释放通用模块不会减少互斥量，但会减少引用计数
            if (isSunCmd(name) === true) {
                references--;
            }
            else {
                const prefix: string = getCommandPrefix(name);
                if (currentPrefix === null || prefix === currentPrefix) {
                    mutexes--;
                    // 当计数器归0时应当释放对模块的锁定
                    if (mutexes === 0) {
                        currentPrefix = null;
                    }
                    else if (mutexes < 0) {
                        throw Error(`互斥体释放错误：${mutexes}`);
                    }
                }
                else {
                    throw Error(`禁止跨模块传递消息，src:${prefix}, dest:${getCommandPrefix(name)}`);
                }
            }
        }

        /**
         * 判断是否允许执行MMI的行为
         * export
         */
        export function enableMMIAction(): boolean {
            if (checkPrefix === false) {
                return true;
            }
            // 始终允许通用模块执行MMI执行
            if (currentPrefix === null) {
                return true;
            }
            const msgQMod: MsgQModEnum = mmiMsgQMap[currentPrefix] || -1;
            return msgQMod !== -1;
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
            // 系统命令不产生互斥量
            if (isSunCmd(name) === true) {
                return;
            }
            const mutex: number = target[MUTEX_MUTEXES_KEY] || 0;
            // 若互斥量己存在，则需要校验前缀
            if (mutex > 0) {
                const prefix: string = target[MUTEX_PREFIX_KEY] || null;
                if (prefix === null) {
                    throw Error(`意外的互斥量 mutex:${mutex}`);
                }
                if (prefix !== getCommandPrefix(name)) {
                    throw Error(`禁止跨模块监听消息，src:${prefix}, dest:${getCommandPrefix(name)}`);
                }
            }
            else {
                target[MUTEX_PREFIX_KEY] = getCommandPrefix(name);
            }
            // 互斥量递增
            target[MUTEX_MUTEXES_KEY] = mutex + 1;
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
            // 系统命令不会释放互斥量
            if (isSunCmd(name) === true) {
                return;
            }
            const mutex: number = target[MUTEX_MUTEXES_KEY] || 0;
            // 互斥量不存在
            if (mutex <= 0) {
                throw Error(`互斥量不存在`);
            }
            const prefix: string = target[MUTEX_PREFIX_KEY] || null;
            if (prefix === null) {
                throw Error(`互斥体不存在`);
            }
            if (prefix !== getCommandPrefix(name)) {
                throw Error(`禁止跨模块监听消息，src:${prefix}, dest:${getCommandPrefix(name)}`);
            }
            if (mutex - 1 === 0) {
                delete target[MUTEX_PREFIX_KEY];
                delete target[MUTEX_MUTEXES_KEY];
            }
            else {
                // 互斥量递增
                target[MUTEX_MUTEXES_KEY] = mutex - 1;
            }
        }
    }
}