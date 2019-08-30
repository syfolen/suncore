var suncore;
(function (suncore) {
    /**
     * 消息管理器
     */
    var MessageManager = /** @class */ (function () {
        function MessageManager() {
            /**
             * 消息队列列表
             */
            this.$queues = [];
            for (var mod = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                this.$queues[mod] = new suncore.MessageQueue(mod);
            }
        }
        /**
         * 添加消息
         */
        MessageManager.prototype.putMessage = function (message) {
            this.$queues[message.mod].putMessage(message);
        };
        /**
         * 处理消息
         */
        MessageManager.prototype.dealMessage = function () {
            for (var mod = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                if (suncore.System.isModulePaused(mod) == false) {
                    this.$queues[mod].dealMessage();
                }
            }
        };
        /**
         * 将临时消息按优先级分类
         */
        MessageManager.prototype.classifyMessages0 = function () {
            for (var mod = suncore.ModuleEnum.MIN; mod < suncore.ModuleEnum.MAX; mod++) {
                if (suncore.System.isModulePaused(mod) == false) {
                    this.$queues[mod].classifyMessages0();
                }
            }
        };
        /**
         * 清除所有消息
         */
        MessageManager.prototype.clearMessages = function (mod) {
            this.$queues[mod].clearMessages();
        };
        return MessageManager;
    }());
    suncore.MessageManager = MessageManager;
})(suncore || (suncore = {}));
//# sourceMappingURL=MessageManager.js.map