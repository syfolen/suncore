
module suncore {
    /**
     * 模块枚举
     * 
     * 说明：
     * 由于游戏中的消息和定时器都是以队列的方式实现响应，所以在场景切换的过程中，就会涉及到未响应的元素的清理问题
     * 故设计了模块系统，队列将以模块来划分，当一个模块退出时，对应的列表将会被清理。
     * 
     * 注意：
     * 尽量不要添加新的模块，因为模块越多，消息响应的调度算法就会越复杂
     * export
     */
    export enum ModuleEnum {
        /**
         * 系统模块
         * 此模块为常驻模块，该模块下的消息永远不会被清理
         * export
         */
        SYSTEM = 0,

        /**
         * 通用模块
         * 此模块下的消息会在当前场景退出的同时被清理
         * export
         */
        CUSTOM,

        /**
         * 时间轴模块
         * 此模块下的消息会在时间轴被销毁的同时被清理
         * export
         */
        TIMELINE,

        /**
         * 枚举结束
         * export
         */
        MAX
    }
}