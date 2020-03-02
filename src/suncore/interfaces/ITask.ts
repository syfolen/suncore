
module suncore {
    /**
     * 任务接口
     * 说明：
     * 1. Task支持
     * export
     */
    export interface ITask {
        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成
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

        /**
         * 是否正在运行
         * export
         */
        readonly running: boolean;
    }
}