var suncore;
(function (suncore) {
    /**
     * 时间轴类
     *
     * 说明：
     * 1. 游戏时间轴实现
     * 1. 游戏时间轴中并没有关于计算游戏时间的真正的实现
     * 2. 若游戏是基于帧同步的，则游戏时间以服务端时间为准
     * 3. 若游戏是基于状态同步的，则游戏时间以框架时间为准
     *
     * 注意：
     * 1. 由于此类为系统类，故请勿擅自对此类进行实例化
     */
    var Timeline = /** @class */ (function () {
        /**
         * @lockStep: 是否开启帧同步
         * 说明：
         * 1. 时间轴模块下的消息和定时器只有在时间轴被激活的情况下才会被处理。
         */
        function Timeline(lockStep) {
            /**
             * 是否己暂停
             */
            this.$paused = true;
            /**
             * 是否己停止
             */
            this.$stopped = true;
            /**
             * 运行时间
             */
            this.$runTime = 0;
            // 是否开启帧同步
            this.$lockStep = lockStep;
        }
        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        Timeline.prototype.lapse = function (delta) {
            // 运行时间累加
            this.$runTime += delta;
        };
        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        Timeline.prototype.pause = function () {
            this.$paused = true;
        };
        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴
         */
        Timeline.prototype.resume = function (paused) {
            if (paused === void 0) { paused = false; }
            this.$paused = paused;
            this.$stopped = false;
        };
        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        Timeline.prototype.stop = function () {
            this.$stopped = true;
            // 清除定时器
            suncore.System.timeStamp.timerManager.clearTimer(suncore.ModuleEnum.TIMELINE);
            // 清除任务消息
            suncore.System.timeStamp.messageManager.clearMessages(suncore.ModuleEnum.TIMELINE);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.TIMELINE_STOPPED);
        };
        /**
         * 获取系统时间戳（毫秒）
         */
        Timeline.prototype.getTime = function () {
            return this.$runTime;
        };
        Object.defineProperty(Timeline.prototype, "paused", {
            /**
             * 时间轴是否己暂停
             */
            get: function () {
                return this.$paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timeline.prototype, "stopped", {
            /**
             * 时间轴是否己停止
             */
            get: function () {
                return this.$stopped;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timeline.prototype, "lockStep", {
            /**
             * 帧同步是否己开启
             */
            get: function () {
                return this.$lockStep;
            },
            enumerable: true,
            configurable: true
        });
        return Timeline;
    }());
    suncore.Timeline = Timeline;
})(suncore || (suncore = {}));
//# sourceMappingURL=Timeline.js.map