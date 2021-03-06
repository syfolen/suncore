
module suncore {
    /**
     * 定时器管理器
     */
    export class TimerManager implements ITimerManager {
        /**
         * 定时器列表
         */
        private $timers: ITimer[][] = [];

        /**
         * 定时器集合
         */
        private $timerMap: { [id: number]: ITimer } = {};

        constructor() {
            for (let mod: ModuleEnum = 0; mod < ModuleEnum.MAX; mod++) {
                this.$timers[mod] = [];
            }
        }

        executeTimer(): void {
            // 遍历所有模块中的所有定时器
            for (let mod: ModuleEnum = 0; mod < ModuleEnum.MAX; mod++) {
                // 当前模块未暂停
                if (System.isModulePaused(mod) === false) {
                    // 获取模块中的所有定时器
                    const timers: ITimer[] = this.$timers[mod];
                    // 获取当前时间戳
                    const now: number = System.getModuleTimestamp(mod);
                    // 对模块中的所有定时器进行遍历
                    while (timers.length > 0) {
                        const timer: ITimer = timers[0];
                        // 若定时器有效
                        if (timer.active === true) {
                            // 若定时器未到响应时间，则跳出
                            if (timer.timeout > now) {
                                break;
                            }
                            // 若 jumpFrame 为 true ，则对执行次数进行真实递增
                            if (timer.jumpFrame === true) {
                                timer.count++;
                            }
                            // 否则计算当前理论上的响应次数
                            else {
                                timer.count = Math.min(Math.floor((now - timer.createTime) / timer.delay), timer.loops);
                            }
                        }

                        // 移除无效定时器
                        if (timer.active === false || (timer.loops > 0 && timer.count >= timer.loops)) {
                            delete this.$timerMap[timer.timerId];
                        }
                        else {
                            this.addTimer(timer.mod, timer.delay, timer.method, timer.caller, timer.args, timer.loops, timer.jumpFrame, timer.timerId, timer.createTime, timer.timeout, timer.count);
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
                        timer.recover();
                    }
                }
            }
        }

        addTimer(mod: ModuleEnum, delay: number | number[], method: Function, caller: Object, args: any[] = null, loops: number = 1, jumpFrame: boolean = false, timerId: number = 0, createTime: number = -1, timeout: number = -1, count: number = 0): number {
            const currentTimestamp: number = System.getModuleTimestamp(mod);

            // 若编号未指定，则生成新的定时器
            if (timerId === 0) {
                timerId = suncom.Common.createHashId();
            }
            // 若创建时间未指定，则默认为系统时间
            if (createTime === -1) {
                createTime = currentTimestamp;
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
            if (jumpFrame === true) {
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
                dev = (currentTimestamp - createTime) % delay;
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
            const timer: ITimer = suncom.Pool.getItemByClass("suncore.Timer", Timer);
            timer.mod = mod;
            timer.active = true;
            timer.delay = delay;
            timer.method = method;
            timer.caller = caller;
            timer.args = args;
            timer.jumpFrame = jumpFrame;
            timer.count = count;
            timer.loops = loops;
            timer.timerId = timerId;
            timer.createTime = createTime;
            timer.timeout = timeout;

            // 获取对应模块的定时器列表
            const timers: ITimer[] = this.$timers[mod];

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

            let index: number = -1;
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

        removeTimer(timerId: number): number {
            if (timerId > 0 && this.$timerMap[timerId] !== void 0) {
                this.$timerMap[timerId].active = false;
            }
            return 0;
        }

        clearTimer(mod: ModuleEnum): void {
            const timers: ITimer[] = this.$timers[mod];
            while (timers.length > 0) {
                const timer: ITimer = timers.pop();
                delete this.$timerMap[timer.timerId];
                timer.recover();
            }
        }
    }
}