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
     * 开始时间轴，若时间轴不存在，则会自动创建
     * export
     */
    var StartTimelineCommand = /** @class */ (function (_super) {
        __extends(StartTimelineCommand, _super);
        function StartTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @mod: 时间轴模块
         * @pause: 时间轴在开启时是否处于暂停状态，默认为false
         * 说明：
         * 1. 参数pause并不会对SYSTEM模块的时间轴生效
         * export
         */
        StartTimelineCommand.prototype.execute = function (mod, pause) {
            if (pause === void 0) { pause = false; }
            if (suncore.System.isModulePaused(mod) === false) {
                console.error("Module " + suncore.ModuleEnum[mod] + " Is Already Started!!!");
                return;
            }
            if (mod === suncore.ModuleEnum.TIMELINE) {
                if (suncore.M.timeline === null) {
                    suncore.M.timeline = new suncore.Timeline();
                }
                suncore.M.timeline.resume(pause);
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                if (suncore.M.timeStamp === null) {
                    suncore.M.timeStamp = new suncore.Timeline();
                }
                suncore.M.timeStamp.resume(pause);
            }
            else if (mod === suncore.ModuleEnum.SYSTEM) {
                if (suncore.M.engine === null) {
                    suncore.M.engine = new suncore.Engine();
                }
            }
        };
        return StartTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.StartTimelineCommand = StartTimelineCommand;
})(suncore || (suncore = {}));
//# sourceMappingURL=StartTimelineCommand.js.map