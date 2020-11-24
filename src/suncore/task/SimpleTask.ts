
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
        protected $_args: any[] = null;

        /**
         * 回调方法
         */
        protected $_method: Function = null;

        /**
         * 回调对象
         */
        protected $_caller: Object = null;

        /**
         * export
         */
        constructor(caller: Object, method: Function, args: any[] = null) {
            super();
            this.$_args = args;
            this.$_caller = caller;
            this.$_method = method;
        }

        /**
         * 执行函数，只能返回: true
         * export
         */
        run(): boolean {
            // 执行任务
            this.$_method.apply(this.$_caller, this.$_args);

            return true;
        }
    }
}