
module suncore {
    /**
     * 定时器管理器
     */
    export class TimerManager {
        /**
         * 回收站
         */
        private $pool: Timer[] = [];

        /**
         * 定时器种子
         */
        private $seedId: number = 0;

        /**
         * 定时器列表
         */
        private $timers: Timer[][] = [];

        /**
         * 定时器集合
         */
        private $timerMap: { [id: number]: Timer } = {};

        constructor() {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$timers[mod] = [];
            }
        }

        /**
         * 生成新的定时器索引
         */
        private $createNewTimerId(): number {
            this.$seedId++;
            return this.$seedId;
        }

        /**
         * 响应定时器
         */
        executeTimer(): void {
            // 遍历所有模块中的所有定时器
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                // 当前模块未暂停
                if (System.isModulePaused(mod) === false) {
                    // 获取模块中的所有定时器
                    const timers: Timer[] = this.$timers[mod];
                    // 获取当前时间戳
                    const timestamp: number = System.getModuleTimestamp(mod);
                    // 对模块中的所有定时器进行遍历
                    while (timers.length > 0) {
                        const timer: Timer = timers[0];

                        // 若定时器有效
                        if (timer.active === true) {
                            // 若定时器未到响应时间，则跳出
                            if (timer.timeout > timestamp) {
                                break;
                            }
                            // 若 real 为 true ，则对执行次数进行真实递增
                            if (timer.real === true) {
                                timer.count++;
                            }
                            // 否则计算当前理论上的响应次数
                            else {
                                timer.count = Math.min(Math.floor((timestamp - timer.timestamp) / timer.delay), timer.loops);
                            }
                        }

                        let recycle: boolean = false;
                        // 移除无效定时器
                        if (timer.active === false || (timer.loops > 0 && timer.count >= timer.loops)) {
                            recycle = true;
                        }
                        else {
                            this.addTimer(timer.mod, timer.delay, timer.method, timer.caller, timer.args, timer.loops, timer.real, timer.timerId, timer.timestamp, timer.timeout, timer.count);
                        }
                        timers.shift();

                        if (timer.active === true) {
                            if (timer.args === null) {
                                timer.method.call(timer.caller, timer.count, timer.loops);
                            }
                            else {
                                timer.method.apply(timer.caller, timer.args.concat(timer.count, timer.loops));
                            }
                        }
                        recycle === true && this.$recover(timer);
                    }
                }
            }
        }

        /**
         * 添加游戏定时器
         * @mod: 所属模块
         * @delay: 响应间隔，若为数组，则第个参数表示首次响应延时，若首次响应延时为0，则定时器会立即执行一次
         * @method: 回调函数，默认参数：{ count: number, loops: number }
         * @caller: 回调对象
         * @args[]: 参数列表
         * @loops: 循环设定次数
         * @real: 是否计算真实次数
         * @timerId: 定时器编号，请勿擅自传入此参数，防止定时器工作出错
         * @timestamp: 定时器的创建时间，请勿擅自传入此参数，防止定时器工作出错
         * @timeout: 定时器上次响应时间，请勿擅自传入此参数，防止定时器工作出错
         * @count: 当前重复次数
         */
        addTimer(mod: ModuleEnum, delay: number | number[], method: Function, caller: Object, args: any[] = null, loops: number = 1, real: boolean = false, timerId: number = 0, timestamp: number = -1, timeout: number = -1, count: number = 0): number {
            const currentTimestamp: number = System.getModuleTimestamp(mod);

            // 若编号未指定，则生成新的定时器
            if (timerId === 0) {
                timerId = this.$createNewTimerId();
            }
            // 若创建时间未指定，则默认为系统时间
            if (timestamp === -1) {
                timestamp = currentTimestamp;
            }
            // 若上次响应时间未指定，则默认为系统时间
            if (timeout === -1) {
                timeout = currentTimestamp;
            }

            let firstDelay: number;
            if (typeof delay === "number") {
                firstDelay = delay;
            }
            else {
                firstDelay = delay[1] || 0;
                delay = delay[0];
            }

            // 定时器执行间隔不得小于 1 毫秒
            if (delay < 1) {
                delay = 1;
            }

            // 响应时间偏差值
            let dev: number = 0;

            // 根据定时器的特性来修正下次响应时间
            if (real === true) {
                /**
                 * 若定时器侧重于真实响应次数统计
                 * 为了确保定时器的两次响应之间的时间间隔完全一致
                 * 定时器的响应时间偏差值应当根据上次定时器的响应时间来计算
                 */
                dev = (currentTimestamp - timeout) % delay;
            }
            else {
                /**
                 * 若定时器侧重于精准的时间统计
                 * 为了确保定时器开启与结束时的时间差与定时器的设定相符
                 * 定时器的响应时间偏差值应当根据定时器的创建时间来计算
                 */
                // 避免定时器响应时间不精确
                dev = (currentTimestamp - timestamp) % delay;
            }

            // 修正超时时间
            timeout = currentTimestamp + delay - dev;

            // 立即执行一次
            if (firstDelay === 0) {
                if (args === null) {
                    method.call(caller, 0, loops);
                }
                else {
                    method.apply(caller, args.concat(0, loops));
                }
            }
            // 修正首次响应时间
            else if (firstDelay < delay) {
                const offset: number = delay - firstDelay;
                timeout = suncom.Mathf.clamp(timeout - offset, currentTimestamp + 1, timeout);
            }

            // 对定时器进行实例化
            const timer: Timer = this.$pool.length > 0 ? this.$pool.pop() : new Timer();
            timer.mod = mod;
            timer.active = true;
            timer.delay = delay;
            timer.method = method;
            timer.caller = caller;
            timer.args = args;
            timer.real = real;
            timer.count = count;
            timer.loops = loops;
            timer.timerId = timerId;
            timer.timestamp = timestamp;
            timer.timeout = timeout;

            // 获取对应模块的定时器列表
            const timers: Timer[] = this.$timers[mod];

            let index: number = -1;

            let min: number = 0;
            let mid: number = 0;
            let max: number = timers.length - 1;

            while (max - min > 1) {
                mid = Math.floor((min + max) * 0.5);
                if (timers[mid].timeout <= timeout) {
                    min = mid;
                }
                else if (timers[mid].timeout > timeout) {
                    max = mid;
                }
                else {
                    break;
                }
            }

            for (let i: number = min; i <= max; i++) {
                if (timers[i].timeout > timeout) {
                    index = i;
                    break;
                }
            }

            if (index < 0) {
                timers.push(timer);
            }
            else {
                timers.splice(index, 0, timer);
            }
            this.$timerMap[timerId] = timer;

            return timerId;
        }

        /**
         * 移除定时器
         * NOTE: 固定返回 0 ，方便外部用返回值清空 timerId
         */
        removeTimer(timerId: number): number {
            if (timerId > 0 && this.$timerMap[timerId] !== void 0) {
                this.$timerMap[timerId].active = false;
            }
            return 0;
        }

        /**
         * 清除指定模块下的所有定时器
         */
        clearTimer(mod: ModuleEnum): void {
            const timers: Timer[] = this.$timers[mod];
            while (timers.length > 0) {
                const timer: Timer = timers.pop();
                this.$timerMap[timer.timerId] !== void 0 && this.$recover(timer);
            }
        }

        /**
         * 回收定时器对象
         */
        private $recover(timer: Timer): void {
            if (timer.timerId > 0) {
                timer.timerId = 0;
                this.$pool.push(timer);
                delete this.$timerMap[timer.timerId];
            }
        }
    }
}