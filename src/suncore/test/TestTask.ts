
module suncore {
    /**
     * 测试任务
     * 说明：
     * 1. 测试任务消息有独立的阻塞机制，且不设分组
     * export
     */
    export abstract class TestTask extends AbstractTask {

        /**
         * 测试序号种子
         */
        private static $testSeqSeedId: number = 0;

        /**
         * 当前测试序号
         */
        private static $currentTestSeqId: number = 1;

        /**
         * 测试用例编号
         * export
         */
        protected $testId: number;

        /**
         * 测试动作集
         */
        private $actions: ITestActionCfg[] = [];

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
            super(MsgQModEnum.KAL);
            this.$testId = testId;
        }

        /**
         * 初始化任务状态
         * export
         */
        run(): boolean {
            this.facade.registerObserver(suncom.NotifyKey.TEST_EMIT, this.$onTestEmit, this);
            this.facade.registerObserver(suncom.NotifyKey.TEST_WAIT, this.$onTestWait, this);
            this.facade.registerObserver(suncom.NotifyKey.TEST_EVENT, this.$onTestEvent, this);
            this.facade.registerObserver(suncom.NotifyKey.TEST_PROTOCAL, this.$onTestProtocal, this);
            this.$beforeAll();
            return false;
        }

        /**
         * 注销任务的所有状态
         * export
         */
        cancel(): void {
            suncom.Test.expect(this.$timerId).toBe(0);
            this.facade.removeObserver(suncom.NotifyKey.TEST_EMIT, this.$onTestEmit, this);
            this.facade.removeObserver(suncom.NotifyKey.TEST_WAIT, this.$onTestWait, this);
            this.facade.removeObserver(suncom.NotifyKey.TEST_EVENT, this.$onTestEvent, this);
            this.facade.removeObserver(suncom.NotifyKey.TEST_PROTOCAL, this.$onTestProtocal, this);
            suncom.Test.regButton(-1);
        }

        /**
         * 响应测试模块发射的信号
         * 说明：
         * 1. 信号的发射可能是非预期的，故不在预期内发射的信号应当被忽略
         */
        private $onTestEmit(id: number, args: any): void {
            if (this.$actions.length === 0) {
                return;
            }
            const cfg: ITestActionCfg = this.$actions[0];
            // 这里必须校验seqId，因为$doTestAction里校验不过会报错
            if (cfg.id === id && cfg.seqId === TestTask.$currentTestSeqId) {
                this.$doTestAction(args);
            }
        }

        /**
         * 实现测试模块等待信号的逻辑
         */
        private $onTestWait(id: number, handler: suncom.IHandler): void {
            const cfg: ITestActionCfg = this.$createTestActionCfg(id);
            cfg.handler = handler || null;
        }

        /**
         * 实现响应测试模块按钮点击事件的逻辑
         */
        private $onTestEvent(id: number, act: string, out: ITestSeqInfo): void {
            if (act === "reg") {
                const cfg: ITestActionCfg = this.$createTestActionCfg(id);
                out.seqId = cfg.seqId;
            }
            else if (act === "exe") {
                suncom.Test.expect(this.$actions.length).toBeGreaterThan(0);
                suncom.Test.expect(this.$actions[0].id).toBe(id);
                this.$doTestAction();
            }
            else {
                suncom.Test.notExpected();
            }
        }

        private $onTestProtocal(id: number, times: number, act: string, out: ITestSeqInfo): void {
            if (act === "reg") {
                const cfg: ITestActionCfg = this.$createTestActionCfg(id, times);
                out.seqId = cfg.seqId;
            }
            else if (act === "exe") {
                suncom.Test.expect(this.$actions.length).toBeGreaterThan(0);
                suncom.Test.expect(this.$actions[0].id).toBe(id);
                this.$doTestAction();
            }
            else {
                suncom.Test.notExpected();
            }
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

        /**
         * 新建测试行为配置
         */
        private $createTestActionCfg(id: number, exeTimes: number = 1): ITestActionCfg {
            const cfg: ITestActionCfg = {
                id: id,
                seqId: TestTask.createTestSeqId(),
                exeTimes: exeTimes,
                handler: null
            };
            this.$actions.push(cfg);
            return cfg;
        }

        /**
         * 执行测试行为
         */
        private $doTestAction(args?: any): void {
            suncom.Test.expect(this.$actions.length).toBeGreaterThan(0);

            const cfg: ITestActionCfg = this.$actions[0];
            const length: number = this.$actions.length;
            suncom.Test.expect(cfg.seqId).toBe(TestTask.$currentTestSeqId);

            cfg.exeTimes--;
            suncom.Test.expect(cfg.exeTimes).toBeGreaterOrEqualThan(0);
            if (cfg.exeTimes === 0) {
                this.$actions.shift();
                TestTask.$currentTestSeqId++;
            }

            let error: boolean = false;
            suncom.Test.expect(cfg.handler).not.toBeUndefined();
            if (cfg.handler !== null) {
                error = cfg.handler.runWith(args) === false;
            }

            // 若脚本执行失败，则应当还原测试
            if (error === true) {
                cfg.exeTimes++;
                this.$actions.unshift(cfg);
                suncom.Test.expect(this.$actions.length).toBe(length);
                TestTask.$currentTestSeqId--;
            }

            if (this.$actions.length === 0) {
                this.$afterAll();
                suncom.Test.expect(this.$actions.length).toBe(0);
                if (this.$exitDelayTime > 0) {
                    this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, this.$exitDelayTime, this.$doExit, this);
                }
                else {
                    this.done = true;
                }
            }
        }

        /**
         * 延时退出执行函数
         */
        private $doExit(): void {
            suncom.Test.expect(this.$actions.length).toBe(0);
            this.$timerId = 0;
            this.done = true;
        }

        /**
         * 设置测试序号
         * export
         */
        static createTestSeqId(): number {
            TestTask.$testSeqSeedId++;
            return TestTask.$testSeqSeedId
        }

        /**
         * 当前序列号
         * export
         */
        static get currentTestSeqId(): number {
            return TestTask.$currentTestSeqId;
        }
    }
}