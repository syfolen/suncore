
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
         * 是否正在运行（内置变量，请勿操作）
         * export
         */
        protected $running: boolean = false;

        /**
         * 是否己销毁
         * export
         */
        protected $destroyed: boolean = false;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         * export
         */
        abstract run(): boolean;

        /**
         * 任务取消（内置接口，请勿调用）
         * 说明：
         * 1. 当消息因时间轴停止而被清理时，此方法会被自动执行
         * export
         */
        cancel(): void {

        }

        /**
         * 销毁任务
         * 说明：
         * 1. 请调用此方法来销毁任务而非调用cancel接口
         * 2. 重写此方法时请先调用此方法，否则可能会引起问题
         */
        destroy(): void {
            this.$running = false;
            this.$destroyed = true;
        }

        /**
         * 是否己完成
         */
        get done(): boolean {
            return this.$done;
        }
        set done(yes: boolean) {
            this.$done = yes;
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

        /**
         * 是否己销毁
         */
        get destroyed(): boolean {
            return this.$destroyed;
        }
    }
}