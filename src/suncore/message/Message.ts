
module suncore {

    export class Message implements IMessage {

        mod: ModuleEnum = ModuleEnum.SYSTEM;

        priority: MessagePriorityEnum = MessagePriorityEnum.PRIORITY_0;

        weights: number = 0;

        task: ITask = null;

        groupId: number = 0;

        args: any[] = null;

        method: Function = null;

        caller: Object = null;

        timeout: number = 0;

        recover(): void {
            this.mod = ModuleEnum.SYSTEM;
            this.priority = MessagePriorityEnum.PRIORITY_0;
            this.weights = 0;
            this.task = null;
            this.groupId = 0;
            this.args = null;
            this.method = null;
            this.caller = null;
            this.timeout = 0;
            suncom.Pool.recover("suncore.Message", this);
        }
    }
}