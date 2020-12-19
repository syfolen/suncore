
module suncore {
    /**
     * 定时器管理器
     */
    export interface ITimerManager {

        /**
         * 响应定时器
         */
        executeTimer(): void;

        /**
         * 添加游戏定时器
         * @mod: 所属模块
         * @delay: 响应间隔，若为数组，则第个参数表示首次响应延时，若首次响应延时为0，则定时器会立即执行一次
         * @method: 回调函数，默认参数：{ count: number, loops: number }
         * @caller: 回调对象
         * @args[]: 参数列表，默认为: null
         * @loops: 循环设定次数，默认为: 1
         * @real: 是否计算真实次数，默认为: false
         * @timerId: 定时器编号，请勿擅自传入此参数，防止定时器工作出错，默认为: 0
         * @timestamp: 定时器的创建时间，请勿擅自传入此参数，防止定时器工作出错，默认为: -1
         * @timeout: 定时器上次响应时间，请勿擅自传入此参数，防止定时器工作出错，默认为: -1
         * @count: 当前重复次数，默认为: 0
         */
        addTimer(mod: ModuleEnum, delay: number | number[], method: Function, caller: Object, args?: any[], loops?: number, real?: boolean, timerId?: number, timestamp?: number, timeout?: number, count?: number): number;

        /**
         * 移除定时器
         * NOTE: 固定返回 0 ，方便外部用返回值清空 timerId
         */
        removeTimer(timerId: number): number;

        /**
         * 清除指定模块下的所有定时器
         */
        clearTimer(mod: ModuleEnum): void;
    }
}