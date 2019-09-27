
module suncore {

    export abstract class System {
        /**
         * 核心类
         */
        static engine: IEngine;

        /**
         * 游戏时间轴
         */
        static timeline: ITimeline;

        /**
         * 场景时间轴
         */
        static timeStamp: ITimeStamp;

        /**
         * 判断指定模块是否己暂停
         */
        static isModulePaused(mod: ModuleEnum): boolean {
            if (mod === ModuleEnum.CUSTOM) {
                return System.timeStamp.paused;
            }
            else if (mod === ModuleEnum.TIMELINE) {
                return System.timeline.paused;
            }
            return false;
        }

        /**
         * 获取指定模块的时间戳
         */
        static getModuleTimestamp(mod: ModuleEnum): number {
            if (mod === ModuleEnum.CUSTOM) {
                return System.timeStamp.getTime();
            }
            else if (mod === ModuleEnum.TIMELINE) {
                return System.timeline.getTime();
            }
            return System.engine.getTime();
        }

        /**
         * 添加任务
         */
        static addTask(mod: ModuleEnum, task: ITask): void {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn(`System=> add task failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return;
            }
            const message: Message = new Message();
            message.mod = mod;
            message.task = task;
            message.active = false;
            message.priority = MessagePriorityEnum.PRIORITY_TASK;
            System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加触发器
         */
        static addTrigger(mod: ModuleEnum, delay: number, handler: suncom.IHandler): void {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn(`System=> add trigger failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return;
            }
            // 获取模块依赖的时间轴的时间戳
            const message: Message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.timeout = System.getModuleTimestamp(mod) + delay;
            message.priority = MessagePriorityEnum.PRIORITY_TRIGGER;
            System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加网络消息
         * @cmd: 值为 SOCKET_STATE_CHANGE 表示掉线重连消息
         * @TODO: 不确定网络消息在切换场景的时候是否会被清理掉
         */
        static addSocketMessage(name: string, socData: any): void {
            const data: ISocketData = new SocketData();
            data.name = name;
            data.socData = socData;
            const message: Message = new Message();
            message.mod = ModuleEnum.SYSTEM;
            message.data = data;
            message.priority = MessagePriorityEnum.PRIORITY_SOCKET;
            return System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加消息
         */
        static addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, handler: suncom.IHandler): void {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn(`System=> add message failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return;
            }
            const message: Message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.priority = priority;
            System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数
         */
        static addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops: number = 1, real: boolean = false): number {
            if (System.isModulePaused(mod) == true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn(`System=> add timer failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return 0;
            }
            return System.timeStamp.timerManager.addTimer(mod, delay, method, caller, loops, real);
        }

        /**
         * 移除定时器
         */
        static removeTimer(timerId: number): number {
            return System.timeStamp.timerManager.removeTimer(timerId);
        }
    }
}