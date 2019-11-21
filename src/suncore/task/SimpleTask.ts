
module suncore {

    /**
     * 简单任务对象
     * export
     */
    export class SimpleTask extends AbstractTask {
        /**
         * 任务逻辑Handler
         */
        private $handler: suncom.IHandler;

        /**
         * export
         */
        constructor(handler: suncom.IHandler) {
            super();
            this.$handler = handler;
        }

        /**
         * 执行函数
         * export
         */
        run(): boolean {
            // 执行任务
            this.$handler.run();

            return true;
        }
    }
}