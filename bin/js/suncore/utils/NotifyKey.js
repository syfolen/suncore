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
         * depends
         */
        NotifyKey.SHUTDOWN = "suncore.NotifyKey.SHUTDOWN";
        /**
         * export
         */
        NotifyKey.START_TIMELINE = "suncore.NotifyKey.START_TIMELINE";
        /**
         * depends
         */
        NotifyKey.PAUSE_TIMELINE = "suncore.NotifyKey.PAUSE_TIMELINE";
        /**
         * export
         */
        NotifyKey.PHYSICS_FRAME = "suncore.NotifyKey.PHYSICS_FRAME";
        /**
         * depends
         */
        NotifyKey.PHYSICS_PREPARE = "suncore.NotifyKey.PHYSICS_PREPARE";
        /**
         * export
         */
        NotifyKey.ENTER_FRAME = "suncore.NotifyKey.ENTER_FRAME";
        /**
         * depends
         */
        NotifyKey.LATER_FRAME = "suncore.NotifyKey.LATER_FRAME";
        return NotifyKey;
    }());
    suncore.NotifyKey = NotifyKey;
})(suncore || (suncore = {}));
//# sourceMappingURL=NotifyKey.js.map