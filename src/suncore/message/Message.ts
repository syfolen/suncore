
module suncore {
    /**
     * Message消息体接口
     */
    export class Message {
        /**
         * 所属模块
         */
        mod: ModuleEnum = ModuleEnum.SYSTEM;

        /**
         * 优先级
         */
        priority: MessagePriorityEnum = MessagePriorityEnum.PRIORITY_0;

        /**
         *承诺权重，权重高的优先处理
         */
        weights: number = 0;

        /**
         * 挂载的任务
         */
        task: AbstractTask = null;

        /**
         * 任务分组编号
         */
        groupId: number = -1;

        /**
         * 回调参数列表
         */
        args: any[] = null;

        /**
         * 回调方法
         * 说明：
         * 1. 对于部分优先级的消息来说，返回值是有效的，详见 MessagePriorityEnum 的 PRIORITY_LAZY 说明
         */
        method: Function = null;

        /**
         * 回调对象
         */
        caller: Object = null;

        /**
         * 超时时间
         */
        timeout: number = 0;
    }
}