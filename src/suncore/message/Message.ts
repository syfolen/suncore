
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
            this.task = null;
            this.args = null;
            this.method = null;
            this.caller = null;
            suncom.Pool.recover("suncore.Message", this);
        }
    }
}