var suncore;
(function (suncore) {
    /**
     * export
     */
    var System = /** @class */ (function () {
        function System() {
        }
        /**
         * 判断指定模块是否己停止
         * export
         */
        System.isModuleStopped = function (mod) {
            if (mod === suncore.ModuleEnum.TIMELINE) {
                return System.timeline.stopped;
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                return System.timeStamp.stopped;
            }
            return false;
        };
        /**
         * 判断指定模块是否己暂停
         * export
         */
        System.isModulePaused = function (mod) {
            if (mod === suncore.ModuleEnum.TIMELINE) {
                return System.timeline.paused;
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                return System.timeStamp.paused;
            }
            return false;
        };
        /**
         * 获取指定模块的时间戳
         * export
         */
        System.getModuleTimestamp = function (mod) {
            if (mod === suncore.ModuleEnum.CUSTOM) {
                return System.timeStamp.getTime();
            }
            else if (mod === suncore.ModuleEnum.TIMELINE) {
                return System.timeline.getTime();
            }
            return System.engine.getTime();
        };
        /**
         * 添加任务
         * export
         */
        System.addTask = function (mod, task) {
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加任务");
            }
            var message = new suncore.Message();
            message.mod = mod;
            message.task = task;
            message.active = false;
            message.priority = suncore.MessagePriorityEnum.PRIORITY_TASK;
            System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加触发器
         * export
         */
        System.addTrigger = function (mod, delay, handler) {
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加触发器");
            }
            // 获取模块依赖的时间轴的时间戳
            var message = new suncore.Message();
            message.mod = mod;
            message.handler = handler;
            message.timeout = System.getModuleTimestamp(mod) + delay;
            message.priority = suncore.MessagePriorityEnum.PRIORITY_TRIGGER;
            System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加网络消息
         * @cmd: 值为 SOCKET_STATE_CHANGE 表示掉线重连消息
         * @TODO: 不确定网络消息在切换场景的时候是否会被清理掉
         */
        System.addSocketMessage = function (name, socData) {
            var data = new suncore.SocketData();
            data.name = name;
            data.socData = socData;
            var message = new suncore.Message();
            message.mod = suncore.ModuleEnum.SYSTEM;
            message.data = data;
            message.priority = suncore.MessagePriorityEnum.PRIORITY_SOCKET;
            return System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加消息
         * @handler: 若为帧事件消息，则应当以Function作为参数，否则应当以Handler作为参数
         * export
         */
        System.addMessage = function (mod, priority, handler, caller) {
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加消息");
            }
            var message = new suncore.Message();
            message.mod = mod;
            message.active = true;
            if (priority === suncore.MessagePriorityEnum.PRIORITY_FRAME) {
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
        };
        /**
         * 移除消息（目前移除的消息仅可能是帧消息）
         * export
         */
        System.removeMessage = function (mod, priority, handler, caller) {
            if (priority !== suncore.MessagePriorityEnum.PRIORITY_FRAME) {
                throw Error("非帧消息不允许移除");
            }
            var message = new suncore.Message();
            message.mod = mod;
            message.active = false;
            message.method = handler;
            message.caller = caller;
            message.priority = priority;
            System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数
         * export
         */
        System.addTimer = function (mod, delay, method, caller, loops, real) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (System.isModuleStopped(mod) === true) {
                throw Error("时间轴停止时不允许添加定时器");
            }
            return System.timeStamp.timerManager.addTimer(mod, delay, method, caller, loops, real);
        };
        /**
         * 移除定时器
         * export
         */
        System.removeTimer = function (timerId) {
            return System.timeStamp.timerManager.removeTimer(timerId);
        };
        return System;
    }());
    suncore.System = System;
})(suncore || (suncore = {}));
//# sourceMappingURL=System.js.map