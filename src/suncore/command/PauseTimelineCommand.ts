
module suncore {
    /**
     * 暂停时间轴
     * export
     */
    export class PauseTimelineCommand extends puremvc.SimpleCommand {

        /**
         * @mod: 时间轴模块
         * @stop: 若为true，时间轴将被停止而非暂停，默认为：true
         * export
         */
        execute(mod: ModuleEnum, stop: boolean = true): void {
            if (stop === true) {
                if (System.isModuleStopped(mod) === true) {
                    console.error(`模块 ${ModuleEnum[mod]} 己经停止！！！`);
                    return;
                }
            }
            else if (System.isModulePaused(mod) === true) {
                console.error(`模块 ${ModuleEnum[mod]} 己经暂停！！！`);
                return;
            }
            else if (mod === ModuleEnum.SYSTEM) {
                console.error(`无法暂停 ${ModuleEnum[mod]} 模块！！！`);
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

            if (mod === ModuleEnum.SYSTEM) {
                if (System.isModuleStopped(ModuleEnum.TIMELINE) === false || System.isModuleStopped(ModuleEnum.CUSTOM) === false) {
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