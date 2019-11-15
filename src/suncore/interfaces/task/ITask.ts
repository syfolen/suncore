
module suncore {

    /**
     * 任务接口
     */
    export interface ITask {
        /**
         * 任务是否己经完成
         */
        done: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成
         */
        run(): boolean;

        /**
         * 取消任务
         */
        cancel(): void;
    }
}