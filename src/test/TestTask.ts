
module test {

    export class TestTask extends suncore.AbstractTask {

        private $index: number;

        constructor(index: number) {
            super();
            this.$index = index;
        }

        run(): boolean {
            if (this.$index < 0) {
                console.log("在场景创建之前的Task...");
                // 2 秒后会继续
                suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, 2000, this.$delayDone, this);
            }
            else {
                console.log("Task未完成...");
                // 2 秒后会继续
                suncore.System.addTimer(suncore.ModuleEnum.CUSTOM, 2000, this.$delayDone, this);
            }

            return false;
        }

        private $delayDone(): void {
            console.log("Task己完成");
            this.done = true;
        }
    }
}