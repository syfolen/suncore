
module test {

    export class StartupCommand extends puremvc.SimpleCommand {

        execute(): void {
            this.facade.registerCommand(suncore.NotifyKey.START_TIMELINE, suncore.StartTimelineCommand, suncom.EventPriorityEnum.OSL);
            this.facade.registerCommand(suncore.NotifyKey.PAUSE_TIMELINE, suncore.PauseTimelineCommand, suncom.EventPriorityEnum.OSL);

            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.TIMELINE, false]);

            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, () => {
                suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new test.TestClass());
                // new test.TestMessage();
            });
        }
    }
}