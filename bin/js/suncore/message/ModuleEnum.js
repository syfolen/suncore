var suncore;
(function (suncore) {
    /**
     * 模块枚举
     *
     * 说明：
     * 由于游戏中的消息和定时器都是以队列的方式实现响应，所以在场景切换的过程中，就会涉及到未响应的元素的清理问题
     * 故设计了模块系统，队列将以模块来划分，当一个模块退出时，对应的列表将会被清理。
     *
     * 注意：
     * 尽量不要添加新的模块，因为模块越多，消息响应的调度算法就会越复杂
     */
    var ModuleEnum;
    (function (ModuleEnum) {
        /**
         * 枚举开始
         */
        ModuleEnum[ModuleEnum["MIN"] = 0] = "MIN";
        /**
         * 系统模块
         * 此模块为常驻模块，该模块下的消息永远不会被清理
         */
        ModuleEnum[ModuleEnum["SYSTEM"] = 0] = "SYSTEM";
        /**
         * 通用模块
         * 此模块下的消息会在当前场景退出的同时被清理
         */
        ModuleEnum[ModuleEnum["CUSTOM"] = 1] = "CUSTOM";
        /**
         * 时间轴模块
         * 此模块下的消息会在时间轴被销毁的同时被清理
         */
        ModuleEnum[ModuleEnum["TIMELINE"] = 2] = "TIMELINE";
        /**
         * 枚举结束
         */
        ModuleEnum[ModuleEnum["MAX"] = 3] = "MAX";
    })(ModuleEnum = suncore.ModuleEnum || (suncore.ModuleEnum = {}));
})(suncore || (suncore = {}));
//# sourceMappingURL=ModuleEnum.js.map