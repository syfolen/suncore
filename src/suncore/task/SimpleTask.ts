
module suncore {
    /**
     * 简单任务对象
     * export
     */
    export class SimpleTask extends AbstractTask {
        /**
         * 回调参数列表
         */
        protected $var_args: any[] = null;

        /**
         * 回调对象
         */
        protected $var_caller: Object = null;

        /**
         * 回调方法
         */
        protected $var_method: Function = null;

        /**
         * export
         */
        constructor(caller: Object, method: Function, args: any[] = null) {
            super();
            this.$var_args = args;
            this.$var_caller = caller;
            this.$var_method = method;
        }

        /**
         * 执行函数，只能返回: true
         * export
         */
        run(): boolean {
            // 执行任务
            this.$var_method.apply(this.$var_caller, this.$var_args);

            this.$var_args = null;
            this.$var_caller = null;
            this.$var_method = null;

            return true;
        }
    }
}