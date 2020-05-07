
module suncore {
    /**
     * 测试行为配置接口
     */
    export interface ITestActionCfg {
        /**
         * 测试ID
         */
        id: number;

        /**
         * 测试序号
         */
        seqId: number;

        /**
         * 执行次数
         */
        exeTimes: number;

        /**
         * 回调（测试信号专用属性）
         */
        handler: suncom.IHandler;
    }
}