
module suncore {
    /**
     * 框架引擎
     * 
     * 此类实现了整个客户端的核心机制，包括：
     * 1. 系统时间戳实现
     * 2. 游戏时间轴调度
     * 3. 自定义定时器调度
     * 4. 不同类型游戏消息的派发
     */
    export class Engine extends puremvc.Notifier {
        /**
         * 帧时间间隔（毫秒）
         */
        private $delta: number = 0;

        /**
         * 运行时间
         */
        private $runTime: number = 0;

        /**
         * 本地时间
         */
        private $localTime: number = Date.now();

        constructor() {
            super();
            Laya.timer.frameLoop(1, this, this.$onFrameLoop);
            runService(TweenService.NAME, new TweenService());
        }

        /**
         * 销毁对象
         */
        destroy(): void {
            if (this.$destroyed === false) {
                Laya.timer.clear(this, this.$onFrameLoop);
                stopService(TweenService.NAME);
                super.destroy();
            }
        }

        /**
         * 帧事件
         */
        private $onFrameLoop(): void {
            if (this.$destroyed === false) {
                // 本地历史时间
                const oldTime: number = this.$localTime;
                // 本地当前时间
                this.$localTime = Date.now();

                // 帧间隔时间
                this.$delta = this.$localTime - oldTime;

                // 若帧间隔时间大于 0 ，则驱动系统运行
                if (this.$delta > 0) {
                    // 运行时间累加
                    this.$runTime += this.$delta;
                    // 时间流逝逻辑
                    this.$tick(this.$delta);
                }
            }
        }

        /**
         * 时间流逝逻辑
         */
        private $tick(delta: number): void {
            // 场景时间轴未暂停
            if (System.isModulePaused(ModuleEnum.CUSTOM) === false) {
                M.timeStamp.tick(delta);
            }
            // 游戏时间轴未暂停
            if (System.isModulePaused(ModuleEnum.TIMELINE) === false) {
                M.timeline.tick(delta);
            }

            // 优先广播网络数据（谨慎修改）
            // this.facade.sendNotification(NotifyKey.MSG_Q_BUSINESS, MsgQModEnum.NSL);

            // 物理相关事件
            this.facade.sendNotification(NotifyKey.PHYSICS_PREPARE);
            this.facade.sendNotification(NotifyKey.PHYSICS_FRAME);

            // 定时器和缓动都不属于帧逻辑
            M.timerManager.executeTimer();
            this.facade.sendNotification(NotifyKey.DRIVE_TWEEN_TICK);

            // 始终派发帧相关事件
            this.facade.sendNotification(NotifyKey.ENTER_FRAME);

            // 处理消息
            M.messageManager !== null && M.messageManager.dealMessage();
            // 处理临时消息
            M.messageManager !== null && M.messageManager.classifyMessages0();

            // 始终派发帧相关事件
            this.facade.sendNotification(NotifyKey.LATER_FRAME);
        }

        /**
         * 获取系统运行时间（毫秒）
         */
        getTime(): number {
            return this.$runTime;
        }

        /**
         * 获取帧时间间隔（毫秒）
         */
        getDelta(): number {
            return this.$delta;
        }
    }
}