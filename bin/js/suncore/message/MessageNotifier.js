var suncore;
(function (suncore) {
    /**
     * 网络消息派发器
     */
    var MessageNotifier = /** @class */ (function () {
        function MessageNotifier() {
        }
        /**
         * 通知网络消息
         */
        MessageNotifier.notify = function (cmd, data) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("MessageNotifier=> notify cmd:" + cmd.toString(16) + ", data:" + JSON.stringify(data));
            }
            MessageNotifier.inst.dispatchEvent(cmd.toString(), data);
        };
        /**
         * 注册网络消息监听
         */
        MessageNotifier.register = function (cmd, method, caller) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("MessageNotifier=>register cmd:" + cmd.toString(16));
            }
            MessageNotifier.inst.addEventListener(cmd.toString(), method, caller);
        };
        /**
         * 移除网络消息监听
         */
        MessageNotifier.unregister = function (cmd, method, caller) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("MessageNotifier=>unregister cmd:" + cmd.toString(16));
            }
            MessageNotifier.inst.removeEventListener(cmd.toString(), method, caller);
        };
        MessageNotifier.inst = new suncom.EventSystem();
        return MessageNotifier;
    }());
    suncore.MessageNotifier = MessageNotifier;
})(suncore || (suncore = {}));
//# sourceMappingURL=MessageNotifier.js.map