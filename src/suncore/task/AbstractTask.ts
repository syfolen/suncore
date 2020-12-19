
module suncore {
    /**
     * export
     */
    export abstract class AbstractTask extends puremvc.Notifier implements ITask {
        /**
         * 任务是否己经完成
         */
        private $var_done: boolean = false;

        /**
         * 是否正在运行
         */
        private $var_running: boolean = false;

        /**
         * export
         */
        abstract run(): boolean;

        /**
         * export
         */
        cancel(): void {

        }

        /**
         * export
         */
        get done(): boolean {
            return this.$var_done;
        }
        /**
         * depends
         */
        set done(yes: boolean) {
            if (this.$var_done !== yes) {
                this.$var_done = yes;
                if (yes === true) {
                    this.cancel();
                }
            }
        }

        /**
         * export
         */
        get running(): boolean {
            return this.$var_running;
        }
        set running(yes: boolean) {
            this.$var_running = yes;
        }
    }
}