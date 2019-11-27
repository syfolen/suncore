var suncore;
(function (suncore) {
    /**
     * 数据中心
     */
    var M;
    (function (M) {
        /**
         * 核心类
         */
        M.engine = null;
        /**
         * 游戏时间轴
         */
        M.timeline = null;
        /**
         * 场景时间轴
         */
        M.timeStamp = null;
        /**
         * 定时器管理器
         */
        M.timerManager = new suncore.TimerManager();
        /**
         * 消息管理器
         */
        M.messageManager = new suncore.MessageManager();
    })(M = suncore.M || (suncore.M = {}));
})(suncore || (suncore = {}));
//# sourceMappingURL=M.js.map