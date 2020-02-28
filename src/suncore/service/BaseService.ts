
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
         * 服务是否己启动
         */
        protected $running: boolean = false;

        /**
         * 服务启动入口
         * export
         */
        run(): void {
            if (this.$running === true) {
                console.warn(`服务[${suncom.Common.getQualifiedClassName(this)}]己运行`);
                return;
            }
            this.$running = true;
            this.$onRun();
        }

        /**
         * 服务停止接口
         * export
         */
        stop(): void {
            if (this.$running === false) {
                console.warn(`服务[${suncom.Common.getQualifiedClassName(this)}]未运行`);
                return;
            }
            this.$running = false;
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
         * 服务是否正在运行
         * export
         */
        get running(): boolean {
            return this.$running;
        }
    }
}