
module suncore {
    /**
     * 服务接口（主要用于逻辑层架构）
     * 说明：
     * 1. 每个服务均有独立的生命周期。
     * 2. 服务被设计用来处理与表现层无关的有状态业务。
     * export
     */
    export interface IService {

        /**
         * 服务启动入口
         * export
         */
        run(): void;

        /**
         * 服务停止接口
         * export
         */
        stop(): void;

        /**
         * 服务是否正在运行
         * export
         */
        readonly running: boolean;
    }
}