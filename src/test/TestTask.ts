
module test {

    export class TestTask extends suncore.AbstractTask {

        private $flag: number = 1;
        private $index: number = 1;

        constructor(index: number) {
            super();
            this.$index = index;
        }

        run(): boolean {
            if (this.$index === 2) {
                // this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
                suncore.System.cancelTaskByGroupId(suncore.ModuleEnum.CUSTOM, 1);
            }
            if (this.$flag === 1) {
                this.$flag = 0;
                console.log(`在场景创建之前的Task... index:${this.$index}`);
                // 2 秒后会继续
                suncore.System.addTimer(suncore.ModuleEnum.CUSTOM, 2000, this.run, this);
            }
            else {
                console.log(`Task未完成... index:${this.$index}`);
                // 2 秒后会继续
                suncore.System.addTimer(suncore.ModuleEnum.CUSTOM, 2000, this.$delayDone, this);
            }

            return false;
        }

        cancel(): void {
            console.log(`Task取消 index:${this.$index}`);
        }

        private $delayDone(): void {
            console.log(`Task己完成 index:${this.$index}`);
            this.done = true;
        }
    }
}