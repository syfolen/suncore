
module suncore {

    /**
     * 时间轴类
     * 
     * 说明：
     * 1. 游戏时间轴实现
     * 1. 游戏时间轴中并没有关于计算游戏时间的真正的实现
     * 2. 若游戏是基于帧同步的，则游戏时间以服务端时间为准
     * 3. 若游戏是基于状态同步的，则游戏时间以框架时间为准
     * 
     * 注意：
     * 1. 由于此类为系统类，故请勿擅自对此类进行实例化
     */
    export class Timeline implements ITimeline {

        /**
         * 是否己暂停
         */
        protected $paused: boolean = true;

        /**
         * 是否己停止
         */
        protected $stopped: boolean = true;

        /**
         * 运行时间
         */
        private $runTime: number = 0;

        /**
         * 帧时间间隔（毫秒）
         */
        private $delta: number = 0;

        /**
         * 是否开启帧同步
         */
        private $lockStep: boolean;

        /**
         * @lockStep: 是否开启帧同步
         * 说明：
         * 1. 时间轴模块下的消息和定时器只有在时间轴被激活的情况下才会被处理。
         */
        constructor(lockStep: boolean) {
            // 是否开启帧同步
            this.$lockStep = lockStep;
        }

        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        lapse(delta: number): void {
            this.$delta = delta;
            // 运行时间累加
            this.$runTime += delta;
        }

        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        pause(): void {
            this.$paused = true;
        }

        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认false
         */
        resume(paused: boolean = false): void {
            this.$paused = paused;
            this.$stopped = false;
        }

        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        stop(): void {
            this.$stopped = true;
            // 清除定时器
            System.timeStamp.timerManager.clearTimer(ModuleEnum.TIMELINE);
            // 清除任务消息
            System.timeStamp.messageManager.clearMessages(ModuleEnum.TIMELINE);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMELINE_STOPPED);
        }

        /**
         * 获取系统时间戳（毫秒）
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

        /**
         * 时间轴是否己暂停
         */
        get paused(): boolean {
            return this.$paused;
        }

        /**
         * 时间轴是否己停止
         */
        get stopped(): boolean {
            return this.$stopped;
        }

        /**
         * 帧同步是否己开启
         */
        get lockStep(): boolean {
            return this.$lockStep;
        }
    }
}