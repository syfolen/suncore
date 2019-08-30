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
    var LoginTask = /** @class */ (function (_super) {
        __extends(LoginTask, _super);
        function LoginTask() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LoginTask.prototype.run = function () {
            // 这里发送登陆
            console.log("请求登陆，这时候，task会一直阻塞所有流程");
            suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, 3000, this.$onLoginSucceed, this);
            return false;
        };
        LoginTask.prototype.$onLoginSucceed = function () {
            console.log("登陆成功");
            this.done = true;
        };
        return LoginTask;
    }(suncore.AbstractTask));
    test.LoginTask = LoginTask;
})(test || (test = {}));
