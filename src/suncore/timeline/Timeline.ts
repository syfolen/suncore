
module suncore {
    /**
     * 时间轴类
     * 说明：
     * 1. 游戏时间轴中并没有关于计算游戏时间的真正的实现
     * 注意：
     * 1. 由于此类为系统类，故请勿擅自对此类进行实例化
     * 2. 时间轴模块下的消息和定时器只有在时间轴被激活的情况下才会被处理。
     */
    export class Timeline {
        /**
         * 运行时间（毫秒）
         */
        private $runTime: number = 0;

        /**
         * 是否己暂停
         */
        protected $paused: boolean = true;

        /**
         * 是否己停止
         */
        protected $stopped: boolean = true;

        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        lapse(delta: number): void {
            // 运行时间累加（毫秒）
            this.$runTime += delta;
        }

        /**
         * 暂停时间轴
         * @stop: 是否停止时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        pause(stop: boolean): void {
            this.$paused = true;
            this.$stopped = stop;
        }

        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴
         */
        resume(paused: boolean): void {
            this.$paused = paused;
            this.$stopped = false;
        }

        /**
         * 获取时间戳（毫秒）
         */
        getTime(): number {
            return this.$runTime;
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
    }
}