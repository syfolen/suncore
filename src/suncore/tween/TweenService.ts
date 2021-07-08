
module suncore {
    /**
     * 缓动服务类，专门用于管理缓动
     */
    export class TweenService extends BaseService {
        static readonly NAME: string = "suncore.TweenService";

        /**
         * 缓动对象列表
         */
        private $tweens: Tween[] = [];

        /**
         * 避免添加或移除缓动对象时对正在执行的缓动列表产生干扰
         */
        private $locker: boolean = false;

        protected $onRun(): void {
            this.facade.registerObserver(NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this, false, suncom.EventPriorityEnum.EGL);
            this.facade.registerObserver(NotifyKey.DRIVE_TWEEN_TICK, this.$onDriveTweenTick, this);
            this.facade.registerObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onRegisterTweenObject, this);
        }

        protected $onStop(): void {
            this.facade.removeObserver(NotifyKey.PAUSE_TIMELINE, this.$onTimelinePause, this);
            this.facade.removeObserver(NotifyKey.DRIVE_TWEEN_TICK, this.$onDriveTweenTick, this);
            this.facade.removeObserver(NotifyKey.REGISTER_TWEEN_OBJECT, this.$onRegisterTweenObject, this);
        }

        /**
         * 时间轴暂停事件回调，仅关心停止事件
         */
        private $onTimelinePause(mod: ModuleEnum, stop: boolean): void {
            if (stop === true) {
                for (let i: number = 0; i < this.$tweens.length; i++) {
                    const tween: Tween = this.$tweens[i];
                    if (tween.var_mod === mod) {
                        tween.cancel();
                    }
                }
            }
        }

        /**
         * 时间流逝
         */
        private $onDriveTweenTick(): void {
            this.$locker = true;

            // 使用临时变量持有tweens列表，因为列表在执行的过程中可能会被复制
            const tweens: Tween[] = this.$tweens;

            for (let mod: ModuleEnum = 0; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) === false) {
                    for (let i: number = 0; i < tweens.length; i++) {
                        const tween: Tween = tweens[i];
                        if (tween.var_mod === mod) {
                            let timeLeft: number = 1;
                            while (timeLeft > 0 && tween.var_canceled === false && tween.var_recovered === false) {
                                timeLeft = tween.func_doAction();
                            }
                        }
                    }
                }
            }

            // 移除己被取消的缓动对象
            for (let i: number = this.$tweens.length - 1; i > -1; i--) {
                const tween: Tween = this.$tweens[i];
                if (tween.func_getUsePool() === true) {
                    if (tween.var_canceled === false) {
                        continue;
                    }
                }
                else if (tween.var_recovered === false) {
                    continue;
                }
                tweens.splice(i, 1)[0].func_recover();
            }

            this.$locker = false;
        }

        /**
         * 添加缓动对象
         */
        private $onRegisterTweenObject(tween: Tween): void {
            // 避免干扰
            if (this.$locker === true) {
                this.$tweens = this.$tweens.slice(0);
                this.$locker = false;
            }
            this.$tweens.push(tween);
        }
    }
}