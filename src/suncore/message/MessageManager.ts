
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
         * 注册动作
         */
        registerAction(mod: ModuleEnum, actionId: number): void {
            this.$queues[mod].registerAction(actionId);
        }

        /**
         * 移除动作
         */
        removeAction(mod: ModuleEnum, actionId: number): void {
            this.$queues[mod].removeAction(actionId);
        }

        /**
         * 移除所有动作
         */
        removeAllActions(mod: ModuleEnum): void {
            this.$queues[mod].removeAllActions();
        }
    }
}