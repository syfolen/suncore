
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
         * 优先级
         */
        priority: MessagePriorityEnum;

        /**
         *承诺权重，权重高的优先处理
         */
        weights: number;

        /**
         * 挂载的任务
         */
        task: ITask;

        /**
         * 任务分组编号
         */
        groupId: number;

        /**
         * 回调参数列表
         */
        args: any[];

        /**
         * 回调方法
         * 说明：
         * 1. 对于部分优先级的消息来说，返回值是有效的，详见 MessagePriorityEnum 的 PRIORITY_LAZY 说明
         */
        method: Function;

        /**
         * 回调对象
         */
        caller: Object;

        /**
         * 超时时间
         */
        timeout: number;

        recover(): void;
    }
}