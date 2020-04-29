
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
            console.assert(false, "你不应该看到这条消息");
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
                console.assert(false, "你不应该看到这条消息");
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_HIGH, suncom.Handler.create(this, () => {
                console.assert(false, "你不应该看到这条消息");
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_NOR, suncom.Handler.create(this, () => {
                console.assert(false, "你不应该看到这条消息");
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LOW, suncom.Handler.create(this, () => {
                console.assert(false, "你不应该看到这条消息");
            }));
            const testCancelTaskData: IData = { msg: 0, list: [] };
            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 1, new TestCancelTask(testCancelTaskData));
            suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, 1000, suncom.Handler.create(this, () => {
                console.assert(false, "你不应该看到这条消息");
            }));
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                console.assert(false, "你不应该看到这条消息");
            }));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);
            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                console.assert(testCancelTaskData.msg === 1, `task被取消了，但是没有执行cancel方法`);
                console.assert(
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
            //     console.assert(data.msg === 0, `时间轴暂停，但task依然执行了`)
            //     exeCnt++;
            //     puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            // }));

            // suncore.System.addTrigger(suncore.ModuleEnum.SYSTEM, 6000, suncom.Handler.create(this, () => {
            //     console.assert(data.msg === 1, `时间轴停止，但task没有执行取消接口`)
            //     exeCnt++;
            // }));

            // suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
            //     console.assert(exeCnt === 2, `系统任务没有完全执行`);
            //     console.log("message test complete");
            //     puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            // }));

            // suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
            //     console.assert(false, "你不应该看到这条消息");
            // }));
        }

        private $aEqualsB<T>(a: T[], b: T[]): void {
            a = a.slice();
            b = b.slice();
            a.sort();
            b.sort();
            console.assert(a.length === b.length, `当前：[${a.join(",")}], 预期：[${b.join(",")}]`);
            for (let i = 0; i < a.length; i++) {
                console.assert(a[i] === b[i], `当前：[${a.join(",")}], 预期：[${b.join(",")}]`);
            }
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
                console.assert(counter.priority_0 === 50, `priority_0 执行次数不正确，若者lazy过早执行`);
                console.assert(counter.priority_high === 50, `priority_high 执行次数不正确，若者lazy过早执行`);
                console.assert(counter.priority_nor === 9, `priority_nor 执行次数不正确，若者lazy过早执行`);
                console.assert(counter.priority_low === 5, `priority_low 执行次数不正确，若者lazy过早执行`);
                console.assert(counter.priority_trigger === 10, `priority_trigger 执行次数不正确，若者lazy过早执行`);
                console.assert(counter.priority_task === 2, `priority_task 执行次数不正确，若者lazy过早执行`);
                counter.priority_lazy++;
            }));

            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                counter.priority_lazy++;
                puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.ENTER_FRAME, onEnterFrameCheckMessageExeccuteTimes, null);
                puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);

                console.assert(counter.priority_lazy === 2, `priority_task 执行次数不正确`);
            }));

            function onEnterFrameCheckMessageExeccuteTimes(): void {
                console.assert(counter.priority_0 === 0 || counter.priority_0 === 50, `message priority_0的执行次数不对，当前：${counter.priority_0}, 预期为0或50`);
                console.assert(
                    counter.priority_high === 0 ||
                    counter.priority_high === 10 ||
                    counter.priority_high === 20 ||
                    counter.priority_high === 30 ||
                    counter.priority_high === 40 ||
                    counter.priority_high === 50,
                    `message priority_high的执行次数不对，当前：${counter.priority_high}, 预期为0或10或20或30或40或50`);
                console.assert(
                    counter.priority_nor === 0 ||
                    counter.priority_nor === 3 ||
                    counter.priority_nor === 6 ||
                    counter.priority_nor === 9,
                    `message priority_nor的执行次数不对，当前：${counter.priority_nor}, 预期为0或3或6或9`);
                console.assert(
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