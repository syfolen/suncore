var suncore;
(function (suncore) {
    /**
     * 命令枚举
     * export
     */
    var NotifyKey = /** @class */ (function () {
        function NotifyKey() {
        }
        /**
         * export
         */
        NotifyKey.STARTUP = "suncore.NotifyKey.STARTUP";
        /**
         * export
         */
        NotifyKey.SHUTDOWN = "suncore.NotifyKey.SHUTDOWN";
        /**
         * export
         */
        NotifyKey.PHYSICS_FRAME = "suncore.NotifyKey.PHYSICS_FRAME";
        /**
         * export
         */
        NotifyKey.PHYSICS_PREPARE = "suncore.NotifyKey.PHYSICS_PREPARE";
        /**
         * export
         */
        NotifyKey.ENTER_FRAME = "suncore.NotifyKey.ENTER_FRAME";
        /**
         * export
         */
        NotifyKey.LATER_FRAME = "suncore.NotifyKey.LATER_FRAME";
        /**
         * export
         */
        NotifyKey.CREATE_TIMELINE = "suncore.NotifyKey.CREATE_TIMELINE";
        /**
         * export
         */
        NotifyKey.REMOVE_TIMELINE = "suncore.NotifyKey.REMOVE_TIMELINE";
        /**
         * export
         */
        NotifyKey.TIMELINE_STOPPED = "suncore.NotifyKey.TIMELINE_STOPPED";
        /**
         * export
         */
        NotifyKey.TIMESTAMP_STOPPED = "suncore.NotifyKey.TIMESTAMP_STOPPED";
        return NotifyKey;
    }());
    suncore.NotifyKey = NotifyKey;
})(suncore || (suncore = {}));
//# sourceMappingURL=NotifyKey.js.map