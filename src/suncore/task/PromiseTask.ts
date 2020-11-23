
module suncore {
    /**
     * 承诺消息对象
     * 说明：
     * 1. 承诺的回调函数中最后一个参数为resolve方法，你应当在合适的时候调用此方法来结束承诺
     * export
     */
    export class PromiseTask extends SimpleTask {

        /**
         * 执行函数
         * export
         */
        run(): boolean {
            const method: Function = this.$resolve.bind(this);
            // 执行任务
            this.$method.apply(this.$caller, this.$args === null ? [method] : [method].concat(this.$args));

            return this.done;
        }

        /**
         * 异步方法
         */
        private $resolve(): void {
            this.done = true;
        }
    }
}