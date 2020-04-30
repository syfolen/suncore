
module suncore {
    /**
     * 测试用例配置
     */
    export interface ITestCaseCfg {
        /**
         * 测试用例编号
         */
        tcId: number;

        /**
         * 任务类型
         */
        taskCls: new (tcId: number) => TestTask;
    }
}