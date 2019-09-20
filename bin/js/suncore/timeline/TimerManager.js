var suncore;
(function (suncore) {
    /**
     * 定时器管理器
     */
    var TimerManager = /** @class */ (function () {
        function TimerManager() {
            /**
             * 定时器种子
             */
            this.$seedId = 0;
            /**
             * 定时器列表
             */
            this.$timers = [];
            /**
             * 定时器集合
             */
            this.$timerMap = {};
            for (var mod = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                this.$timers[mod] = [];
            }
        }
        /**
         * 生成新的定时器索引
         */
        TimerManager.prototype.$createNewTimerId = function () {
            this.$seedId++;
            return this.$seedId;
        };
        /**
         * 响应定时器
         */
        TimerManager.prototype.executeTimer = function () {
            // 遍历所有模块中的所有定时器
            for (var mod = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                // 获取模块中的所有定时器
                var timers = this.$timers[mod];
                // 获取当前时间戳
                var timestamp = suncore.System.getModuleTimestamp(mod);
                // 当前模块未暂停
                if (suncore.System.isModulePaused(mod) === false) {
                    // 对模块中的所有定时器进行遍历
                    while (timers.length) {
                        var timer = timers[0];
                        // 若定时器有效
                        if (timer.active === true) {
                            // 若定时器未到响应时间，则跳出
                            if (timer.timeout > timestamp) {
                                break;
                            }
                            // 若 real 为 true ，则对执行次数进行真实递增
                            if (timer.real === true) {
                                timer.repeat++;
                            }
                            // 否则计算当前理论上的响应次数
                            else {
                                timer.repeat = Math.floor((timestamp - timer.timestamp) / timer.delay);
                            }
                        }
                        // 移除无效定时器
                        if (timer.active === false || (timer.loops > 0 && timer.repeat >= timer.loops)) {
                            delete this.$timerMap[timer.timerId];
                        }
                        else {
                            this.addTimer(timer.mod, timer.delay, timer.method, timer.caller, timer.loops, timer.real, timer.timerId, timer.timestamp, timer.timeout, timer.repeat);
                        }
                        timers.shift();
                        if (timer.active === true) {
                            timer.method.call(timer.caller, timer.repeat, timer.loops);
                        }
                    }
                }
            }
        };
        /**
         * 添加游戏定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 循环设定次数
         * @real: 是否计算真实次数
         * @timerId: 定时器编号，请勿擅自传入此参数，防止定时器工作出错
         * @timestamp: 定时器的创建时间，请勿擅自传入此参数，防止定时器工作出错
         * @timeout: 定时器上次响应时间，请勿擅自传入此参数，防止定时器工作出错
         * @repeat: 当前重复次数
         */
        TimerManager.prototype.addTimer = function (mod, delay, method, caller, loops, real, timerId, timestamp, timeout, repeat) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (timerId === void 0) { timerId = 0; }
            if (timestamp === void 0) { timestamp = -1; }
            if (timeout === void 0) { timeout = -1; }
            if (repeat === void 0) { repeat = 0; }
            var timer = new suncore.Timer();
            var currentTimestamp = suncore.System.getModuleTimestamp(mod);
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
            // 定时器执行间隔不得小于 1 毫秒
            if (delay < 1) {
                throw Error("非法的定时器执行间隔");
            }
            // 响应时间偏差值
            var dev = 0;
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
            // 对定时器进行实例化
            timer.mod = mod;
            timer.active = true;
            timer.delay = delay;
            timer.method = method;
            timer.caller = caller;
            timer.real = real;
            timer.loops = loops;
            timer.repeat = repeat;
            timer.timerId = timerId;
            timer.timestamp = timestamp;
            timer.timeout = timeout;
            // 获取对应模块的定时器列表
            var timers = this.$timers[mod];
            var index = -1;
            var min = 0;
            var mid = 0;
            var max = timers.length - 1;
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
            for (var i = min; i <= max; i++) {
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
        };
        /**
         * 移除定时器
         * NOTE: 固定返回 0 ，方便外部用返回值清空 timerId
         */
        TimerManager.prototype.removeTimer = function (timerId) {
            if (timerId > 0 && this.$timerMap[timerId] !== void 0) {
                this.$timerMap[timerId].active = false;
            }
            return 0;
        };
        /**
         * 清除指定模块下的所有定时器
         */
        TimerManager.prototype.clearTimer = function (mod) {
            var timers = this.$timers[mod];
            while (timers.length > 0) {
                var timer = timers.pop();
                delete this.$timerMap[timer.timerId];
            }
        };
        return TimerManager;
    }());
    suncore.TimerManager = TimerManager;
})(suncore || (suncore = {}));
//# sourceMappingURL=TimerManager.js.map