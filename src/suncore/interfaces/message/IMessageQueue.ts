
module suncore {
    /**
     * 消息队列
     */
    export interface IMessageQueue {

        /**
         * 添加消息
         */
        putMessage(message: IMessage): void;

        /**
         * 处理消息
         */
        dealMessage(): void;

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void;

        /**
         * 清除指定模块下的所有消息
         * 说明：
         * 1. 考虑到执行干扰问题，所以正式消息队列中的消息不会立即移除
         */
        clearMessages(): void;

        /**
         * 取消任务
         */
        cancelTaskByGroupId(mod: ModuleEnum, groupId: number): void;
    }
}