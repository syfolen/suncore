
module suncore {

    /**
     * 系统时间戳
     * 
     * 此类实现了整个客户端的核心机制，包括：
     * 1. 系统时间戳实现
     * 2. 游戏时间轴调度
     * 3. 自定义定时器调度
     * 4. 不同类型游戏消息的派发
     */
    export class TimeStamp extends Timeline implements ITimeStamp {

        /**
         * 定时器管理器
         */
        private $timerManager: ITimerManager = new TimerManager();

        /**
         * 消息管理器
         */
        private $messageManager: IMessageManager = new MessageManager();

        constructor() {
            super(false);
        }

        /**
         * 帧事件
         */
        lapse(delta: number): void {
            // 游戏未暂停
            if (this.paused == false) {
                super.lapse(delta);

                // 时间轴未暂停
                if (System.timeline.paused == false) {
                    // 若游戏时间轴未开启帧同步，则直接对游戏时间进行同步
                    if (System.timeline.lockStep == false) {
                        System.timeline.lapse(delta);
                    }
                }
            }

            // 响应定时器
            this.$timerManager.executeTimer();

            // 处理消息
            this.$messageManager.dealMessage();
            // 处理临时消息
            this.$messageManager.classifyMessages0();

            // 始终派发帧事件
            puremvc.Facade.getInstance().sendNotification(NotifyKey.ENTER_FRAME);
        }

        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        stop(): void {
            this.$stopped = true;
            // 清除定时器
            System.timeStamp.timerManager.clearTimer(ModuleEnum.CUSTOM);
            // 清除任务消息
            System.timeStamp.messageManager.clearMessages(ModuleEnum.CUSTOM);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMESTAMP_STOPPED);
        }

        /**
         * 获取自定义定时器管理器
         */
        get timerManager(): ITimerManager {
            return this.$timerManager;
        }

        /**
         * 获取消息管理器
         */
        get messageManager(): IMessageManager {
            return this.$messageManager;
        }
    }
}