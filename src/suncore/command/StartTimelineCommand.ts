
module suncore {
    /**
     * 开始时间轴，若时间轴不存在，则会自动创建
     * export
     */
    export class StartTimelineCommand extends puremvc.SimpleCommand {

        /**
         * @mod: 时间轴模块
         * @pause: 时间轴在开启时是否处于暂停状态
         * 说明：
         * 1. 参数pause并不会对SYSTEM模块的时间轴生效
         * export
         */
        execute(mod: ModuleEnum, pause: boolean = false): void {
            if (pause === void 0) {
                throw Error(`暂停时间轴时应当指定参数 pause 的值`);
            }
            if (System.isModulePaused(mod) === false) {
                console.error(`Module ${ModuleEnum[mod]} Is Already Started!!!`);
                return;
            }
            
            // 注册数据
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