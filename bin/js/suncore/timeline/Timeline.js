var suncore;
(function (suncore) {
    /**
     * 时间轴类
     *
     * 说明：
     * 1. 游戏时间轴中并没有关于计算游戏时间的真正的实现
     *
     * 注意：
     * 1. 由于此类为系统类，故请勿擅自对此类进行实例化
     * 2. 时间轴模块下的消息和定时器只有在时间轴被激活的情况下才会被处理。
     */
    var Timeline = /** @class */ (function () {
        function Timeline() {
            /**
             * 运行时间（毫秒）
             */
            this.$runTime = 0;
            /**
             * 是否己暂停
             */
            this.$paused = true;
            /**
             * 是否己停止
             */
            this.$stopped = true;
        }
        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        Timeline.prototype.lapse = function (delta) {
            // 运行时间累加（毫秒）
            this.$runTime += delta;
        };
        /**
         * 暂停时间轴
         * @stop: 是否停止时间轴，默认为false
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        Timeline.prototype.pause = function (stop) {
            if (stop === void 0) { stop = false; }
            this.$paused = true;
            this.$stopped = stop;
        };
        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认false
         */
        Timeline.prototype.resume = function (paused) {
            if (paused === void 0) { paused = false; }
            this.$paused = paused;
            this.$stopped = false;
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
        return Timeline;
    }());
    suncore.Timeline = Timeline;
})(suncore || (suncore = {}));
//# sourceMappingURL=Timeline.js.map