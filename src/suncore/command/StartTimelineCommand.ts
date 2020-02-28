
module suncore {
    /**
     * 开始时间轴，若时间轴不存在，则会自动创建
     * export
     */
    export class StartTimelineCommand extends puremvc.SimpleCommand {

        /**
         * @mod: 时间轴模块
         * @pause: 时间轴在开启时是否处于暂停状态
         * export
         */
        execute(mod: ModuleEnum, pause: boolean = false): void {
            if (System.isModulePaused(mod) === false) {
                console.error(`模块 ${ModuleEnum[mod]} 己经启动！！！`);
                return;
            }

            // 初始化
            if (mod === ModuleEnum.SYSTEM && M.engine === null) {
                M.timerManager = new TimerManager();
                M.messageManager = new MessageManager();
            }

            if (mod === ModuleEnum.TIMELINE) {
                if (M.timeline === null) {
                    M.timeline = new Timeline();
                }
                M.timeline.resume(pause);
            }
            else if (mod === ModuleEnum.CUSTOM) {
                if (M.timeStamp === null) {
                    M.timeStamp = new Timeline();
                }
                M.timeStamp.resume(pause);
            }
            else if (mod === ModuleEnum.SYSTEM) {
                if (M.engine === null) {
                    M.engine = new Engine();
                }
            }
        }
    }
}