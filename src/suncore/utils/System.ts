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
            console.error(`尝试获取帧时间间隔，但系统模块己停止！！！`);
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
                console.error(`尝试获取时间戳，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加任务
         * export
         */
        export function addTask(mod: ModuleEnum, task: ITask): void {
            if (System.isModuleStopped(mod) === false) {
                const message: IMessage = {
                    mod: mod,
                    task: task,
                    priority: MessagePriorityEnum.PRIORITY_TASK
                };
                M.messageManager.putMessage(message);
            }
            else {
                console.error(`尝试添加任务，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加触发器
         * export
         */
        export function addTrigger(mod: ModuleEnum, delay: number, handler: suncom.IHandler): void {
            if (System.isModuleStopped(mod) === false) {
                // 获取模块依赖的时间轴的时间戳
                const message: IMessage = {
                    mod: mod,
                    handler: handler,
                    timeout: System.getModuleTimestamp(mod) + delay,
                    priority: MessagePriorityEnum.PRIORITY_TRIGGER
                };
                M.messageManager.putMessage(message);
            }
            else {
                console.error(`尝试添加触发器，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加消息
         * export
         */
        export function addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, handler: suncom.IHandler): void {
            if (System.isModuleStopped(mod) === true) {
                const message: IMessage = {
                    mod: mod,
                    handler: handler,
                    priority: priority
                };
                M.messageManager.putMessage(message);
            }
            else {
                console.error(`尝试添加Message消息，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            }
        }

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数，默认为1
         * @real: 是否计算真实次数，默认为false
         * export
         */
        export function addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops: number = 1, real: boolean = false): number {
            if (System.isModuleStopped(mod) === true) {
                return M.timerManager.addTimer(mod, delay, method, caller, loops, real);
            }
            console.error(`尝试添加定时器，但模块 ${ModuleEnum[mod]} 己停止！！！`);
            return 0;
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