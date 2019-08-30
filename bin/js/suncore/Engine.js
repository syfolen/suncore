var suncore;
(function (suncore) {
    /**
     * 核心类
     */
    var Engine = /** @class */ (function () {
        function Engine() {
            /**
             * 运行时间
             */
            this.$runTime = 0;
            /**
             * 本地时间
             */
            this.$localTime = new Date().valueOf();
            // 注册帧事件
            Laya.timer.frameLoop(1, this, this.$onFrameLoop);
        }
        /**
         * 销毁对象
         */
        Engine.prototype.destroy = function () {
            Laya.timer.clear(this, this.$onFrameLoop);
        };
        /**
         * 帧事件
         */
        Engine.prototype.$onFrameLoop = function () {
            // 本地历史时间
            var oldTime = this.$localTime;
            // 本地当前时间
            this.$localTime = new Date().valueOf();
            // 帧间隔时间
            var delta = this.$localTime - oldTime;
            // 若帧间隔时间大于 0 ，则驱动系统运行
            if (delta > 0) {
                // 运行时间累加
                this.$runTime += delta;
                // 时间流逝逻辑
                suncore.System.timeStamp.lapse(delta);
            }
        };
        /**
         * 获取系统运行时间（毫秒）
         */
        Engine.prototype.getTime = function () {
            return this.$runTime;
        };
        return Engine;
    }());
    suncore.Engine = Engine;
})(suncore || (suncore = {}));
//# sourceMappingURL=Engine.js.map