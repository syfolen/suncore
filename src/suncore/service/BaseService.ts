
module suncore {
    /**
     * 服务（主要用于逻辑层架构）
     * 说明：
     * 1. 每个服务均有独立的生命周期。
     * 2. 服务被设计用来处理与表现层无关的有状态业务。
     * export
     */
    export abstract class BaseService extends puremvc.Notifier implements IService {
        /**
         * 服务是否己启动（内置属性，请勿操作）
         * export
         */
        private $running: boolean = false;

        /**
         * 服务启动入口
         * export
         */
        run(): void {
            if (this.$running === true) {
                suncom.Logger.warn(suncom.DebugMode.ANY, `服务[${suncom.Common.getQualifiedClassName(this)}]己运行`);
                return;
            }
            this.$running = true;
            this.$onRun();
            suncom.Test.assertTrue(this.$running);
            // 使用$frameLoop来替代ENTER_FRAME事件来保证执行顺序
            suncom.Test.assertTrue(this.facade.hasObserver(NotifyKey.ENTER_FRAME, null, this), `请重写$frameLoop方法来替代ENTER_FRAME事件`);
            if (this.$frameLoop !== BaseService.prototype.$frameLoop) {
                this.facade.registerObserver(NotifyKey.ENTER_FRAME, this.$onEnterFrame, this, false, suncom.EventPriorityEnum.EGL);
            }
        }

        /**
         * 服务停止接口
         * export
         */
        stop(): void {
            if (this.$running === false) {
                suncom.Logger.warn(suncom.DebugMode.ANY, `服务[${suncom.Common.getQualifiedClassName(this)}]未运行`);
                return;
            }
            this.$running = false;
            this.$onStop();
            suncom.Test.assertFalse(this.$running);
            if (this.$frameLoop !== BaseService.prototype.$frameLoop) {
                this.facade.removeObserver(NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            }
        }

        /**
         * 帧事件回调
         */
        private $onEnterFrame(): void {
            if (this.$running === true) {
                this.$frameLoop();
            }
        }

        /**
         * 帧循环事件（请重写此方法来替代ENTER_FRAME事件）
         * export
         */
        protected $frameLoop(): void {

        }

        /**
         * 启动回调
         * export
         */
        protected abstract $onRun(): void;

        /**
         * 停止回调
         * export
         */
        protected abstract $onStop(): void;

        /**
         * 服务是否正在运行
         * export
         */
        get running(): boolean {
            return this.$running;
        }
    }
}