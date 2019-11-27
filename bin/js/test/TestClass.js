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
    var TestClass = /** @class */ (function (_super) {
        __extends(TestClass, _super);
        function TestClass() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestClass.prototype.run = function () {
            // 测试场景定时器
            this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.CUSTOM, 500, this.$onTimerHandler, this, 0);
            for (var i = 0; i < 20; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(this, function (index) {
                    console.log("PRIORITY_0 " + index);
                }, [i]));
            }
            for (var i = 0; i < 20; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_HIGH, suncom.Handler.create(this, function (index) {
                    console.log("PRIORITY_HIGH " + index);
                }, [i]));
            }
            for (var i = 0; i < 10; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_NOR, suncom.Handler.create(this, function (index) {
                    console.log("PRIORITY_NOR " + index);
                }, [i]));
            }
            for (var i = 0; i < 5; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LOW, suncom.Handler.create(this, function (index) {
                    console.log("PRIORITY_LOW " + index);
                }, [i]));
            }
            for (var i = 0; i < 3; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, function (index) {
                    console.log("PRIORITY_LAZY " + index);
                }, [i]));
            }
            for (var i = 0; i < 5; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, i * 300 + 300, suncom.Handler.create(this, function (index) {
                    console.log("PRIORITY_TRIGGER " + index);
                }, [i]));
            }
            for (var i = 0; i < 5; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, i * 300 + 300, suncom.Handler.create(this, function (index) {
                    console.log("PRIORITY_TRIGGER " + index);
                }, [i]));
            }
            for (var i = 0; i < 5; i++) {
                suncore.System.addTask(suncore.ModuleEnum.CUSTOM, new test.TestTask(i));
            }
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$gotoQuadtreeScene));
            return true;
        };
        TestClass.prototype.$onTimerHandler = function (repeat, loops) {
            console.log("\u6D4B\u8BD5\u573A\u666F\u5B9A\u65F6\u5668, repeat:" + repeat + ", loops:" + loops);
        };
        TestClass.prototype.$gotoQuadtreeScene = function (repeat, loops) {
            if (repeat === loops) {
                console.log("测试完毕");
                this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
                this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);
            }
        };
        return TestClass;
    }(suncore.AbstractTask));
    test.TestClass = TestClass;
})(test || (test = {}));
//# sourceMappingURL=TestClass.js.map