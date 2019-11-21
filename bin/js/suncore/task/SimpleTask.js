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
     * 简单任务对象
     * export
     */
    var SimpleTask = /** @class */ (function (_super) {
        __extends(SimpleTask, _super);
        /**
         * export
         */
        function SimpleTask(handler) {
            var _this = _super.call(this) || this;
            _this.$handler = handler;
            return _this;
        }
        /**
         * 执行函数
         * export
         */
        SimpleTask.prototype.run = function () {
            // 执行任务
            this.$handler.run();
            return true;
        };
        return SimpleTask;
    }(suncore.AbstractTask));
    suncore.SimpleTask = SimpleTask;
})(suncore || (suncore = {}));
//# sourceMappingURL=SimpleTask.js.map