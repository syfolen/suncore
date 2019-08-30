
module suncore {

    /**
     * 创建游戏时间轴
     */
    export class CreateTimelineCommand extends puremvc.SimpleCommand {

        execute(): void {
            System.engine = new Engine();
            System.timeline = new Timeline(false);
            System.timeStamp = new TimeStamp();
        }
    }
}