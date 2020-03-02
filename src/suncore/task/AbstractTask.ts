
module suncore {
    /**
     * 任务抽象类
     * 说明：
     * 1. Task对象有自己的生命周期管理机制，故不建议在外部持有
     * export
     */
    export abstract class AbstractTask extends puremvc.Notifier implements ITask {
        /**
         * 外部会访问此变量来判断任务是否己经完成
         */
        protected $done: boolean = false;

        /**
         * 是否正在运行
         */
        protected $running: boolean = false;

        /**
         * 任务是否己取消
         */
        protected $canceled: boolean = false;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         * export
         */
        abstract run(): boolean;

        /**
         * 任务被取消
         * 说明：
         * 1. 当消息因时间轴停止而被清理时，此方法会被自动执行，用于清理Task内部的数据
         * 2. 当done被设置为true时，此方法亦会被执行，请知悉
         * export
         */
        cancel(): void {

        }

        /**
         * 是否己完成
         * 说明：
         * 1. 请勿重写此getter和setter函数，否则可能会出问题
         * export
         */
        get done(): boolean {
            return this.$done;
        }
        /**
         * depends
         */
        set done(yes: boolean) {
            if (this.$done !== yes) {
                this.$done = yes;
                if (yes === true && this.$canceled === false) {
                    this.$canceled = true;
                    this.cancel();
                }
            }
        }

        /**
         * 是否正在运行
         * export
         */
        get running(): boolean {
            return this.$running;
        }
        set running(yes: boolean) {
            this.$running = yes;
        }
    }
}