
module suncore {
    /**
     * 互斥体，用于实现模块之间的消息互斥
     * export
     */
    export namespace Mutex {
        /**
         * MMI命令前缀
         */
        const MMI_COMMAND_PREFIX: string = "MMI";

        /**
         * 系统命令前缀
         */
        const SYSTEM_COMMAND_PREFIX: string = "sun";

        /**
         * 互斥前缀标记
         */
        const MUTEX_PREFIX_KEY: string = "suncore$mutex$prefix";

        /**
         * 互斥计数标记
         */
        const MUTEX_MUTEXES_KEY: string = "suncore$mutex$mutexes";

        /**
         * 注册引用计数标记（专用于统计MMI的引用次数）
         */
        const MUTEX_REFERENCES_KEY: string = "suncore$mutex$references";

        /**
         * 互斥量
         * 说明：
         * 1. 当互斥量不为0时，只允许传递指定前缀的消息和系统消息
         */
        let mutexes: number = 0;

        /**
         * 互斥引用计数（主要用于帮助识别激活互斥体的模块）
         * 说明：
         * 1. 当消息开始传递，且互斥计数为0时，激活互斥体的MsgQ模块将被记录
         * 2. 若没有成功识别到激活互斥体的模块，则默认为MMI模块，故默认的消息发送模块为MMI模块
         */
        let references: number = 0;

        /**
         * 激活互斥体的MsgQ模块
         * 说明：
         * 1. 当此变量的值为-1时，允许激活互斥体
         * 2. 首次引用互斥体视为激活互斥体
         * 3. 激活互斥体的模块将被记录在此变量中
         * 4. 若激活消息的模块为MMI通用模块，则此记录值允许被替换成任意的其它MMI模块，仅第一次生效
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
         * MsgQ模块集
         * export
         */
        export const msgQMap: { [prefix: string]: MsgQModEnum } = {};

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
                throw Error(`必须为命令指定一个模块名，格式为 MOD_${name}`);
            }
            return name.substr(0, index);
        }

        /**
         * 判断是否为MMI的消息前缀
         */
        function isMMIPrefix(prefix: string): boolean {
            const msgQMod: MsgQModEnum = msgQMap[prefix] || -1;
            return msgQMod !== -1 && mmiMsgQMap[msgQMod] === true;
        }

        /**
         * 根据消息前缀校验可执行性
         */
        function asserts(prefix: string): string {
            const yes: boolean = isMMIPrefix(prefix);
            // 己锁定MMI通用模块
            if (actMsgQMod === MsgQModEnum.MMI) {
                // 锁定MMI模块
                if (yes === true) {
                    actMsgQMod = msgQMap[prefix];
                }
                // 非表现层消息不允许传递
                else if (prefix !== MMI_COMMAND_PREFIX) {
                    throw Error(`禁止跨模块传递消息 src:${MMI_COMMAND_PREFIX}, dest:${prefix}`);
                }
            }
            // 己锁定MsgQ模块
            else {
                const cmd: string = msgQCmd[actMsgQMod] || null;
                if (cmd === null) {
                    throw Error(`意外的MsgQMod ${actMsgQMod}`);
                }
                // 消息模块不一致或MMI模块传递非MMI通用消息，则抛出错误
                if (isMMIPrefix(cmd) === true && prefix === MMI_COMMAND_PREFIX) {

                }
                else {

                }
            }

            // 监听的消息为MMI通用消息
            if (prefix === MMI_COMMAND_PREFIX) {
                // 己监听非MMI消息
                if (mutex > 0 && isMMIPrefix(str) === false) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }
            // 监听的消息为MMI消息
            else if (isMMIPrefix(prefix) === true) {
                // 消息模块不一致
                if (mutex > 0 && str !== prefix) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }
            // 监听的消息为其它类型消息
            else {
                // 己监听MMI通用消息，或消息模块不一致
                if (references > 0 || (mutex > 0 && str !== prefix)) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
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
            const prefix: string = asserts(getCommandPrefix(name));
            // 锁定通用模块不会产生互斥量，但会产生引用计数
            if (prefix === SYSTEM_COMMAND_PREFIX || prefix === MMI_COMMAND_PREFIX) {
                references++;
            }
            else {
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
            const prefix: string = getCommandPrefix(name);
            // 锁定通用模块不会产生互斥量，但会产生引用计数
            if (prefix === SYSTEM_COMMAND_PREFIX || prefix === MMI_COMMAND_PREFIX) {
                references--;
            }
            else {
                if (currentPrefix === null || currentPrefix === prefix) {
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
            const msgQMod: MsgQModEnum = msgQMap[currentPrefix] || -1;
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

            const prefix: string = asserts(getCommandPrefix(name));
            // 系统命令不产生互斥量
            if (prefix === SYSTEM_COMMAND_PREFIX) {
                return;
            }

            // 互斥量
            const mutex: number = target[MUTEX_MUTEXES_KEY] || 0;
            // MMI引用次数
            const references: number = target[MUTEX_REFERENCES_KEY] || 0;

            // 互斥前缀标记
            const str: string = target[MUTEX_PREFIX_KEY] || MMI_COMMAND_PREFIX;

            // 监听的消息为MMI通用消息
            if (prefix === MMI_COMMAND_PREFIX) {
                // 己监听非MMI消息
                if (mutex > 0 && isMMIPrefix(str) === false) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }
            // 监听的消息为MMI消息
            else if (isMMIPrefix(prefix) === true) {
                // 消息模块不一致
                if (mutex > 0 && str !== prefix) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }
            // 监听的消息为其它类型消息
            else {
                // 己监听MMI通用消息，或消息模块不一致
                if (references > 0 || (mutex > 0 && str !== prefix)) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }

            // 若为MMI通用消息，则只产生MMI引用次数
            if (prefix === MMI_COMMAND_PREFIX) {
                target[MUTEX_REFERENCES_KEY] = references + 1;
            }
            // 否则会对互斥量进行递增
            else {
                target[MUTEX_MUTEXES_KEY] = mutex + 1;
                // 强行限制允许监听的消息模块
                if (mutex === 0) {
                    target[MUTEX_PREFIX_KEY] = prefix;
                }
            }
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

            const prefix: string = asserts(getCommandPrefix(name));
            // 系统命令不会释放互斥量
            if (prefix === SYSTEM_COMMAND_PREFIX) {
                return;
            }

            // 互斥量
            const mutex: number = target[MUTEX_MUTEXES_KEY] || 0;
            // MMI引用次数
            const references: number = target[MUTEX_REFERENCES_KEY] || 0;
            // 互斥量与MMI引用次数必须存在一个
            if (mutex <= 0 && references <= 0) {
                throw Error(`互斥量状态有误`);
            }

            // 互斥前缀标记
            const str: string = target[MUTEX_PREFIX_KEY] || MMI_COMMAND_PREFIX;

            // 监听的消息为MMI通用消息
            if (prefix === MMI_COMMAND_PREFIX) {
                // 己监听非MMI消息
                if (mutex > 0 && isMMIPrefix(str) === false) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }
            // 监听的消息为MMI消息
            else if (isMMIPrefix(prefix) === true) {
                // 消息模块不一致
                if (mutex > 0 && str !== prefix) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }
            // 监听的消息为其它类型消息
            else {
                // 己监听MMI通用消息，或消息模块不一致
                if (references > 0 || str !== prefix) {
                    throw Error(`禁止跨模块监听消息，src:${str}, dest:${prefix}`);
                }
            }

            // 若为MMI通用消息，则只产生MMI引用次数
            if (prefix === MMI_COMMAND_PREFIX) {
                target[MUTEX_REFERENCES_KEY] = references - 1;
                if (references === 1) {
                    delete target[MUTEX_REFERENCES_KEY];
                }
            }
            // 否则会对互斥量进行递增
            else {
                target[MUTEX_MUTEXES_KEY] = mutex - 1;
                // 解除限制允许监听的消息模块
                if (mutex === 1) {
                    delete target[MUTEX_MUTEXES_KEY];
                    delete target[MUTEX_PREFIX_KEY];
                }
            }
        }
    }
}