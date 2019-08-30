
module test {

    export class StartupCommand extends puremvc.SimpleCommand {

        execute(): void {
            puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.CREATE_TIMELINE, suncore.CreateTimelineCommand);
            puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.REMOVE_TIMELINE, suncore.RemoveTimelineCommand);

            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.CREATE_TIMELINE);

            suncore.System.timeline.resume();
            suncore.System.timeStamp.resume();

            const handler: suncom.IHandler = suncom.Handler.create(this, this.$onStartup);
            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, handler);
        }

        private $onStartup(): void {
            suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new test.TestClass());
        }
    }
}