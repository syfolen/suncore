var suncore;
(function (suncore) {
    /**
     * 网络消息派发器
     * export
     */
    var MessageNotifier;
    (function (MessageNotifier) {
        /**
         * 消息派发器
         */
        var $inst = new suncom.EventSystem();
        /**
         * 通知网络消息
         * export
         */
        function notify(name, data) {
            $inst.dispatchEvent(name, data);
        }
        MessageNotifier.notify = notify;
        /**
         * 注册网络消息监听
         * export
         */
        function register(name, method, caller) {
            $inst.addEventListener(name, method, caller);
        }
        MessageNotifier.register = register;
        /**
         * 移除网络消息监听
         * export
         */
        function unregister(name, method, caller) {
            $inst.removeEventListener(name, method, caller);
        }
        MessageNotifier.unregister = unregister;
    })(MessageNotifier = suncore.MessageNotifier || (suncore.MessageNotifier = {}));
})(suncore || (suncore = {}));
//# sourceMappingURL=MessageNotifier.js.map