
module suncore {
    /**
     * 缓动类
     * 说明：
     * 1. 缓动类内置了对象池，当缓动结束或被取消后没有立即被指定动作，则会在下一帧自动回收
     * 2. 由于缓动对象只有在被回收后才会自动释放资源，故不建议在外部持有不工作的缓动对象
     * 3. 若你的需求必须这么做，则可以这么来防止Tween被回收：Tween.get(target).usePool(false);
     * 4. 当外部持有的Tween被弃用时，请记得及时回收
     * export
     */
    export class Tween extends puremvc.Notifier {
        /**
         * 唯一ID
         */
        private $var_hashId: number = 0;

        /**
         * 执行缓动的模块
         */
        private $var_mod: ModuleEnum = ModuleEnum.SYSTEM;

        /**
         * 缓动对象
         */
        private $var_target: any = null;

        /**
         * 最终属性（连续缓动时使用）
         */
        private $var_props: { [name: string]: number } = null;

        /**
         * 缓动信息列表
         */
        private $var_actions: TweenAction[] = [];

        /**
         * 是否使用对象池
         */
        private $var_usePool: boolean = false;

        /**
         * 是否己由外部回收
         */
        private $var_recovered: boolean = false;

        /**
         * 校正缓动开始的时间
         */
        private $var_correctTime: number = 0;

        private $func_setTo(target: any, mod: ModuleEnum): Tween {
            if (this.$var_hashId === 0) {
                throw Error(`Tween己被回收！！！`);
            }
            this.$var_mod = mod;
            this.$var_target = target;
            if (System.isModuleStopped(mod) === false) {
                this.facade.sendNotification(NotifyKey.REGISTER_TWEEN_OBJECT, this);
            }
            else {
                suncom.Logger.error(`尝试添加缓动，但时间轴己停止，mod:${ModuleEnum[mod]}`);
            }
            return this;
        }

        /**
         * 取消缓动
         * export
         */
        cancel(): Tween {
            for (const key in this.$var_props) {
                delete this.$var_props[key];
            }
            this.$var_props = null;
            while (this.$var_actions.length > 0) {
                this.$var_actions.pop().recover();
            }
            return this;
        }

        /**
         * 回收缓动对象
         * 说明：
         * 1. 你无需调用此方法，除非创建缓动的时候你没有使用对象池
         * export
         */
        recover(): void {
            this.$var_recovered = true;
        }

        /**
         * 回收到对象池
         */
        func_recover(): void {
            if (this.$var_hashId > 0) {
                this.$var_hashId = 0;
                this.$var_mod = ModuleEnum.SYSTEM;
                this.$var_target = null;
                this.$var_usePool = false;
                this.$var_recovered = false;
                this.$var_correctTime = 0;
                this.$removeFromTweens();
                suncom.Pool.recover("sunui.Tween", this.cancel());
            }
        }

        /**
         * 将缓动对象从全局列表中移除
         */
        private $removeFromTweens(): void {
            const tweens: Tween[] = M.tweens.get(this.$var_target);
            const index: number = tweens.indexOf(this);
            suncom.Test.expect(index).toBeGreaterOrEqualThan(0);
            tweens.splice(index, 1);
            tweens.length === 0 && M.tweens.remove(this.$var_target);
        }

        /**
         * 从当前属性缓动至props属性
         * @props: 变化的属性集合，其中update属性的类型只能指定为suncom.Handler，可用其来观察缓动数值的变化
         * @duration: 缓动时长
         * @ease: 缓动函数，默认为: null
         * @complete: 缓动结束时的回调，默认为: null
         * export
         */
        to(props: any, duration: number, ease: Function = null, complete: suncom.IHandler = null): Tween {
            const keys: string[] = Object.keys(props);
            const item: any = this.$var_props === null ? this.$var_target : this.$var_props;
            this.$func_createTweenInfo(keys, item, props, duration, ease, props.update || null, complete);
            return this;
        }

        /**
         * 从props属性缓动至当前属性
         * @参数详细说明请参考Tween.to
         * export
         */
        from(props: any, duration: number, ease: Function = null, complete: suncom.IHandler = null): Tween {
            const keys: string[] = Object.keys(props);
            const item: any = this.$var_props === null ? this.$var_target : this.$var_props;
            this.$func_createTweenInfo(keys, props, item, duration, ease, props.update || null, complete);
            return this;
        }

        /**
         * 以props属性的幅度进行缓动
         * @参数详细说明请参考Tween.to
         * export
         */
        by(props: any, duration: number, ease: Function = null, complete: suncom.IHandler = null): Tween {
            const keys: string[] = Object.keys(props);
            const item: any = this.$var_props === null ? this.$var_target : this.$var_props;

            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                // update 为函数，所以不需要累加
                if (key === "update") {
                    continue;
                }
                if (this.$var_props === null || this.$var_props[key] === void 0) {
                    props[key] += this.$var_target[key];
                }
                else {
                    props[key] += item[key];
                }
            }
            this.to(props, duration, ease, complete);
            return this;
        }

        /**
         * 生成缓动信息
         */
        private $func_createTweenInfo(keys: string[], from: any, to: any, duration: number, ease: Function, update: suncom.IHandler, complete: suncom.IHandler): void {
            // 最终属性
            this.$var_props = this.$var_props || {};

            const action: TweenAction = TweenAction.create();
            action.ease = ease;
            action.update = update;
            action.complete = complete;
            if (this.$var_correctTime > 0) {
                action.time = this.$var_correctTime;
                this.$var_correctTime = 0;
            }
            else {
                action.time = System.getModuleTimestamp(this.$var_mod);
            }
            action.duration = duration;

            // 解析动作列表
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                if (key === "update") {
                    continue;
                }
                const clip: TweenActionClip = TweenActionClip.create();
                clip.to = to[key];
                clip.from = from[key];
                clip.prop = key;
                if (clip.from === void 0) {
                    clip.from = this.$var_target[key];
                }
                // 更新最终属性，用来支持连续缓动的实现
                this.$var_props[key] = to[key];
                // 第一次执行from缓动时会有点问题
                if (this.$var_actions.length === 0) {
                    this.$var_target[clip.prop] = clip.from;
                }
                action.clips.push(clip);
            }
            if (action.update !== null) {
                action.update.run();
            }
            this.$func_addAction(action);
        }

        /**
         * 添加动作
         */
        private $func_addAction(action: TweenAction): void {
            if (this.$var_hashId === 0) {
                throw Error(`Tween己被回收！！！`);
            }
            if (this.$var_recovered === true) {
                throw Error(`Tween己被外部标记为回收！！！`);
            }
            this.$var_actions.push(action);
        }

        /**
         * 等待指定时间
         * export
         */
        wait(delay: number, complete: suncom.IHandler = null): Tween {
            const action: TweenAction = TweenAction.create();
            action.complete = complete;
            action.time = System.getModuleTimestamp(this.$var_mod);
            action.duration = delay;
            this.$func_addAction(action);
            return this;
        }

        /**
         * 执行动作
         * @return: 返回允许执行缓动的剩余时间
         */
        func_doAction(): number {
            const time: number = System.getModuleTimestamp(this.$var_mod);
            const action: TweenAction = this.$var_actions[0];

            // 缓动对象可能己经被销毁了
            if (this.$var_target instanceof fairygui.GObject) {
                if (this.$var_target.isDisposed === true) {
                    this.cancel();
                    return 0;
                }
            }
            else if (this.$var_target.destroyed === true) {
                this.cancel();
                return 0;
            }

            let done: boolean = false;
            let timeLeft: number = 0;
            let duration: number = time - action.time;

            if (duration > action.duration) {
                done = true;
                timeLeft = duration - action.duration;
                duration = action.duration;
            }

            const func: Function = action.ease || this.$func_easeNone;

            for (let i: number = 0; i < action.clips.length; i++) {
                const clip: TweenActionClip = action.clips[i];
                if (done === true) {
                    this.$var_target[clip.prop] = clip.to;
                }
                else {
                    this.$var_target[clip.prop] = func(duration, clip.from, clip.to - clip.from, action.duration);
                }
            }
            if (action.update !== null) {
                action.update.run();
            }

            if (done === false) {
                return 0;
            }
            this.$var_actions.shift();

            if (this.$var_actions.length > 0) {
                this.$var_actions[0].time = System.getModuleTimestamp(this.$var_mod);
            }
            action.complete !== null && action.complete.run();
            action.recover();

            return timeLeft;
        }

        /**
         * 默认的缓动函数
         */
        private $func_easeNone(t: number, b: number, c: number, d: number): number {
            let a: number = t / d;
            if (a > 1) {
                a = 1;
            }
            return a * c + b;
        }

        /**
         * 是否使用对象池
         * 说明：
         * 1. 若使用了对象池，且缓动结束或被取消后没有重新指定动作，则在下一帧自动回收
         * export
         */
        usePool(value: boolean): Tween {
            this.$var_usePool = value;
            return this;
        }

        /**
         * 校正缓动开始的时间戳
         * export
         */
        correctTimestamp(time: number): Tween {
            this.$var_correctTime = time;
            return this;
        }

        /**
         * 查询是否使用了对象池
         */
        func_getUsePool(): boolean {
            return this.$var_usePool;
        }

        /**
         * 执行缓动的模块
         */
        get var_mod(): ModuleEnum {
            return this.$var_mod;
        }

        /**
         * 缓动是否己取消
         */
        get var_canceled(): boolean {
            return this.$var_actions.length === 0;
        }

        /**
         * 缓动是否己被外部标记为回收
         */
        get var_recovered(): boolean {
            return this.$var_recovered;
        }

        /**
         * @target: 执行缓动的对象
         * @mod: 执行缓动的模块，默认为：CUSTOM
         * export
         */
        static get(target: any, mod: ModuleEnum = ModuleEnum.CUSTOM): Tween {
            const tween: Tween = suncom.Pool.getItemByClass("sunui.Tween", Tween);
            tween.$var_hashId = suncom.Common.createHashId();
            tween.$var_correctTime = 0;

            let tweens: Tween[] = M.tweens.get(target) || null;
            if (tweens === null) {
                tweens = [];
                M.tweens.set(target, tweens);
            }
            tweens.push(tween);

            return tween.usePool(true).$func_setTo(target, mod);
        }

        /**
         * 取消对象身上的所有缓动
         * export
         */
        static clearAll(target: any): any {
            const tweens: Tween[] = M.tweens.get(target) || null;
            if (tweens === null) {
                return target;
            }
            for (let i: number = 0; i < tweens.length; i++) {
                tweens[i].cancel().recover();
            }
            return target;
        }
    }
}