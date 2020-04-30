
module test {

    export class TestTimelineCommandTask extends suncore.TestTask {

        private $handler: suncom.IHandler = null;

        constructor(handler: suncom.IHandler) {
            super();
            this.$handler = handler;
        }

        run(): boolean {
            this.$startTimelineButPaused();
            this.$startTimelineNotPaused();
            this.$pauseTimelineNotStopped();
            this.$pauseTimelineAndStopped();

            return false;
        }

        private $startTimelineButPaused(): void {
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            suncom.Test.assertFalse(suncore.System.isModuleStopped(suncore.ModuleEnum.SYSTEM));
            suncom.Test.assertFalse(suncore.System.isModuleStopped(suncore.ModuleEnum.SYSTEM));
            suncom.Test.assertFalse(suncore.System.isModulePaused(suncore.ModuleEnum.SYSTEM));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            suncom.Test.assertFalse(suncore.System.isModuleStopped(suncore.ModuleEnum.CUSTOM));
            suncom.Test.assertTrue(suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);
            suncom.Test.assertFalse(suncore.System.isModuleStopped(suncore.ModuleEnum.TIMELINE));
            suncom.Test.assertTrue(suncore.System.isModulePaused(suncore.ModuleEnum.TIMELINE));

            suncom.Test.expect(suncore.System.getDelta()).toBeGreaterOrEqualThan(0);

            suncom.Test.expect(suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)).toBeGreaterOrEqualThan(0);
            suncom.Test.expect(suncore.System.getModuleTimestamp(suncore.ModuleEnum.CUSTOM)).toBeGreaterOrEqualThan(0);
            suncom.Test.expect(suncore.System.getModuleTimestamp(suncore.ModuleEnum.TIMELINE)).toBeGreaterOrEqualThan(0);
        }

        private $startTimelineNotPaused(): void {
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);
            suncom.Test.assertFalse(suncore.System.isModulePaused(suncore.ModuleEnum.SYSTEM));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
            suncom.Test.assertFalse(suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.TIMELINE, false]);
            suncom.Test.assertFalse(suncore.System.isModulePaused(suncore.ModuleEnum.TIMELINE));
        }

        private $pauseTimelineNotStopped(): void {
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);
            suncom.Test.assertFalse(suncore.System.isModulePaused(suncore.ModuleEnum.SYSTEM));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
            suncom.Test.assertTrue(suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.TIMELINE, false]);
            suncom.Test.assertTrue(suncore.System.isModulePaused(suncore.ModuleEnum.TIMELINE));
        }

        private $pauseTimelineAndStopped(): void {
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            suncom.Test.assertTrue(suncore.System.isModuleStopped(suncore.ModuleEnum.CUSTOM));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);
            suncom.Test.assertTrue(suncore.System.isModuleStopped(suncore.ModuleEnum.TIMELINE));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            suncom.Test.assertTrue(suncore.System.isModuleStopped(suncore.ModuleEnum.SYSTEM));

            suncom.Test.expect(suncore.System.getDelta()).toBeUndefined();

            suncom.Test.expect(suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)).toBeUndefined();
            suncom.Test.expect(suncore.System.getModuleTimestamp(suncore.ModuleEnum.CUSTOM)).toBeUndefined();
            suncom.Test.expect(suncore.System.getModuleTimestamp(suncore.ModuleEnum.TIMELINE)).toBeUndefined();

            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);
            this.$handler.run();
        }
    }
}