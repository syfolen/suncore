
module suncore {
    /**
     * 暂停时间轴
     * export
     */
    export class PauseTimelineCommand extends puremvc.SimpleCommand {

        /**
         * @mod: 时间轴模块
         * @stop: 是否停止时间轴，默认为true
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         * export
         */
        execute(mod: ModuleEnum, stop: boolean = true): void {
            if (stop === void 0) {
                throw Error(`暂停时间轴时应当指定参数 stop 的值`);
            }
            if (stop === true) {
                if (System.isModuleStopped(mod) === true) {
                    console.error(`Module ${ModuleEnum[mod]} Is Already Stopped!!!`);
                    return;
                }
            }
            else if (System.isModulePaused(mod) === true) {
                console.error(`Module ${ModuleEnum[mod]} Is Already Paused!!!`);
                return;
            }
            else if (mod === ModuleEnum.SYSTEM) {
                console.error(`Module ${ModuleEnum[mod]} Cannot Be Paused!!!`);
                return;
            }

            if (mod === ModuleEnum.TIMELINE) {
                M.timeline.pause(stop);
            }
            else if (mod === ModuleEnum.CUSTOM) {
                M.timeStamp.pause(stop);
            }

            if (stop === false) {
                return;
            }

            if (mod === suncore.ModuleEnum.SYSTEM) {
                if (System.isModuleStopped(suncore.ModuleEnum.TIMELINE) === false || System.isModuleStopped(suncore.ModuleEnum.CUSTOM) === false) {
                    throw Error(`SYSTEM 不能停止因为 CUSTOM 或 TIMELINE 依然在运行`);
                }
            }

            // 移除模块下的消息和定时器
            M.timerManager.clearTimer(mod);
            M.messageManager.clearMessages(mod);

            if (mod === ModuleEnum.TIMELINE) {
                M.timeline = null;
            }
            else if (mod === ModuleEnum.CUSTOM) {
                M.timeStamp = null;
            }
            else {
                M.engine.destroy();
                M.engine = null;
            }

            if (mod === ModuleEnum.SYSTEM) {
                M.timerManager = null;
                M.messageManager = null;
            }
        }
    }
}