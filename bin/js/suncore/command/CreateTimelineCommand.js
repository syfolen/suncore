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
     * 创建游戏时间轴
     * export
     */
    var CreateTimelineCommand = /** @class */ (function (_super) {
        __extends(CreateTimelineCommand, _super);
        function CreateTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * export
         */
        CreateTimelineCommand.prototype.execute = function () {
            suncore.System.engine = new suncore.Engine();
            suncore.System.timeline = new suncore.Timeline(false);
            suncore.System.timeStamp = new suncore.TimeStamp();
        };
        return CreateTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.CreateTimelineCommand = CreateTimelineCommand;
})(suncore || (suncore = {}));
//# sourceMappingURL=CreateTimelineCommand.js.map