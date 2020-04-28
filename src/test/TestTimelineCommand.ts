
module test {

    export class TestTimelineCommand {

        constructor() {
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            console.assert(suncore.System.isModuleStopped(suncore.ModuleEnum.SYSTEM) === false, `时间轴启动失败`);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.SYSTEM) === false, `系统时间轴不能暂停`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            console.assert(suncore.System.isModuleStopped(suncore.ModuleEnum.CUSTOM) === false, `时间轴启动失败`);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === true, `时间轴预期为暂停状态`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);
            console.assert(suncore.System.isModuleStopped(suncore.ModuleEnum.TIMELINE) === false, `时间轴启动失败`);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.TIMELINE) === true, `时间轴预期为暂停状态`);

            console.assert(suncore.System.getDelta() === 0, `获取帧时间间隔失败`);

            console.assert(suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) === 0, `获取系统时间戳失败`);
            console.assert(suncore.System.getModuleTimestamp(suncore.ModuleEnum.CUSTOM) === 0, `获取场景时间戳失败`);
            console.assert(suncore.System.getModuleTimestamp(suncore.ModuleEnum.TIMELINE) === 0, `获取游戏时间戳失败`);

            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.SYSTEM) === false, `时间轴继续失败`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === false, `时间轴继续失败`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.TIMELINE, false]);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.TIMELINE) === false, `时间轴继续失败`);

            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.SYSTEM) === false, `系统时间轴不能暂停`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.CUSTOM) === true, `时间轴暂停失败`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.TIMELINE, false]);
            console.assert(suncore.System.isModulePaused(suncore.ModuleEnum.TIMELINE) === true, `时间轴暂停失败`);

            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            console.assert(suncore.System.isModuleStopped(suncore.ModuleEnum.CUSTOM) === true, `时间轴停止失败`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);
            console.assert(suncore.System.isModuleStopped(suncore.ModuleEnum.TIMELINE) === true, `时间轴停止失败`);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            console.assert(suncore.System.isModuleStopped(suncore.ModuleEnum.SYSTEM) === true, `时间轴停止失败`);

            console.assert(suncore.System.getDelta() === void 0, `系统时间轴暂停状态下不应该能够帧时间间隔`);

            console.assert(suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) === void 0, `系统时间轴暂停状态下不应该能够获取时间戳`);
            console.assert(suncore.System.getModuleTimestamp(suncore.ModuleEnum.CUSTOM) === void 0, `场景时间轴暂停状态下不应该能够获取时间戳`);
            console.assert(suncore.System.getModuleTimestamp(suncore.ModuleEnum.TIMELINE) === void 0, `游戏时间轴暂停状态下不应该能够获取时间戳`);
        }
    }
}