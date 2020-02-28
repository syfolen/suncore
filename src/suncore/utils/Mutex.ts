
module suncore {
    /**
     * 互斥体，用于实现模块之间的消息互斥
     * export
     */
    export namespace Mutex {
        /**
         * MMI通用消息前缀
         * 说明：
         * 1. MMI通用消息也是一种特殊的消息类型，但它所锁定的模块仅为所有MMI模块
         * 2. 故MMI通用消息允许在任意的MMI模块之间传递且不会触发消息的传递限制规则
         * 3. 所有MMI模块的消息均允许在MMI通用模块中进行传递，但会触发传递限制规则
         */
        const MMI_COMMAND_PREFIX: string = "MMI";

        /**
         * 系统消息前缀（通用消息）
         * 说明：
         * 1. 系统消息是一种特殊的消息类型，它所锁定的模块为所有MsgQ模块
         * 2. 故系统消息允许在所有MsgQ模块之间传递且不会触发消息的传递限制规则
         * 3. 所有MsgQ模块的消息均允许在系统模块中进行传递，但会触发传递限制规则
         */
        const SYSTEM_COMMAND_PREFIX: string = "sun";

        /**
         * 对象所监听的命令前缀标记
         * 说明：
         * 1. 此标记主要用以实现禁止对象跨模块监听消息
         * 2. 当某对象首次监听命令时，系统会主动以命令前缀来标记对象，用于标识对象的MsgQ模块
         * 3. 当此标识存在时，对象将仅允许监听己标识的MsgQ命令
         * 4. 特殊的MsgQ命令可能并不受此标识的限制
         */
        const MUTEX_PREFIX_KEY: string = "suncore$mutex$prefix";

        /**
         * 对象的互斥计数标记
         * 说明：
         * 1. 此标记主要用以实现禁止对象跨模块监听消息
         * 2. 互斥计数会在对象监听MsgQ命令时递增，用于记录当前MsgQ模块的命令监听次数
         * 3. 反之，在对象注销MsgQ命令监听时，互斥计数将会递减
         * 4. 当互斥计数递减至0时，对象的消息监听模块限制将会被解除
         * 5. 特殊的MsgQ命令可能不会触发此标记的递增，亦不会受限于此标记
         */
        const MUTEX_MUTEXES_KEY: string = "suncore$mutex$mutexes";

        /**
         * 对象的MMI通用模块引用计数标记（专用于统计MMI通用模块的引用次数）
         * 说明：
         * 1. 此标记主要用以实现禁止MMI与非MMI模块的消息混合监听
         * 2. MMI通用模块引用计数会在对象监听MMI通用命令时递增，用于记录MMI通用命令的监听次数
         * 3. 反之，在对象注销MMI通用命令监听时，MMI通用模块引用计数计数将会递减
         * 4. 当MMI通用模块引用计数存在时，对象将禁止监听非MMI消息
         * 5. 当MMI通用模块引用计数递减至0时，MMI与非MMI模块的消息混合监听限制将会被解除
         * 6. 若对象当前的MsgQ模块标识为MMI模块，则亦会触发消息混合监听的限制
         * 7. 特殊的MsgQ命令可能不会触发此标记的递增，亦不会受限于此标记
         */
        const MUTEX_MMI_REFERENCES_KEY: string = "suncore$mutex$references";

        /**
         * 互斥量
         * 说明：
         * 1. 此标记主要用以实现禁止消息的跨模块传递
         * 2. 互斥量会在MsgQ消息进行传递时递增，用于记录MsgQ模块消息的传递次数
         * 3. 反之，MsgQ消息每完成一次传递，互斥量就会递减
         * 4. 当互斥量递减至0时，传递限制规则将会回滚为上次锁定的传递限制规则
         * 5. 特殊的MsgQ命令可能不会触发此标记的递增，亦不会受限于此标记
         */
        let mutexes: number = 0;

        /**
         * 互斥引用计数（主要用于帮助识别激活互斥体的模块）
         * 说明：
         * 1. 此标记主要用以实现消息传递限制规则的回滚
         * 2. 只有特殊消息的传递才会引起互斥引用计数的变化
         * 3. 更多说明请参与 threshold 和 actMsgQMod 的注释
         */
        let references: number = 0;

        /**
         * 互斥引用计数阈值
         * 说明：
         * 1. 此变量与 references 一起使用，主要用于实现消息传递限制规则的回滚
         * 2. 在当前传递的MsgQ消息前缀发生变化时，阈值将会被添加，新的传递限制规则将被生成
         * 3. 若 references 递减至阈值所标记的值，则传递限制规则将会发生回滚
         * 4. 在当前的模块设计中，至多会有两次规则的变量
         * 5. 若 thresholds 的长度为2，curMsgQMod必须还原为MMI，否则还原为actMsgQMod
         */
        const thresholds: number[] = [];

        /**
         * 激活互斥体的MsgQ模块
         * 说明：
         * 1. 当此变量的值为-1时，允许激活互斥体
         * 2. 首次引用互斥体视为激活互斥体
         * 3. 激活互斥体的模块将被记录在此变量中
         * 4. 此变量会在互斥引用为0时重新置为-1
         * export
         */
        export let actMsgQMod: MsgQModEnum = -1;

        /**
         * 当前互斥体锁定的MsgQ模块
         * 说明：
         * 1. 若当前为系统模块，则允许进入任意其它的MsgQ模块
         * 2. 若当前为MMI模块，则仅允许进入其它MMI类型的MsgQ模块
         * 3. 否则MsgQ消息仅允许在当前模块传递
         * 4. 当互斥被完全释放时，当前模块锁定亦会被解除
         * export
         */
        export let curMsgQMod: MsgQModEnum = -1;

        /**
         * 是否校验消息前缀，默认为false
         * export
         */
        export let checkPrefix: boolean = false;

        /**
         * MsgQ模块集
         * export
         */
        export const msgQMap: { [prefix: string]: MsgQModEnum } = { "MMI": MsgQModEnum.MMI };

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
        function asserts(prefix: string, target: Object): string {
            if (prefix === SYSTEM_COMMAND_PREFIX) {
                return prefix;
            }
            if (target instanceof puremvc.Notifier && target["msgQMod"] === msgQMap[prefix]) {
                return prefix;
            }
            if (msgQMap[prefix] === void 0) {
                throw Error(`未注册的MsgQ消息前缀：${prefix}`);
            }
            // 己锁定MMI通用模块
            if (actMsgQMod === MsgQModEnum.MMI) {
                // 锁定MMI模块
                if (isMMIPrefix(prefix) === true) {
                    actMsgQMod = msgQMap[prefix];
                }
                // 非表现层消息不允许传递
                else if (prefix !== MMI_COMMAND_PREFIX) {
                    throw Error(`禁止跨模块传递消息 src:${MMI_COMMAND_PREFIX}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                }
            }
            // 己锁定MsgQ模块
            else if (actMsgQMod !== suncore.MsgQModEnum.KAL) {
                const cmd: string = msgQCmd[actMsgQMod] || null;
                if (cmd === null) {
                    throw Error(`意外的MsgQMod ${actMsgQMod}`);
                }
                // 若消息模块不一致，若当前锁定的不为MMI模块且传递的不为MMI通用消息，则抛出错误
                if (cmd !== prefix) {
                    const yes: boolean = isMMIPrefix(cmd);
                    // 若当前不为MMI模块，或当前锁定的为MMI模块，但传递的不为MMI通用消息，则抛出错误
                    if (yes === false || (yes === true && prefix !== MMI_COMMAND_PREFIX)) {
                        throw Error(`禁止跨模块传递消息 src:${suncore.MsgQModEnum[msgQMap[cmd]]}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                    }
                }
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
            // 默认锁定MMI模块
            if (actMsgQMod === -1 || actMsgQMod === MsgQModEnum.KAL) {
                return true;
            }
            if (actMsgQMod === MsgQModEnum.MMI) {
                return true;
            }
            return mmiMsgQMap[actMsgQMod] === true;
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
                curMsgQMod = msgQMod;
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
            if (references === 0 && mutexes === 0 && actMsgQMod !== -1) {
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
            const prefix: string = asserts(getCommandPrefix(name), null);
            // 若当前锁定的消息模块为系统模块，且当前传递的消息为非系统消息，则对消息模块进行重新锁定
            if (curMsgQMod === suncore.MsgQModEnum.SYS && prefix !== SYSTEM_COMMAND_PREFIX) {
                threshold = references;
                actMsgQMod = msgQMap[prefix];
            }
            // 锁定通用模块不会产生互斥量，但会产生引用计数
            if (prefix === SYSTEM_COMMAND_PREFIX || prefix === MMI_COMMAND_PREFIX) {
                references++;
            }
            // 互斥量递增
            else {
                mutexes++;
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
                mutexes--;
                if (mutexes < 0) {
                    throw Error(`互斥体释放错误：${mutexes}`);
                }
            }
            // 若当前互斥量为0，且互斥引用计数降低至等同于阈值，则将当前消息模块重新锁定至系统模块
            if (threshold === references && mutexes === 0) {
                threshold = 0;
                actMsgQMod = MsgQModEnum.KAL;
            }
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

            const prefix: string = asserts(getCommandPrefix(name), target);
            // 系统命令不产生互斥量
            if (prefix === SYSTEM_COMMAND_PREFIX) {
                return;
            }

            // 互斥量
            const mutex: number = target[MUTEX_MUTEXES_KEY] || 0;
            // MMI引用次数
            const references: number = target[MUTEX_MMI_REFERENCES_KEY] || 0;

            // 互斥前缀标记
            const str: string = target[MUTEX_PREFIX_KEY] || MMI_COMMAND_PREFIX;

            // 监听的消息为MMI通用消息
            if (prefix === MMI_COMMAND_PREFIX) {
                // 己监听非MMI消息
                if (mutex > 0 && isMMIPrefix(str) === false) {
                    throw Error(`禁止跨模块监听消息，src:${suncore.MsgQModEnum[msgQMap[str]]}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                }
            }
            // 监听的消息为MMI消息
            else if (isMMIPrefix(prefix) === true) {
                // 消息模块不一致
                if (mutex > 0 && str !== prefix) {
                    throw Error(`禁止跨模块监听消息，src:${suncore.MsgQModEnum[msgQMap[str]]}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                }
            }
            // 监听的消息为其它类型消息
            else {
                // 己监听MMI通用消息，或消息模块不一致
                if (references > 0 || (mutex > 0 && str !== prefix)) {
                    throw Error(`禁止跨模块监听消息，src:${suncore.MsgQModEnum[msgQMap[str]]}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                }
            }

            // 若为MMI通用消息，则只产生MMI引用次数
            if (prefix === MMI_COMMAND_PREFIX) {
                target[MUTEX_MMI_REFERENCES_KEY] = references + 1;
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

            const prefix: string = asserts(getCommandPrefix(name), target);
            // 系统命令不会释放互斥量
            if (prefix === SYSTEM_COMMAND_PREFIX) {
                return;
            }

            // 互斥量
            const mutex: number = target[MUTEX_MUTEXES_KEY] || 0;
            // MMI引用次数
            const references: number = target[MUTEX_MMI_REFERENCES_KEY] || 0;
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
                    throw Error(`禁止跨模块监听消息，src:${suncore.MsgQModEnum[msgQMap[str]]}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                }
            }
            // 监听的消息为MMI消息
            else if (isMMIPrefix(prefix) === true) {
                // 消息模块不一致
                if (mutex > 0 && str !== prefix) {
                    throw Error(`禁止跨模块监听消息，src:${suncore.MsgQModEnum[msgQMap[str]]}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                }
            }
            // 监听的消息为其它类型消息
            else {
                // 己监听MMI通用消息，或消息模块不一致
                if (references > 0 || str !== prefix) {
                    throw Error(`禁止跨模块监听消息，src:${suncore.MsgQModEnum[msgQMap[str]]}, dest:${suncore.MsgQModEnum[msgQMap[prefix]]}`);
                }
            }

            // 若为MMI通用消息，则只产生MMI引用次数
            if (prefix === MMI_COMMAND_PREFIX) {
                target[MUTEX_MMI_REFERENCES_KEY] = references - 1;
                if (references === 1) {
                    delete target[MUTEX_MMI_REFERENCES_KEY];
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