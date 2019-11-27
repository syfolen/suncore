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
     * 系统时间轴
     *
     * 此类实现了整个客户端的核心机制，包括：
     * 1. 系统时间戳实现
     * 2. 游戏时间轴调度
     * 3. 自定义定时器调度
     * 4. 不同类型游戏消息的派发
     */
    var Engine = /** @class */ (function (_super) {
        __extends(Engine, _super);
        function Engine() {
            var _this = _super.call(this) || this;
            /**
             * 帧时间间隔（毫秒）
             */
            _this.$delta = 0;
            /**
             * 运行时间
             */
            _this.$runTime = 0;
            /**
             * 本地时间
             */
            _this.$localTime = new Date().valueOf();
            // 注册帧事件
            Laya.timer.frameLoop(1, _this, _this.$onFrameLoop);
            return _this;
        }
        /**
         * 销毁对象
         */
        Engine.prototype.destroy = function () {
            Laya.timer.clear(this, this.$onFrameLoop);
        };
        /**
         * 帧事件
         */
        Engine.prototype.$onFrameLoop = function () {
            // 本地历史时间
            var oldTime = this.$localTime;
            // 本地当前时间
            this.$localTime = new Date().valueOf();
            // 帧间隔时间
            this.$delta = this.$localTime - oldTime;
            // 若帧间隔时间大于 0 ，则驱动系统运行
            if (this.$delta > 0) {
                // 运行时间累加
                this.$runTime += this.$delta;
                // 时间流逝逻辑
                this.$lapse(this.$delta);
            }
        };
        /**
         * 时间流逝逻辑
         */
        Engine.prototype.$lapse = function (delta) {
            // 游戏时间轴未暂停
            if (suncore.System.isModulePaused(suncore.ModuleEnum.TIMELINE) === false) {
                suncore.M.timeline.lapse(delta);
            }
            // 场景时间轴未暂停
            if (suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false) {
                suncore.M.timeStamp.lapse(delta);
            }
            // 物理相关事件
            this.facade.sendNotification(suncore.NotifyKey.PHYSICS_PREPARE);
            this.facade.sendNotification(suncore.NotifyKey.PHYSICS_FRAME);
            // 始终派发帧相关事件
            this.facade.sendNotification(suncore.NotifyKey.ENTER_FRAME);
            // 响应定时器
            suncore.M.timerManager.executeTimer();
            // 处理消息
            suncore.M.messageManager.dealMessage();
            // 处理临时消息
            suncore.M.messageManager.classifyMessages0();
            // 始终派发帧相关事件
            this.facade.sendNotification(suncore.NotifyKey.LATER_FRAME);
        };
        /**
         * 获取系统运行时间（毫秒）
         */
        Engine.prototype.getTime = function () {
            return this.$runTime;
        };
        /**
         * 获取帧时间间隔（毫秒）
         */
        Engine.prototype.getDelta = function () {
            return this.$delta;
        };
        return Engine;
    }(puremvc.Notifier));
    suncore.Engine = Engine;
})(suncore || (suncore = {}));
//# sourceMappingURL=Engine.js.map