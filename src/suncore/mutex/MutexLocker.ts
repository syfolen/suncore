
module suncore {
    /**
     * 互斥锁
     */
    export class MutexLocker {
        /**
         * 对象所监听的命令前缀标记（监听普通MsgQ消息时产生）
         */
        static readonly MUTEX_PREFIX_KEY: string = "suncore$mutex$prefix";

        /**
         * 对象的系统互斥计数标记
         */
        static readonly MUTEX_REFERENCE_SYS: string = "suncore$mutex$reference$sys";

        /**
         * 对象的MMI互斥计数标记
         */
        static readonly MUTEX_REFERENCE_MMI: string = "suncore$mutex$reference$mmi";

        /**
         * 对象的普通互斥计数标记
         */
        static readonly MUTEX_REFERENCE_ANY: string = "suncore$mutex$reference$any";

        /**
         * 激活规则的模块
         */
        private $actMsgQMod: MsgQModEnum = MsgQModEnum.NIL;

        /**
         * 当前锁定的模块
         */
        private $curMsgQMod: MsgQModEnum = MsgQModEnum.NIL;

        /**
         * 互斥对象（统计项包括：SYS, MMI, ANY, PREFIX）
         */
        private $target: { [name: string]: any } = {};

        /**
         * 快照列表
         */
        private $snapshots: IMutexSnapshot[] = [];

        /**
         * 合法性断言
         */
        asserts(msgQMod: MsgQModEnum, target: Object): void {
            // 始终允许传递系统消息
            if (msgQMod === MsgQModEnum.SYS) {
                return;
            }

            // 锁定空模块，或锁定系统模块时，允许传递任意消息
            if (this.$curMsgQMod === MsgQModEnum.NIL || this.$curMsgQMod === MsgQModEnum.SYS) {
                return;
            }

            // 锁定MMI通用模块时，仅允许传递MMI消息
            if (this.$curMsgQMod === MsgQModEnum.MMI) {
                if (msgQMod === MsgQModEnum.MMI || Mutex.mmiMsgQMap[msgQMod] === true) {
                    return;
                }
            }
            // 仅允许传递当前模块消息
            else if (this.$curMsgQMod === msgQMod) {
                return;
            }
            // 对于MMI模块来说，MMI通用消息是个例外
            else if (msgQMod === MsgQModEnum.MMI && Mutex.mmiMsgQMap[this.$curMsgQMod] === true) {
                return;
            }

            if (target === null) {
                throw Error(`禁止跨模块传递消息，src:${suncore.MsgQModEnum[this.$curMsgQMod]}, dest:${suncore.MsgQModEnum[msgQMod]}`);
            }
            else {
                throw Error(`禁止跨模块监听消息，src:${suncore.MsgQModEnum[this.$curMsgQMod]}, dest:${suncore.MsgQModEnum[msgQMod]}`);
            }
        }

        /**
         * 更新锁信息
         */
        update(target: any): void {
            this.$target = target;

            if (target instanceof puremvc.Notifier) {
                this.$actMsgQMod = target.msgQMod;
            }
            else {
                this.$actMsgQMod = MsgQModEnum.MMI;
            }

            const prefix: string = target[MutexLocker.MUTEX_PREFIX_KEY] || null;
            if (prefix === null) {
                this.$curMsgQMod = this.$actMsgQMod;
            }
            else {
                this.$curMsgQMod = Mutex.msgQMap[prefix];
            }
        }

        /**
         * 锁定消息传递限制
         */
        lock(msgQMod: MsgQModEnum): void {
            let a: number = this.$target[MutexLocker.MUTEX_REFERENCE_SYS] || 0;
            let b: number = this.$target[MutexLocker.MUTEX_REFERENCE_MMI] || 0;
            let c: number = this.$target[MutexLocker.MUTEX_REFERENCE_ANY] || 0;

            if (msgQMod === MsgQModEnum.SYS) {
                a++;
            }
            else if (msgQMod === MsgQModEnum.MMI) {
                b++;
            }
            else {
                c++;
            }

            if (this.$curMsgQMod === MsgQModEnum.NIL || this.$curMsgQMod === MsgQModEnum.SYS) {
                this.$curMsgQMod = msgQMod;
            }
            else if (this.$curMsgQMod === MsgQModEnum.MMI && msgQMod !== MsgQModEnum.SYS) {
                this.$curMsgQMod = msgQMod;
            }

            this.$cache(a, b, c, false);
        }

        /**
         * 解除消息传递限制
         */
        unlock(msgQMod: MsgQModEnum): void {
            let a: number = this.$target[MutexLocker.MUTEX_REFERENCE_SYS] || 0;
            let b: number = this.$target[MutexLocker.MUTEX_REFERENCE_MMI] || 0;
            let c: number = this.$target[MutexLocker.MUTEX_REFERENCE_ANY] || 0;

            if (msgQMod === MsgQModEnum.SYS) {
                a--;
            }
            else if (msgQMod === MsgQModEnum.MMI) {
                b--;
            }
            else {
                c--;
            }

            if (a < 0 || b < 0 || c < 0) {
                throw Error(`互斥体释放错误：SYS[${a}], MMI[${b}], ANY[${c}]`);
            }

            if (this.$curMsgQMod === this.$actMsgQMod) {

            }
            else if (c > 0) {

            }
            else if (b > 0) {
                this.$curMsgQMod = MsgQModEnum.MMI;
            }
            else if (a > 0) {
                this.$curMsgQMod = MsgQModEnum.SYS;
            }
            else {
                this.$curMsgQMod = this.$actMsgQMod;
            }

            this.$cache(a, b, c, true);
        }

        /**
         * 激活模块
         */
        active(msgQMod: MsgQModEnum): void {
            if (this.$actMsgQMod === MsgQModEnum.NIL) {
                this.$actMsgQMod = this.$curMsgQMod = msgQMod;
            }
        }

        /**
         * 释放模块
         */
        deactive(): void {
            let a: number = this.$target[MutexLocker.MUTEX_REFERENCE_SYS] || 0;
            let b: number = this.$target[MutexLocker.MUTEX_REFERENCE_MMI] || 0;
            let c: number = this.$target[MutexLocker.MUTEX_REFERENCE_ANY] || 0;

            if (a === 0 && b === 0 && c === 0) {
                this.$actMsgQMod = this.$curMsgQMod = MsgQModEnum.NIL;
            }
        }

        /**
         * 缓存互斥信息
         */
        private $cache(a: number, b: number, c: number, d: boolean): void {
            if (a > 0) {
                this.$target[MutexLocker.MUTEX_REFERENCE_SYS] = a;
            }
            else if (d === true && this.$target[MutexLocker.MUTEX_REFERENCE_SYS] > 0) {
                delete this.$target[MutexLocker.MUTEX_REFERENCE_SYS];
            }

            if (b > 0) {
                this.$target[MutexLocker.MUTEX_REFERENCE_MMI] = b;
            }
            else if (d === true && this.$target[MutexLocker.MUTEX_REFERENCE_MMI] > 0) {
                delete this.$target[MutexLocker.MUTEX_REFERENCE_MMI];
            }

            if (c > 0) {
                this.$target[MutexLocker.MUTEX_PREFIX_KEY] = Mutex.msgQCmd[this.$curMsgQMod];
                this.$target[MutexLocker.MUTEX_REFERENCE_ANY] = c;
            }
            else if (d === true && this.$target[MutexLocker.MUTEX_REFERENCE_ANY] > 0) {
                delete this.$target[MutexLocker.MUTEX_PREFIX_KEY];
                delete this.$target[MutexLocker.MUTEX_REFERENCE_ANY];
            }
        }

        /**
         * 备份快照，并锁定一个全新的模块
         */
        backup(target: Object): void {
            let msgQMod: MsgQModEnum = null;
            if (target instanceof puremvc.Notifier) {
                msgQMod = target.msgQMod;
            }
            else {
                msgQMod = MsgQModEnum.MMI;
            }

            // 上下文环境不一致时，保存快照
            if (msgQMod !== this.$curMsgQMod) {
                const snapshot: IMutexSnapshot = {
                    data: this.$target,
                    actMsgQMod: this.$actMsgQMod,
                    curMsgQMod: this.$curMsgQMod
                };
                this.$snapshots.push(snapshot);

                this.$target = {};
                this.$actMsgQMod = this.$curMsgQMod = msgQMod;
            }
            // 否则是保存一份空快照
            else {
                this.$snapshots.push(null);
            }
        }

        /**
         * 恢复快照中的数据（自动从上次备份的快照中获取）
         */
        restore(): void {
            const snapshot: IMutexSnapshot = this.$snapshots.pop() || null;
            if (snapshot !== null) {
                this.$target = snapshot.data;
                this.$actMsgQMod = snapshot.actMsgQMod;
                this.$curMsgQMod = snapshot.curMsgQMod;
            }
        }

        get curMsgQMod(): MsgQModEnum {
            return this.$curMsgQMod;
        }
    }
}