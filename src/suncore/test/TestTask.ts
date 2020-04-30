
module suncore {
    /**
     * 测试任务
     * 说明：
     * 1. 测试任务消息有独立的阻塞机制，且不设分组
     * export
     */
    export abstract class TestTask extends AbstractTask {
        /**
         * 测试用例编号
         * export
         */
        protected $testId: number;

        /**
         * export
         */
        constructor(testId: number) {
            super(MsgQModEnum.KAL);
            this.$testId = testId;
        }

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         * 说明：
         * 1. 若无特别情况，一般不需要再对此方法进行重新
         * export
         */
        run(): boolean {
            this.$beforeAll();
            return false;
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