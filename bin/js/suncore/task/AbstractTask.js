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
     * 任务抽象类
     * export
     */
    var AbstractTask = /** @class */ (function (_super) {
        __extends(AbstractTask, _super);
        function AbstractTask() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 外部会访问此变量来判断任务是否己经完成
             * export
             */
            _this.$done = false;
            return _this;
        }
        /**
         * 取消任务
         * 说明：
         * 1. 当时间轴停止时，此方法会被调用，用以清理资源
         * export
         */
        AbstractTask.prototype.cancel = function () {
        };
        Object.defineProperty(AbstractTask.prototype, "done", {
            /**
             * 任务是否己经完成
             * export
             */
            get: function () {
                return this.$done;
            },
            /**
             * depends
             */
            set: function (yes) {
                this.$done = yes;
            },
            enumerable: true,
            configurable: true
        });
        return AbstractTask;
    }(puremvc.Notifier));
    suncore.AbstractTask = AbstractTask;
})(suncore || (suncore = {}));
//# sourceMappingURL=AbstractTask.js.map