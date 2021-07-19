
module suncore {
    /**
     * 自定义定时器
     */
    export interface ITimer {
        /**
         * 模块
         */
        mod: ModuleEnum;

        /**
         * 是否己激活
         */
        active: boolean;

        /**
         * 响应延时
         */
        delay: number;

        /**
         * 回调函数
         */
        method: Function;

        /**
         * 回调对象
         */
        caller: Object;

        /**
         * 参数列表
         */
        args: any[];

        /**
         * 统计真实响应次数
         * 说明：
         * 1. 为 false 时，定时器实际响应次数可能不足设定次数
         * 2. 在侧重于次数精准统计的应用中，建议此参数为 true
         * 3. 在侧重于时间精准统计的应用中，建议此参数为 false
         */
        jumpFrame: boolean;

        /**
         * 当前重复次数
         */
        count: number;

        /**
         * 循环设定次数
         */
        loops: number;

        /**
         * 定时器编号
         */
        timerId: number;

        /**
         * 创建时间
         */
        createTime: number;

        /**
         * 超时时间，当系统时间大于或等于超时时间时，定时器会被响应
         */
        timeout: number;

        recover(): void;
    }
}