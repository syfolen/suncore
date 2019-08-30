
module suncore {

    /**
     * 游戏时间轴接口
     */
    export interface ITimeline {

        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        lapse(delta: number): void;

        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        pause(): void;

        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认false
         */
        resume(paused?: boolean): void;

        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        stop(): void;

        /**
         * 获取系统时间戳（毫秒）
         */
        getTime(): number;

        /**
         * 获取帧时间间隔（毫秒）
         */
        getDelta(): number;

        /**
         * 时间轴是否己暂停
         */
        readonly paused: boolean;

        /**
         * 时间轴是否己停止
         */
        readonly stopped: boolean;

        /**
         * 帧同步是否己开启
         */
        readonly lockStep: boolean;
    }
}