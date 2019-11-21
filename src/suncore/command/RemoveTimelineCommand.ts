
module suncore {

    /**
     * 移除游戏时间轴
     * export
     */
    export class RemoveTimelineCommand extends puremvc.SimpleCommand {

        /**
         * export
         */
        execute(): void {
            System.engine.destroy();
        }
    }
}