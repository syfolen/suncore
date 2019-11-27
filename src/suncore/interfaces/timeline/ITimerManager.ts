
module suncore {
    /**
     * 定时器管理器接口
     */
    export interface ITimerManager {

        /**
         * 响应定时器
         */
        executeTimer(): void;

        /**
         * 添加游戏定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 循环设定次数，默认为1
         * @real: 是否计算真实次数，默认为false
         * @timerId: 定时器编号，请勿擅自传入此参数，防止定时器工作出错
         * @timestamp: 定时器的创建时间，请勿擅自传入此参数，防止定时器工作出错
         * @timeout: 定时器上次响应时间，请勿擅自传入此参数，防止定时器工作出错
         * @repeat: 当前重复次数
         */
        addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops?: number, real?: boolean, timerId?: number, timestamp?: number, timeout?: number, repeat?: number): number;

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