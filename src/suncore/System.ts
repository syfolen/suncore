
module suncore {
    /**
     * export
     */
    export abstract class System {
        /**
         * 核心类
         */
        static engine: IEngine;

        /**
         * 游戏时间轴
         * export
         */
        static timeline: ITimeline;

        /**
         * 场景时间轴
         * export
         */
        static timeStamp: ITimeStamp;

        /**
         * 判断指定模块是否己停止
         * export
         */
        static isModuleStopped(mod: ModuleEnum): boolean {
            if (mod === ModuleEnum.TIMELINE) {
                return System.timeline.stopped;
            }
            else if (mod === ModuleEnum.CUSTOM) {
                return System.timeStamp.stopped;
            }
            return false;
        }

        /**
         * 判断指定模块是否己暂停
         * export
         */
        static isModulePaused(mod: ModuleEnum): boolean {
            if (mod === ModuleEnum.TIMELINE) {
                return System.timeline.paused;
            }
            else if (mod === ModuleEnum.CUSTOM) {
                return System.timeStamp.paused;
            }
            return false;
        }

        /**
         * 获取指定模块的时间戳
         * export
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
         * export
         */
        static addTask(mod: ModuleEnum, task: ITask): void {
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加任务");
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
         * export
         */
        static addTrigger(mod: ModuleEnum, delay: number, handler: suncom.IHandler): void {
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加触发器");
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
         * @handler: 若为帧事件消息，则应当以Function作为参数，否则应当以Handler作为参数
         * export
         */
        static addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, handler: suncom.IHandler | Function, caller?: Object): void {
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加消息");
            }
            const message: Message = new Message();
            message.mod = mod;
            message.active = true;
            if (priority === MessagePriorityEnum.PRIORITY_FRAME) {
                if (handler instanceof Function) {
                    message.method = handler;
                }
                else {
                    throw Error("帧消息只能以函数作为消息回调");
                }
            }
            else if (handler instanceof Function) {
                throw Error("非帧消息不允许以函数作为消息回调");
            }
            else {
                message.handler = handler;
            }
            message.caller = caller;
            message.priority = priority;
            System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 移除消息（目前移除的消息仅可能是帧消息）
         * export
         */
        static removeMessage(mod: ModuleEnum, priority: MessagePriorityEnum, handler: Function, caller?: Object): void {
            if (priority !== MessagePriorityEnum.PRIORITY_FRAME) {
                throw Error("非帧消息不允许移除");
            }
            const message: Message = new Message();
            message.mod = mod;
            message.active = false;
            message.method = handler;
            message.caller = caller;
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
         * export
         */
        static addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops: number = 1, real: boolean = false): number {
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加定时器");
            }
            return System.timeStamp.timerManager.addTimer(mod, delay, method, caller, loops, real);
        }

        /**
         * 移除定时器
         * export
         */
        static removeTimer(timerId: number): number {
            return System.timeStamp.timerManager.removeTimer(timerId);
        }
    }
}