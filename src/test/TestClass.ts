
module test {

    export class TestClass extends suncore.AbstractTask {

        private $timerId: number;

        run(): boolean {
            // 测试场景定时器
            this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.CUSTOM, 500, this.$onTimerHandler, this, 0);
            for (let i: number = 0; i < 20; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(this, (index) => {
                    console.log("PRIORITY_0 " + index);
                }, [i]));
            }
            for (let i: number = 0; i < 20; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_HIGH, suncom.Handler.create(this, (index) => {
                    console.log("PRIORITY_HIGH " + index);
                }, [i]));
            }
            for (let i: number = 0; i < 10; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_NOR, suncom.Handler.create(this, (index) => {
                    console.log("PRIORITY_NOR " + index);
                }, [i]));
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LOW, suncom.Handler.create(this, (index) => {
                    console.log("PRIORITY_LOW " + index);
                }, [i]));
            }
            for (let i: number = 0; i < 3; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, (index) => {
                    console.log("PRIORITY_LAZY " + index);
                }, [i]));
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, i * 300 + 300, suncom.Handler.create(this, (index) => {
                    console.log("PRIORITY_TRIGGER " + index);
                }, [i]));
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, i * 300 + 300, suncom.Handler.create(this, (index) => {
                    console.log("PRIORITY_TRIGGER " + index);
                }, [i]));
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTask(suncore.ModuleEnum.CUSTOM, new TestTask(i));
            }
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, this.$gotoQuadtreeScene));

            return true;
        }

        private $onTimerHandler(repeat: number, loops: number): void {
            console.log(`测试场景定时器, repeat:${repeat}, loops:${loops}`);
        }

        private $gotoQuadtreeScene(repeat: number, loops: number): void {
            if (repeat === loops) {
                console.log("测试完毕");
                this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
                this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);
            }
        }
    }
}