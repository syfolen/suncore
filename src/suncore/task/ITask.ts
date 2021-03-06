
module suncore {
    /**
     * 任务抽象类
     * 说明：
     * 1. Task必定为MMI层对象，这是不可更改的
     * 2. Task一旦开始则不允许取消，可直接设置done为true来强制结束
     * 3. Task对象有自己的生命周期管理机制，故不建议在外部持有
     * export
     */
    export interface ITask extends puremvc.INotifier {
        /**
         * 是否己完成
         * 说明：
         * 1. 请勿重写此getter和setter函数，否则可能会出问题
         * export
         */
        done: boolean;

        /**
         * 是否正在运行
         * export
         */
        running: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         * export
         */
        run(): boolean;

        /**
         * 任务被取消
         * 说明：
         * 1. 当消息因时间轴停止而被清理时，此方法会被自动执行，用于清理Task内部的数据
         * 2. 当done被设置为true时，此方法亦会被执行，请知悉
         * export
         */
        cancel(): void;
    }
}