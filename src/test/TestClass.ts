
module test {

    export class TestClass extends suncore.AbstractTask {

        private $timerId: number;

        run(): boolean {
            suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                console.log("promise level 0:" + data);
                resolve();
            }, [0]);
            suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                console.log("promise level 0:" + data);
                setTimeout(() => {
                    resolve();
                    suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                        console.log("promise level 1:" + data);
                        resolve();
                    }, [4]);
                }, 2000)
                suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                    console.log("promise level 1:" + data);
                    resolve();
                }, [0]);
                suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                    console.log("promise level 1:" + data);
                    resolve();
                    suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                        console.log("promise level 2:" + data);
                        resolve();
                    }, [0]);
                    suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                        console.log("promise level 2:" + data);
                        resolve();
                        suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                            console.log("promise level 3:" + data);
                            setTimeout(() => {
                                resolve();
                            }, 2000)
                        }, [0]);
                        suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                            console.log("promise level 3:" + data);
                            resolve();
                        }, [1]);
                        suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                            console.log("promise level 3:" + data);
                            resolve();
                        }, [2]);
                        suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                            console.log("promise level 3:" + data);
                            resolve();
                        }, [3]);
                    }, [1]);
                    suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                        console.log("promise level 2:" + data);
                        resolve();
                    }, [2]);
                    suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                        console.log("promise level 2:" + data);
                        resolve();
                    }, [3]);
                }, [1]);
                suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                    console.log("promise level 1:" + data);
                    resolve();
                    suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                        console.log("promise level 2:" + data);
                        resolve();
                    }, [4]);
                }, [2]);
                suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                    console.log("promise level 1:" + data);
                    resolve();
                }, [3]);
            }, [1]);
            suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                console.log("promise level 0:" + data);
                resolve();
            }, [2]);
            suncore.System.addPromise(suncore.ModuleEnum.CUSTOM, this, (resolve: Function, data: number) => {
                console.log("promise level 0:" + data);
                resolve();
            }, [3]);

            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, new suncore.SimpleTask(this, () => {
                console.log("SIMPLE TASK: 1");
            }), 9);

            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, new suncore.SimpleTask(this, () => {
                console.log("SIMPLE TASK: 2");
            }), 9);
            // 测试场景定时器
            this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.CUSTOM, 500, this.$onTimerHandler, this, void 0, 0);
            for (let i: number = 0; i < 20; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_0, this, (index) => {
                    console.log("PRIORITY_0 " + index);
                }, [i]);
            }
            for (let i: number = 0; i < 20; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_HIGH, this, (index) => {
                    console.log("PRIORITY_HIGH " + index);
                }, [i]);
            }
            for (let i: number = 0; i < 10; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_NOR, this, (index) => {
                    console.log("PRIORITY_NOR " + index);
                }, [i]);
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LOW, this, (index) => {
                    console.log("PRIORITY_LOW " + index);
                }, [i]);
            }
            for (let i: number = 0; i < 3; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, (index) => {
                    console.log("PRIORITY_LAZY " + index);
                }, [i]);
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, i * 300 + 300, this, (index) => {
                    console.log("PRIORITY_TRIGGER " + index);
                }, [i]);
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, i * 300 + 300, this, (index) => {
                    console.log("PRIORITY_TRIGGER " + index);
                }, [i]);
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTask(suncore.ModuleEnum.CUSTOM, new TestTask(i), 0);
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTask(suncore.ModuleEnum.CUSTOM, new TestTask(i), 1);
            }
            for (let i: number = 0; i < 5; i++) {
                suncore.System.addTask(suncore.ModuleEnum.CUSTOM, new TestTask(i), 2);
            }
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, this, this.$gotoQuadtreeScene);

            return true;
        }

        private $onTimerHandler(count: number, loops: number): void {
            console.log(`测试场景定时器, count:${count}, loops:${loops}`);
        }

        private $gotoQuadtreeScene(count: number, loops: number): void {
            if (count === loops) {
                console.log("测试完毕");
                this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
                this.facade.sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.TIMELINE, true]);

                new test.TestMessage();
            }
        }
    }
}