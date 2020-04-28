
module test {

    interface IData {

        msg: number;

        list: string[];
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

        cancel(): void {
            this.$data.msg = 1;
        }
    }

    export class TestMessage {

        private $data = {
            priority_0: 0,
            priority_low: 0,
            priority_nor: 0,
            priority_high: 0,
            priority_lazy: 0,
            priority_trigger: 0,
            task_exec_name_list: [],
            task_canceled: true
        };

        constructor() {
            console.log("test message");
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.SYSTEM, false]);
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);

            puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);

            for (let i = 0; i < 50; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(this, () => {
                    this.$data.priority_0++;
                }));
            }

            for (let i = 0; i < 50; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_HIGH, suncom.Handler.create(this, () => {
                    this.$data.priority_high++;
                }));
            }

            for (let i = 0; i < 9; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_NOR, suncom.Handler.create(this, () => {
                    this.$data.priority_nor++;
                }));
            }

            for (let i = 0; i < 5; i++) {
                suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LOW, suncom.Handler.create(this, () => {
                    this.$data.priority_low++;
                }));
            }

            for (let i = 0; i < 10; i++) {
                suncore.System.addTrigger(suncore.ModuleEnum.CUSTOM, (i + 1) * 500, suncom.Handler.create(this, () => {
                    this.$data.priority_trigger++;
                }));
            }

            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 1, new suncore.SimpleTask(
                suncom.Handler.create(this, () => {
                    this.$data.task_exec_name_list.push("a");
                })
            ));

            const data: IData = { msg: 0, list: this.$data.task_exec_name_list };
            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 2, new TestTask(data));
            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 3, new suncore.SimpleTask(
                suncom.Handler.create(this, () => {
                    this.$data.task_canceled = false;
                })
            ));

            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 4, new suncore.SimpleTask(
                suncom.Handler.create(this, () => {
                    this.$data.task_exec_name_list.push("c");
                })
            ));

            suncore.System.addMessage(suncore.ModuleEnum.CUSTOM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, () => {
                console.assert(this.$data.priority_0 === 50, `LAZY不应该响应在priority_0未执行完之前`);
                console.assert(this.$data.priority_high === 50, `LAZY不应该响应在priority_high未执行完之前`);
                console.assert(this.$data.priority_nor === 9, `LAZY不应该响应在priority_nor未执行完之前`);
                console.assert(this.$data.priority_low === 5, `LAZY不应该响应在priority_low未执行完之前`);
                console.assert(this.$data.priority_trigger === 10, `LAZY不应该响应在priority_trigger未执行完之前`);
                console.assert(data.msg === 1, `task执行完毕后未执行取消接口`);
                console.assert(this.$data.task_canceled === true, `定时器未能通过groupId来取消`);
                this.$aEqualsB(this.$data.task_exec_name_list, ["a", "b", "c"]);
            }));

            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, suncom.Handler.create(this, this.$onSystemMission));
        }

        private $onSystemMission(): void {
            const data: IData = { msg: 0, list: [] };
            suncore.System.addTask(suncore.ModuleEnum.CUSTOM, 5, new TestTask(data));
            puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, false]);

            let exeCnt: number = 0;
            suncore.System.addTrigger(suncore.ModuleEnum.SYSTEM, 3000, suncom.Handler.create(this, () => {
                console.assert(data.msg === 0, `时间轴暂停，但task依然执行了`)
                exeCnt++;
                puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.CUSTOM, true]);
            }));

            suncore.System.addTrigger(suncore.ModuleEnum.SYSTEM, 6000, suncom.Handler.create(this, () => {
                console.assert(data.msg === 1, `时间轴停止，但task没有执行取消接口`)
                exeCnt++;
            }));

            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, ()=>{
                console.assert(exeCnt === 2, `系统任务没有完全执行`);
                console.log("message test complete");
                puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.PAUSE_TIMELINE, [suncore.ModuleEnum.SYSTEM, true]);
            }));

            suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_LAZY, suncom.Handler.create(this, ()=>{
                console.log("你不应该看到这条消息");
            }));
        }

        private $onEnterFrame(): void {
            console.assert(this.$data.priority_0 === 0 || this.$data.priority_0 === 50, `message priority_0的执行次数不对，当前：${this.$data.priority_0}, 预期为0或50`);
            console.assert(
                this.$data.priority_high === 0 ||
                this.$data.priority_high === 10 ||
                this.$data.priority_high === 20 ||
                this.$data.priority_high === 30 ||
                this.$data.priority_high === 40 ||
                this.$data.priority_high === 50,
                `message priority_high的执行次数不对，当前：${this.$data.priority_high}, 预期为0或10或20或30或40或50`);
            console.assert(
                this.$data.priority_nor === 0 ||
                this.$data.priority_nor === 3 ||
                this.$data.priority_nor === 6 ||
                this.$data.priority_nor === 9,
                `message priority_nor的执行次数不对，当前：${this.$data.priority_nor}, 预期为0或3或6或9`);
            console.assert(
                this.$data.priority_low === 0 ||
                this.$data.priority_low === 1 ||
                this.$data.priority_low === 2 ||
                this.$data.priority_low === 3 ||
                this.$data.priority_low === 4 ||
                this.$data.priority_low === 5,
                `message priority_low的执行次数不对，当前：${this.$data.priority_low}, 预期为0或1或2或3或4或5`);
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
    }
}