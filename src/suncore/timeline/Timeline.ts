
module suncore {
    /**
     */
    export class Timeline implements ITimeline {
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

        lapse(delta: number): void {
            // 运行时间累加（毫秒）
            this.$runTime += delta;
        }

        pause(stop: boolean): void {
            this.$paused = true;
            this.$stopped = stop;
        }

        resume(paused: boolean): void {
            this.$paused = paused;
            this.$stopped = false;
        }

        getTime(): number {
            return this.$runTime;
        }

        get paused(): boolean {
            return this.$paused;
        }

        get stopped(): boolean {
            return this.$stopped;
        }
    }
}