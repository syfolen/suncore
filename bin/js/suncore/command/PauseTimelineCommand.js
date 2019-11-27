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
     * 暂停时间轴
     * export
     */
    var PauseTimelineCommand = /** @class */ (function (_super) {
        __extends(PauseTimelineCommand, _super);
        function PauseTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @mod: 时间轴模块
         * @stop: 是否停止时间轴，默认为true
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         * export
         */
        PauseTimelineCommand.prototype.execute = function (mod, stop) {
            if (stop === void 0) { stop = true; }
            if (stop === true) {
                if (suncore.System.isModuleStopped(mod) === true) {
                    console.error("Module " + suncore.ModuleEnum[mod] + " Is Already Stopped!!!");
                    return;
                }
            }
            else if (suncore.System.isModulePaused(mod) === true) {
                console.error("Module " + suncore.ModuleEnum[mod] + " Is Already Paused!!!");
                return;
            }
            else if (mod === suncore.ModuleEnum.SYSTEM) {
                console.error("Module " + suncore.ModuleEnum[mod] + " Cannot Be Paused!!!");
                return;
            }
            if (mod === suncore.ModuleEnum.TIMELINE) {
                suncore.M.timeline.pause(stop);
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                suncore.M.timeStamp.pause(stop);
            }
            if (stop === false) {
                return;
            }
            suncore.M.timerManager.clearTimer(mod);
            suncore.M.messageManager.clearMessages(mod);
            if (mod === suncore.ModuleEnum.TIMELINE) {
                suncore.M.timeline = null;
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                suncore.M.timeStamp = null;
            }
            else {
                suncore.M.engine.destroy();
                suncore.M.engine = null;
            }
        };
        return PauseTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.PauseTimelineCommand = PauseTimelineCommand;
})(suncore || (suncore = {}));
//# sourceMappingURL=PauseTimelineCommand.js.map