
module suncore {
    /**
     * 消息管理器
     */
    export interface IMessageManager {

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
         * 清除所有消息
         */
        clearMessages(mod: ModuleEnum): void;

        /**
         * 取消任务
         */
        cancelTaskByGroupId(mod: ModuleEnum, groupId: number): void;
    }
}