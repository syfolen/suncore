
module suncore {

    /**
     * 消息管理器
     */
    export class MessageManager implements IMessageManager {

        /**
         * 消息队列列表
         */
        private $queues: Array<IMessageQueue> = [];

        constructor() {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$queues[mod] = new MessageQueue(mod);
            }
        }

        /**
         * 添加消息
         */
        putMessage(message: Message): void {
            this.$queues[message.mod].putMessage(message);
        }

        /**
         * 处理消息
         */
        dealMessage(): void {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) === false) {
                    this.$queues[mod].dealMessage();
                }
            }
        }

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModuleStopped(mod) === false) {
                    this.$queues[mod].classifyMessages0();
                }
            }
        }

        /**
         * 清除所有消息
         */
        clearMessages(mod: ModuleEnum): void {
            this.$queues[mod].clearMessages();
        }
    }
}