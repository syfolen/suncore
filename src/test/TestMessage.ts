
module test {

    interface IData {

        msg: number;

        list: string[];
    }

    interface IMessageExecuteTimeCounter {
        priority_0: number;
        priority_low: number;
        priority_nor: number;
        priority_high: number;
        priority_lazy: number;
        priority_trigger: number;
        priority_task: number;
    }

    class TestTask extends suncore.AbstractTask {

        private $data: IData;

        constructor(data: IData) {
            super();
            this.$data = data;
        }

        run(): boolean {
            suncore.System.cancelTaskByGroupId(suncore.ModuleEnum.CUSTOM, 3);
            suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, 2000, suncom.Handler.create(this, () => {
                this.$data.list.push("b");
                this.done = true;
            }))
            return false;
        }
    }

    class TestCancelTask extends suncore.AbstractTask {

        private $data: IData = null;

        constructor(data: IData) {
            super();
            this.$data = data;
        }

        run(): boolean {
            suncom.Test.notExpected();
            return true;
        }

        cancel(): void {
            this.$data.msg = 1;
        }
    }

    export class TestMessage {

        constructor() {
            console.log("test message");
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);

            this.$testAllMessageWhetherExecuteInRightTimes();
            this.$testWhetherMessageDoCancelWhenTimelineIsStopped();

            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(this, this.$onSystemMission));
        }

        private $testWhetherMessageDoCancelWhenTimelineIsStopped(): void {

        }

        private $onSystemMission(): void {
            const res = {
                is_priority_0_canceled: true,
                is_priority_high_canceled: true,
                is_priority_nor_canceled: true,
                is_priority_low_canceled: true,
                is_priority_task_canceled: true,
                is_priority_trigger_canceled: true,
                is_priority_lazy_canceled: true
            };
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);

            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(this, () => {
                suncom.Test.notExpected();
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_HIGH, suncom.Handler.create(this, () => {
                suncom.Test.notExpected();
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_NOR, suncom.Handler.create(this, () => {
                suncom.Test.notExpected();
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LOW, suncom.Handler.create(this, () => {
                suncom.Test.notExpected();
            }));
            const testCancelTaskData: IData = { msg: 0, list: [] };
            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 1, new TestCancelTask(testCancelTaskData));
            suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, 1000, suncom.Handler.create(this, () => {
                suncom.Test.notExpected();
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                suncom.Test.notExpected();
            }));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                suncom.Test.expect(testCancelTaskData.msg).interpret(`task被取消了，但是没有执行cancel方法`).toBe(1);
                suncom.Test.assertTrue(
                    res.is_priority_0_canceled === true ||
                    res.is_priority_high_canceled === true ||
                    res.is_priority_nor_canceled === true ||
                    res.is_priority_low_canceled === true ||
                    res.is_priority_task_canceled === true ||
                    res.is_priority_trigger_canceled === true ||
                    res.is_priority_lazy_canceled === true
                    , `有任务未取消`);
            }));

            // const data: IData = { msg: 0, list: [] };
            // suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 5, new TestTask(data));
            // puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);

            // let exeCnt: number = 0;
            // suncore.System.addTrigger(suncore.ModuleEnum.SYSTEM, 3000, suncom.Handler.create(this, () => {
            //     suncom.Test.expect(exeCnt).note(`时间轴暂停，但task依然执行了`).toBe(0);
            //     exeCnt++;
            //     puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            // }));

            // suncore.System.addTrigger(suncore.ModuleEnum.SYSTEM, 6000, suncom.Handler.create(this, () => {
            //     suncom.Test.expect(exeCnt).note(`时间轴停止，但task没有执行取消接口`).toBe(1);
            //     exeCnt++;
            // }));

            // suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
            //     suncom.Test.expect(exeCnt).note(`系统任务没有完全执行`).toBe(2);
            //     console.log("message test complete");
            //     puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            // }));

            // suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
            //     suncom.Test.notExpected();
            // }));
        }

        private $testAllMessageWhetherExecuteInRightTimes(): void {
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);

            puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.ENTER_FRAME, onEnterFrameCheckMessageExeccuteTimes, null);

            const counter: IMessageExecuteTimeCounter = {
                priority_0: 0,
                priority_low: 0,
                priority_nor: 0,
                priority_high: 0,
                priority_lazy: 0,
                priority_trigger: 0,
                priority_task: 0
            };

            for (let i = 0; i < 50; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(this, () => {
                    counter.priority_0++;
                }));
            }

            for (let i = 0; i < 50; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_HIGH, suncom.Handler.create(this, () => {
                    counter.priority_high++;
                }));
            }

            for (let i = 0; i < 9; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_NOR, suncom.Handler.create(this, () => {
                    counter.priority_nor++;
                }));
            }

            for (let i = 0; i < 5; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LOW, suncom.Handler.create(this, () => {
                    counter.priority_low++;
                }));
            }

            for (let i = 0; i < 10; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, (i + 1) * 500, suncom.Handler.create(this, () => {
                    counter.priority_trigger++;
                }));
            }

            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 1, new suncore.SimpleTask(
                suncom.Handler.create(this, () => {
                    counter.priority_task++;
                })
            ));

            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 3, new suncore.SimpleTask(
                suncom.Handler.create(this, () => {
                    counter.priority_task++;
                })
            ));

            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                suncom.Test.expect(counter.priority_0).interpret(`priority_0 执行次数不正确，若者lazy过早执行`).toBe(50);
                suncom.Test.expect(counter.priority_high).interpret(`priority_high 执行次数不正确，若者lazy过早执行`).toBe(50);
                suncom.Test.expect(counter.priority_nor).interpret(`priority_nor 执行次数不正确，若者lazy过早执行`).toBe(9);
                suncom.Test.expect(counter.priority_low).interpret(`priority_low 执行次数不正确，若者lazy过早执行`).toBe(5);
                suncom.Test.expect(counter.priority_trigger).interpret(`priority_trigger 执行次数不正确，若者lazy过早执行`).toBe(10);
                suncom.Test.expect(counter.priority_task).interpret(`priority_task 执行次数不正确，若者lazy过早执行`).toBe(2);
                counter.priority_lazy++;
            }));

            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                counter.priority_lazy++;
                puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.ENTER_FRAME, onEnterFrameCheckMessageExeccuteTimes, null);
                puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);

                suncom.Test.expect(counter.priority_lazy).interpret(`priority_lazy 执行次数不正确`).toBe(2);
            }));

            function onEnterFrameCheckMessageExeccuteTimes(): void {
                suncom.Test.assertTrue(counter.priority_0 === 0 || counter.priority_0 === 50, `message priority_0的执行次数不对，当前：${counter.priority_0}, 预期为0或50`);
                suncom.Test.assertTrue(
                    counter.priority_high === 0 ||
                    counter.priority_high === 10 ||
                    counter.priority_high === 20 ||
                    counter.priority_high === 30 ||
                    counter.priority_high === 40 ||
                    counter.priority_high === 50,
                    `message priority_high的执行次数不对，当前：${counter.priority_high}, 预期为0或10或20或30或40或50`);
                suncom.Test.assertTrue(
                    counter.priority_nor === 0 ||
                    counter.priority_nor === 3 ||
                    counter.priority_nor === 6 ||
                    counter.priority_nor === 9,
                    `message priority_nor的执行次数不对，当前：${counter.priority_nor}, 预期为0或3或6或9`);
                suncom.Test.assertTrue(
                    counter.priority_low === 0 ||
                    counter.priority_low === 1 ||
                    counter.priority_low === 2 ||
                    counter.priority_low === 3 ||
                    counter.priority_low === 4 ||
                    counter.priority_low === 5,
                    `message priority_low的执行次数不对，当前：${counter.priority_low}, 预期为0或1或2或3或4或5`);
            }
        }
    }
}