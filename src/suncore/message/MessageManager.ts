
module suncore {

    export class MessageManager implements IMessageManager {

        private $queues: IMessageQueue[] = [];

        constructor() {
            for (let mod: ModuleEnum = 0; mod < ModuleEnum.MAX; mod++) {
                this.$queues[mod] = new MessageQueue(mod);
            }
        }

        putMessage(message: IMessage): void {
            this.$queues[message.mod].putMessage(message);
        }

        dealMessage(): void {
            for (let mod: ModuleEnum = 0; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) === false) {
                    this.$queues[mod].dealMessage();
                }
            }
        }

        classifyMessages0(): void {
            for (let mod: ModuleEnum = 0; mod < ModuleEnum.MAX; mod++) {
                if (System.isModuleStopped(mod) === false) {
                    this.$queues[mod].classifyMessages0();
                }
            }
        }

        clearMessages(mod: ModuleEnum): void {
            this.$queues[mod].clearMessages();
        }

        cancelTaskByGroupId(mod: ModuleEnum, groupId: number): void {
            this.$queues[mod].cancelTaskByGroupId(mod, groupId);
        }
    }
}