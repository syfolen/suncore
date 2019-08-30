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
var test;
(function (test) {
    var StartupCommand = /** @class */ (function (_super) {
        __extends(StartupCommand, _super);
        function StartupCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StartupCommand.prototype.execute = function () {
            puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.CREATE_TIMELINE, suncore.CreateTimelineCommand);
            puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.REMOVE_TIMELINE, suncore.RemoveTimelineCommand);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.CREATE_TIMELINE);
            suncore.System.timeline.resume();
            suncore.System.timeStamp.resume();
            var handler = suncom.Handler.create(this, this.$onStartup);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, handler);
        };
        StartupCommand.prototype.$onStartup = function () {
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new test.TestClass());
        };
        return StartupCommand;
    }(puremvc.SimpleCommand));
    test.StartupCommand = StartupCommand;
})(test || (test = {}));
//# sourceMappingURL=StartupCommand.js.map