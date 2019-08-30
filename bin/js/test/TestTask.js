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
    var TestTask = /** @class */ (function (_super) {
        __extends(TestTask, _super);
        function TestTask(index) {
            var _this = _super.call(this) || this;
            _this.$index = index;
            return _this;
        }
        TestTask.prototype.run = function () {
            if (this.$index < 0) {
                console.log("在场景创建之前的Task...");
                // 2 秒后会继续
                suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, 2000, this.$delayDone, this);
            }
            else {
                console.log("Task未完成...");
                // 2 秒后会继续
                suncore.System.addTimer(suncore.ModuleEnum.CUSTOM, 2000, this.$delayDone, this);
            }
            return false;
        };
        TestTask.prototype.$delayDone = function () {
            console.log("Task己完成");
            this.done = true;
        };
        return TestTask;
    }(suncore.AbstractTask));
    test.TestTask = TestTask;
})(test || (test = {}));
//# sourceMappingURL=TestTask.js.map