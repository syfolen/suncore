
module suncore {
    /**
     * Message消息体接口
     */
    export interface IMessage {
        /**
         * 所属模块
         */
        mod: ModuleEnum;

        /**
         * 优先权
         */
        priority: MessagePriorityEnum;

        /**
         * 挂载的任务
         */
        task?: ITask;

        /**
         * 回调执行器
         * 说明：
         * 1. 对于部分优先级的消息来说，返回值是有效的，详见 MessagePriorityEnum 的 PRIORITY_LAZY 说明
         */
        handler?: suncom.IHandler;

        /**
         * 回调方法
         */
        method?: Function;

        /**
         * 回调对象
         */
        caller?: Object;

        /**
         * 超时时间
         */
        timeout?: number;
    }
}