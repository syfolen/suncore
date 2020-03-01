
module test {

    export class StartupCommand extends puremvc.SimpleCommand {

        execute(): void {
            this.facade.registerCommand(suncore.NotifyKey.START_TIMELINE, suncore.StartTimelineCommand);
            this.facade.registerCommand(suncore.NotifyKey.PAUSE_TIMELINE, suncore.PauseTimelineCommand);

            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            this.facade.sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);

            const handler: suncom.IHandler = suncom.Handler.create(this, this.$onStartup);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, handler);
        }

        private $onStartup(): void {
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new test.TestClass());
        }
    }
}