var suncore;
(function (suncore) {
    /**
     * 命令枚举
     */
    var NotifyKey = /** @class */ (function () {
        function NotifyKey() {
        }
        // 系统命令
        NotifyKey.STARTUP = "suncore.NotifyKey.STARTUP";
        NotifyKey.SHUTDOWN = "suncore.NotifyKey.SHUTDOWN";
        NotifyKey.ENTER_FRAME = "suncore.NotifyKey.ENTER_FRAME";
        // 时间轴命令
        NotifyKey.CREATE_TIMELINE = "suncore.NotifyKey.CREATE_TIMELINE";
        NotifyKey.REMOVE_TIMELINE = "suncore.NotifyKey.REMOVE_TIMELINE";
        NotifyKey.TIMELINE_STOPPED = "suncore.NotifyKey.TIMELINE_STOPPED";
        NotifyKey.TIMESTAMP_STOPPED = "suncore.NotifyKey.TIMESTAMP_STOPPED";
        return NotifyKey;
    }());
    suncore.NotifyKey = NotifyKey;
})(suncore || (suncore = {}));
//# sourceMappingURL=NotifyKey.js.map