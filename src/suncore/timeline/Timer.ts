
module suncore {
    /**
     * 自定义定时器
     */
    export class Timer implements ITimer {
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
         * 时钟是否跳帧，若为 true ，则在单位时间间隔内，回调会连续执行多次
         */
        jumpFrame: boolean = false;

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
        createTime: number = 0;

        /**
         * 超时时间，当系统时间大于或等于超时时间时，定时器会被响应
         */
        timeout: number = 0;

        recover(): void {
            this.mod = ModuleEnum.SYSTEM;
            this.active = false;
            this.delay = 0;
            this.method = null;
            this.caller = null;
            this.args = null;
            this.jumpFrame = false;
            this.count = 0;
            this.loops = 0;
            this.timerId = 0;
            this.createTime = 0;
            this.timeout = 0;
            suncom.Pool.recover("suncore.Timer", this);
        }
    }
}