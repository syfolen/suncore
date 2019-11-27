
module suncore {
    /**
     * 消息队列接口
     */
    export interface IMessageQueue {

        /**
         * 添加消息
         */
        putMessage(message: Message): void;

        /**
         * 处理消息
         */
        dealMessage(): number;

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void;

        /**
         * 清除指定模块下的所有消息
         */
        clearMessages(): void;
    }
}