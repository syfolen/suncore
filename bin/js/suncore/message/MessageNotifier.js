var suncore;
(function (suncore) {
    /**
     * 网络消息派发器
     * export
     */
    var MessageNotifier = /** @class */ (function () {
        function MessageNotifier() {
        }
        /**
         * 通知网络消息
         * export
         */
        MessageNotifier.notify = function (name, data) {
            MessageNotifier.inst.dispatchEvent(name, data);
        };
        /**
         * 注册网络消息监听
         * export
         */
        MessageNotifier.register = function (name, method, caller) {
            MessageNotifier.inst.addEventListener(name, method, caller);
        };
        /**
         * 移除网络消息监听
         * export
         */
        MessageNotifier.unregister = function (name, method, caller) {
            MessageNotifier.inst.removeEventListener(name, method, caller);
        };
        MessageNotifier.inst = new suncom.EventSystem();
        return MessageNotifier;
    }());
    suncore.MessageNotifier = MessageNotifier;
})(suncore || (suncore = {}));
//# sourceMappingURL=MessageNotifier.js.map