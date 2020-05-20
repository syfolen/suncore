
module suncore {
    /**
     * 测试任务
     * 说明：
     * 1. 测试任务消息有独立的阻塞机制，且不设分组
     * export
     */
    export abstract class TestTask extends suncore.AbstractTask {
        /**
         * 测试用例编号
         * export
         */
        protected $testId: number;

        /**
         * 退出延时（毫秒）
         */
        private $exitDelayTime: number = 0;

        /**
         * 退出定时器
         */
        private $timerId: number = 0;

        /**
         * export
         */
        constructor(testId: number) {
            super(0);
            this.$testId = testId;
        }

        /**
         * 初始化任务状态
         * export
         */
        run(): boolean {
            this.$beforeAll();
            this.facade.registerObserver(suncom.NotifyKey.TEST_CASE_DONE, this.$onTestCaseDone, this, true);
            return false;
        }

        /**
         * 注销任务的所有状态
         * export
         */
        cancel(): void {
            suncom.Test.expect(this.$timerId).toBe(0);
        }

        private $onTestCaseDone(): void {
            this.done = true;
        }

        /**
         * 新增测试用例
         * @regOption: 默认为：APPEND
         * export
         */
        protected $addTest(tcId: number, taskCls: new (tcId: number) => TestTask, regOption: TestCaseRegOptionEnum = TestCaseRegOptionEnum.APPEND): void {
            const cfg: ITestCaseCfg = {
                tcId: tcId,
                taskCls: taskCls
            };
            if (regOption === TestCaseRegOptionEnum.APPEND) {
                M.tccQueue.push(cfg);
            }
            else {
                M.tccQueue.unshift(cfg);
            }
        }

        /**
         * 在所有脚本执行以后
         * export
         */
        protected $afterAll(): void {

        }

        /**
         * 在每个脚本执行以后
         * export
         */
        protected $afterEach(testIdArray: number[], handler: suncom.IHandler): void {

        }

        /**
         * 在所有脚本执行以前
         * export
         */
        protected $beforeAll(): void {

        }

        /**
         * 在每个脚本执行以前
         * export
         */
        protected $beforeEach(testIdArray: number[], handler: suncom.IHandler): void {

        }

        /**
         * 在指定时间后退出（毫秒）
         * export
         */
        protected $exitInDelay(msec: number): void {
            this.$exitDelayTime = msec;
        }

        /**
         * 为测试添加描述
         * export
         */
        protected $describe(str: string): void {

        }

        /**
         * 为每个脚本添加描述
         * export
         */
        protected $describeEach(testIdArray: number[], str: string[]): void {

        }

        /**
         * 执行指定脚本
         * export
         */
        protected $test(testId: number): void {

        }

        /**
         * 执行每个脚本
         * export
         */
        protected $testEach(testIdArray: number[]): void {

        }

        /**
         * 跳过指定测试（只跳过一次）
         * export
         */
        protected $skip(testId: number): void {

        }

        /**
         * 跳过指定测试（每个都只跳过一次）
         * export
         */
        protected $skipEach(testIdArray: number[]): void {

        }
    }
}