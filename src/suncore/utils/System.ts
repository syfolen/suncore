/**
 * @license suncore (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/suncore
 * export
 */
module suncore {
    /**
     * 系统接口
     * export
     */
    export namespace System {
        /**
         * 随机的groupId
         */
        export let $taskGroupId: number = 1000;

        export function createTaskGroupId(): number {
            System.$taskGroupId++;
            return System.$taskGroupId;
        }

        /**
         * 判断指定模块是否己停止
         * export
         */
        export function isModuleStopped(mod: ModuleEnum): boolean {
            if (mod === ModuleEnum.TIMELINE) {
                if (M.timeline === null || M.timeline.stopped === true) {
                    return true;
                }
            }
            else if (mod === ModuleEnum.CUSTOM) {
                if (M.timeStamp === null || M.timeStamp.stopped === true) {
                    return true;
                }
            }
            else if (M.engine === null) {
                return true;
            }
            return false;
        }

        /**
         * 判断指定模块是否己暂停
         * export
         */
        export function isModulePaused(mod: ModuleEnum): boolean {
            if (isModuleStopped(mod) === true) {
                return true;
            }
            if (mod === ModuleEnum.TIMELINE) {
                return M.timeline.paused;
            }
            else if (mod === ModuleEnum.CUSTOM) {
                return M.timeStamp.paused;
            }
            return false;
        }

        /**
         * 获取时间间隔（所有模块共享）
         * export
         */
        export function getDelta(): number {
            if (isModuleStopped(ModuleEnum.SYSTEM) === false) {
                return M.engine.getDelta();
            }
            else {
                suncom.Logger.error(`尝试获取帧时间间隔，但系统模块己停止！！！`);
            }
        }

        /**
         * 获取指定模块的时间戳
         * export
         */
        export function getModuleTimestamp(mod: ModuleEnum): number {
            if (isModuleStopped(mod) === false) {
                if (mod === ModuleEnum.TIMELINE) {
                    return M.timeline.getTime();
                }
                else if (mod === ModuleEnum.CUSTOM) {
                    return M.timeStamp.getTime();
                }
                return M.engine.getTime();
            }
            else {
                suncom.Logger.error(`尝试获取时间戳，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加任务
         * @groupId: 不同编组并行执行，若为-1，则自动给预一个groupId，默认为: 0
         * @return: 返回任务的groupId，若为-1，则说明任务添加失败
         * 说明：
         * 1. 自定义的groupId的值不允许超过1000
         * export
         */
        export function addTask(mod: ModuleEnum, task: ITask, groupId: number = 0): number {
            if (System.isModuleStopped(mod) === false) {
                if (groupId === -1) {
                    groupId = System.createTaskGroupId();
                }
                else if (groupId > 1000) {
                    throw Error(`自定义的Task GroupId不允许超过1000`);
                }
                const message: IMessage = suncom.Pool.getItemByClass("suncore.Message", Message);
                message.mod = mod;
                message.task = task;
                message.groupId = groupId;
                message.priority = MessagePriorityEnum.PRIORITY_TASK;
                M.messageManager.putMessage(message);
            }
            else {
                groupId = -1;
                suncom.Logger.error(`尝试添加任务，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
            return groupId;
        }

        /**
         * 取消任务
         * export
         */
        export function cancelTaskByGroupId(mod: ModuleEnum, groupId: number): void {
            M.messageManager.cancelTaskByGroupId(mod, groupId);
        }

        /**
         * 添加触发器
         * export
         */
        export function addTrigger(mod: ModuleEnum, delay: number, caller: Object, method: Function, args: any[] = null): void {
            if (System.isModuleStopped(mod) === false) {
                const message: IMessage = suncom.Pool.getItemByClass("suncore.Message", Message);
                message.mod = mod;
                message.args = args;
                message.caller = caller;
                message.method = method;
                message.timeout = System.getModuleTimestamp(mod) + delay;
                message.priority = MessagePriorityEnum.PRIORITY_TRIGGER;
                M.messageManager.putMessage(message);
            }
            else {
                suncom.Logger.error(`尝试添加触发器，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加承诺
         * @method: 此方法被调用时，第一个参数必然是resolve方法，你应当在method方法执行完毕时调用resolve方法，否则该promise将永远不会结束
         * export
         */
        export function addPromise(mod: ModuleEnum, caller: Object, method: Function, args: any[] = null): void {
            if (System.isModuleStopped(mod) === false) {
                const message: IMessage = suncom.Pool.getItemByClass("suncore.Message", Message);
                message.mod = mod;
                message.task = new PromiseTask(caller, method, args);
                message.priority = MessagePriorityEnum.PRIORITY_PROMISE;
                M.messageManager.putMessage(message);
            }
            else {
                suncom.Logger.error(`尝试添加Promise消息，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加消息
         * export
         */
        export function addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, caller: Object, method: Function, args: any[] = null): void {
            if (System.isModuleStopped(mod) === false) {
                const message: IMessage = suncom.Pool.getItemByClass("suncore.Message", Message);
                message.mod = mod;
                message.args = args;
                message.caller = caller;
                message.method = method;
                message.priority = priority;
                M.messageManager.putMessage(message);
            }
            else {
                suncom.Logger.error(`尝试添加Message消息，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加自定义消息
         * @messageId: 再三考虑，这个值应当作为形参传入，否则不利于问题调试
         * @message: 消息日志
         * 说明：
         * 1. 通过此接口注册的 MessageId 会无条件限制 MessagePriorityEnum.PRIORITY_LAZY 的执行，直到 MessageId 被移除
         * 2. 有时候你没法借助 System 的其它接口来限制 MessagePriorityEnum.PRIORITY_LAZY 的执行，此接口会帮助到你
         * export
         */
        export function addCustomMessageId(mod: ModuleEnum, messageId: number, message: string = null): void {
            if (System.isModuleStopped(mod) === false) {
                M.messageManager.addCustomMessageId(mod, messageId, message);
            }
            else {
                suncom.Logger.error(`尝试添加自定义消息，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 移除自定义消息
         * @message: 消息日志
         * 说明
         * 1. 当所有 MessageId 均被移除时，对 MessagePriorityEnum.PRIORITY_LAZY 的执行限制将被解除
         * export
         */
        export function removeCustomMessageId(mod: ModuleEnum, messageId: number): void {
            if (System.isModuleStopped(mod) === false) {
                M.messageManager.removeCustomMessageId(mod, messageId);
            }
            else {
                suncom.Logger.error(`尝试移除自定义消息，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应间隔，若为数组，则第二个参数表示首次响应延时，且默认为：0，若首次响应延时为0，则定时器会立即执行一次
         * @method: 回调函数，默认参数：{ count: number, loops: number }
         * @caller: 回调对象
         * @args[]: 参数列表
         * @loops: 响应次数，默认为1
         * @jumpFrame: 时钟是否跳帧，若为 true ，则在单位时间间隔内，回调会连续执行多次，出于性能考虑，默认为： false
         * export
         */
        export function addTimer(mod: ModuleEnum, delay: number | number[], method: Function, caller: Object, args?: any[], loops: number = 1, jumpFrame: boolean = false): number {
            if (System.isModuleStopped(mod) === false) {
                return M.timerManager.addTimer(mod, delay, method, caller, args, loops, jumpFrame);
            }
            else {
                suncom.Logger.error(`尝试添加定时器，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 移除定时器
         * export
         */
        export function removeTimer(timerId: number): number {
            return M.timerManager.removeTimer(timerId);
        }
    }
}