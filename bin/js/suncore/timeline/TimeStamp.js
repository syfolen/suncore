var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var suncore;
(function (suncore) {
    /**
     * 系统时间戳
     *
     * 此类实现了整个客户端的核心机制，包括：
     * 1. 系统时间戳实现
     * 2. 游戏时间轴调度
     * 3. 自定义定时器调度
     * 4. 不同类型游戏消息的派发
     */
    var TimeStamp = /** @class */ (function (_super) {
        __extends(TimeStamp, _super);
        function TimeStamp() {
            var _this = _super.call(this, false) || this;
            /**
             * 定时器管理器
             */
            _this.$timerManager = new suncore.TimerManager();
            /**
             * 消息管理器
             */
            _this.$messageManager = new suncore.MessageManager();
            return _this;
        }
        /**
         * 帧事件
         */
        TimeStamp.prototype.lapse = function (delta) {
            // 游戏未暂停
            if (this.paused === false) {
                _super.prototype.lapse.call(this, delta);
                // 时间轴未暂停
                if (suncore.System.timeline.paused === false) {
                    // 若游戏时间轴未开启帧同步，则直接对游戏时间进行同步
                    if (suncore.System.timeline.lockStep === false) {
                        suncore.System.timeline.lapse(delta);
                    }
                }
            }
            // 物理相关事件
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PHYSICS_PREPARE);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PHYSICS_FRAME);
            // 始终派发帧相关事件
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.ENTER_FRAME);
            // 响应定时器
            this.$timerManager.executeTimer();
            // 处理消息
            this.$messageManager.dealMessage();
            // 处理临时消息
            this.$messageManager.classifyMessages0();
            // 始终派发帧相关事件
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.LATER_FRAME);
        };
        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        TimeStamp.prototype.stop = function () {
            this.$paused = this.$stopped = true;
            // 清除定时器
            suncore.System.timeStamp.timerManager.clearTimer(suncore.ModuleEnum.CUSTOM);
            // 清除任务消息
            suncore.System.timeStamp.messageManager.clearMessages(suncore.ModuleEnum.CUSTOM);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.TIMESTAMP_STOPPED);
        };
        Object.defineProperty(TimeStamp.prototype, "timerManager", {
            /**
             * 获取自定义定时器管理器
             */
            get: function () {
                return this.$timerManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeStamp.prototype, "messageManager", {
            /**
             * 获取消息管理器
             */
            get: function () {
                return this.$messageManager;
            },
            enumerable: true,
            configurable: true
        });
        return TimeStamp;
    }(suncore.Timeline));
    suncore.TimeStamp = TimeStamp;
})(suncore || (suncore = {}));
//# sourceMappingURL=TimeStamp.js.map