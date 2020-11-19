
module suncore {
    /**
     * Message消息体接口
     */
    export class Message {
        /**
         * 编号
         */
        hashId: number = 0;

        /**
         * 所属模块
         */
        mod: ModuleEnum = ModuleEnum.SYSTEM;

        /**
         * 优先权
         */
        priority: MessagePriorityEnum = MessagePriorityEnum.PRIORITY_0;

        /**
         * 挂载的任务
         */
        task: AbstractTask = null;

        /**
         * 任务分组编号
         */
        groupId: number = -1;

        /**
         * 回调执行器
         * 说明：
         * 1. 对于部分优先级的消息来说，返回值是有效的，详见 MessagePriorityEnum 的 PRIORITY_LAZY 说明
         */
        handler: suncom.Handler = null;

        /**
         * 回调方法
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