
module suncore {

    /**
     * 创建游戏时间轴
     * export
     */
    export class CreateTimelineCommand extends puremvc.SimpleCommand {

        /**
         * export
         */
        execute(): void {
            System.engine = new Engine();
            System.timeline = new Timeline(false);
            System.timeStamp = new TimeStamp();
        }
    }
}