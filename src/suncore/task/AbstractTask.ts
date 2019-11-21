
module suncore {

    /**
     * 任务抽象类
     * export
     */
    export abstract class AbstractTask extends puremvc.Notifier implements ITask {

        /**
         * 外部会访问此变量来判断任务是否己经完成
         * export
         */
        protected $done: boolean = false;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         * export
         */
        abstract run(): boolean;

        /**
         * 取消任务
         */
        cancel(): void {

        }

        /**
         * 任务是否己经完成
         * export
         */
        get done(): boolean {
            return this.$done;
        }
        /**
         * export
         */
        set done(yes: boolean) {
            this.$done = yes;
        }
    }
}