
module suncore {
    /**
     * 
     */
    export class Timeline implements ITimeline {
        /**
         * 运行时间（毫秒）
         */
        private $runTime: number = 0;

        /**
         * 固定帧运行时间
         */
        private $runTimeFixed: number = 0;

        /**
         * 物理帧运行时间
         */
        private $runTimePhsics: number = 0;

        /**
         * 使用帧同步技术
         */
        private $lockstep: boolean = false;

        /**
         * 逻辑帧时间间隔
         */
        private $interval: number = 0;

        /**
         * 是否己暂停
         */
        protected $paused: boolean = true;

        /**
         * 是否己停止
         */
        protected $stopped: boolean = true;

        constructor(lockstep: boolean, interval: number) {
            this.$lockstep = lockstep;
            this.$interval = interval;
        }

        lapse(delta: number): void {
            // 运行时间累加（毫秒）
            this.$runTime += delta;
        }

        fixed(): boolean {
            const interval: number = this.$lockstep === false ? 33 : this.$interval;
            if (this.$runTimeFixed + interval > this.$runTime) {
                return false;
            }
            else {
                this.$runTimeFixed += interval;
                return this.$lockstep;
            }
        }

        phsics(): boolean {
            if (this.$lockstep === false) {
                return;
            }
            if (this.$runTimePhsics + 33 > this.$runTime) {
                return false;
            }
            this.$runTimeFixed += 33;
            return true;
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

        getTimeFixed(): number {
            return this.$runTimeFixed;
        }

        getTimePhsics(): number {
            return this.$runTimePhsics;
        }

        get paused(): boolean {
            return this.$paused;
        }

        get stopped(): boolean {
            return this.$stopped;
        }
    }
}