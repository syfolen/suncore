
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
         * 取消任务（内置接口，请勿调用）
         * 说明：
         * 1. 当消息因时间轴停止而被清理时，此方法会被自动执行
         * export
         */
        cancel(): void;

        /**
         * 销毁任务
         * 说明：
         * 1. 请调用此方法来销毁任务而非调用cancel接口
         * 2. 重写此方法时请先调用此方法，否则可能会引起问题
         */
        destroy(): void;

        /**
         * 是否正在运行
         * export
         */
        readonly running: boolean;

        /**
         * 是否己销毁
         */
        readonly destroyed: boolean;
    }
}