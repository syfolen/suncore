
module suncore {

    export class MessageManager implements IMessageManager {

        private $queues: IMessageQueue[] = [];

        constructor() {
            let mod: ModuleEnum;
            for (mod = 0; mod < ModuleEnum.MAX; mod++) {
                this.$queues[mod] = new MessageQueue(mod);
            }
        }

        putMessage(message: IMessage): void {
            this.$queues[message.mod].putMessage(message);
        }

        dealMessage(): void {
            let mod: ModuleEnum;
            for (mod = 0; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) === false) {
                    this.$queues[mod].dealMessage();
                }
            }
        }

        classifyMessages0(): void {
            let mod: ModuleEnum;
            for (mod = 0; mod < ModuleEnum.MAX; mod++) {
                if (System.isModuleStopped(mod) === false) {
                    this.$queues[mod].classifyMessages0();
                }
            }
        }

        clearMessages(mod: ModuleEnum): void {
            this.$queues[mod].clearMessages();
        }

        cancelTaskByGroupId(mod: ModuleEnum, groupId: number): void {
            this.$queues[mod].cancelTaskByGroupId(groupId);
        }

        /**
         * 注册自定义消息
         */
        addCustomMessageId(mod: ModuleEnum, messageId: number): void {
            this.$queues[mod].addCustomMessageId(messageId);
        }

        /**
         * 移除自定义消息
         */
        removeCustomMessageId(mod: ModuleEnum, messageId: number): void {
            this.$queues[mod].removeCustomMessageId(messageId);
        }

        /**
         * 移除所有自定义消息
         */
        removeAllCustomMessageId(mod: ModuleEnum): void {
            this.$queues[mod].removeAllCustomMessageId();
        }
    }
}