
module suncore {
    /**
     * 简单任务对象
     * 说明：
     * export
     */
    export class SimpleTask extends AbstractTask {
        /**
         * 回调参数列表
         */
        protected $args: any[] = null;

        /**
         * 回调方法
         */
        protected $method: Function = null;

        /**
         * 回调对象
         */
        protected $caller: Object = null;

        constructor(caller: Object, method: Function, args: any[] = null) {
            super();
            this.$args = args;
            this.$caller = caller;
            this.$method = method;
        }

        /**
         * 执行函数
         * export
         */
        run(): boolean {
            // 执行任务
            this.$method.apply(this.$caller, this.$args);

            return true;
        }
    }
}