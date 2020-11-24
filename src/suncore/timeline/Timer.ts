
module suncore {
    /**
     * 自定义定时器
     */
    export class Timer {
        /**
         * 模块
         */
        mod: ModuleEnum = ModuleEnum.SYSTEM;

        /**
         * 是否己激活
         */
        active: boolean = false;

        /**
         * 响应延时
         */
        delay: number = 0;

        /**
         * 回调函数
         */
        method: Function = null;

        /**
         * 回调对象
         */
        caller: Object = null;

        /**
         * 参数列表
         */
        args: any[] = null;

        /**
         * 统计真实响应次数
         * 说明：
         * 1. 为 false 时，定时器实际响应次数可能不足设定次数
         * 2. 在侧重于次数精准统计的应用中，建议此参数为 true
         * 3. 在侧重于时间精准统计的应用中，建议此参数为 false
         */
        real: boolean = false;

        /**
         * 当前重复次数
         */
        count: number = 0;

        /**
         * 循环设定次数
         */
        loops: number = 1;

        /**
         * 定时器编号
         */
        timerId: number = 0;

        /**
         * 创建时间
         */
        timestamp: number = -1;

        /**
         * 超时时间，当系统时间大于或等于超时时间时，定时器会被响应
         */
        timeout: number = 0;

        recover(): void {
            this.method = null;
            this.caller = null;
            this.args = null;
            suncom.Pool.recover("suncore.Timer", this);
        }
    }
}