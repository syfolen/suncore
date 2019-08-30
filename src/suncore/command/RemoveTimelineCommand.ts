
module suncore {

    /**
     * 移除游戏时间轴
     */
    export class RemoveTimelineCommand extends puremvc.SimpleCommand {

        execute(): void {
            System.engine.destroy();
        }
    }
}