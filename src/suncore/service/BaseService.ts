
module suncore {
    /**
     * export
     */
    export abstract class BaseService extends puremvc.Notifier implements IService {
        /**
         * 服务是否己启动
         */
        private $var_running: boolean = false;

        /**
         * export
         */
        run(): void {
            if (this.$var_running === true) {
                suncom.Logger.warn(`服务[${suncom.Common.getQualifiedClassName(this)}]己运行`);
                return;
            }
            this.$var_running = true;
            this.$onRun();
        }

        /**
         * export
         */
        stop(): void {
            if (this.$var_running === false) {
                suncom.Logger.warn(`服务[${suncom.Common.getQualifiedClassName(this)}]未运行`);
                return;
            }
            this.$var_running = false;
            this.$onStop();
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
         * export
         */
        get running(): boolean {
            return this.$var_running;
        }
    }
}