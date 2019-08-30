
module suncore {

    /**
     * 核心类
     */
    export class Engine implements IEngine {
        /**
         * 运行时间
         */
        private $runTime: number = 0;

        /**
         * 帧时间间隔（毫秒）
         */
        private $delta: number = 0;

        /**
         * 本地时间
         */
        private $localTime: number = new Date().valueOf();

        constructor() {
            // 注册帧事件
            Laya.timer.frameLoop(1, this, this.$onFrameLoop);
        }

        /**
         * 销毁对象
         */
        destroy(): void {
            Laya.timer.clear(this, this.$onFrameLoop);
        }

        /**
         * 帧事件
         */
        private $onFrameLoop(): void {
            // 本地历史时间
            const oldTime: number = this.$localTime;
            // 本地当前时间
            this.$localTime = new Date().valueOf();

            // 帧间隔时间
            this.$delta = this.$localTime - oldTime;

            // 若帧间隔时间大于 0 ，则驱动系统运行
            if (this.$delta > 0) {
                // 运行时间累加
                this.$runTime += this.$delta;
                // 时间流逝逻辑
                System.timeStamp.lapse(this.$delta);
            }
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