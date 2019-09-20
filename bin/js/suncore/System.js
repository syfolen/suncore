var suncore;
(function (suncore) {
    var System = /** @class */ (function () {
        function System() {
        }
        /**
         * 判断指定模块是否己暂停
         */
        System.isModulePaused = function (mod) {
            if (mod === suncore.ModuleEnum.CUSTOM) {
                return System.timeStamp.paused;
            }
            else if (mod === suncore.ModuleEnum.TIMELINE) {
                return System.timeline.paused;
            }
            return false;
        };
        /**
         * 获取指定模块的时间戳
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
         */
        System.addTask = function (mod, task) {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add task failed, cos module " + suncom.Common.convertEnumToString(mod, suncore.ModuleEnum) + " is paused.");
                }
                return;
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
         */
        System.addTrigger = function (mod, delay, handler) {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add trigger failed, cos module " + suncom.Common.convertEnumToString(mod, suncore.ModuleEnum) + " is paused.");
                }
                return;
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
        System.addSocketMessage = function (cmd, socData) {
            var data = new suncore.SocketData();
            data.cmd = cmd;
            data.socData = socData;
            var message = new suncore.Message();
            message.mod = suncore.ModuleEnum.SYSTEM;
            message.data = data;
            message.priority = suncore.MessagePriorityEnum.PRIORITY_SOCKET;
            return System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加消息
         */
        System.addMessage = function (mod, priority, handler) {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add message failed, cos module " + suncom.Common.convertEnumToString(mod, suncore.ModuleEnum) + " is paused.");
                }
                return;
            }
            var message = new suncore.Message();
            message.mod = mod;
            message.handler = handler;
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
         */
        System.addTimer = function (mod, delay, method, caller, loops, real) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (System.isModulePaused(mod) == true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add timer failed, cos module " + suncom.Common.convertEnumToString(mod, suncore.ModuleEnum) + " is paused.");
                }
                return 0;
            }
            return System.timeStamp.timerManager.addTimer(mod, delay, method, caller, loops, real);
        };
        /**
         * 移除定时器
         */
        System.removeTimer = function (timerId) {
            return System.timeStamp.timerManager.removeTimer(timerId);
        };
        return System;
    }());
    suncore.System = System;
})(suncore || (suncore = {}));
//# sourceMappingURL=System.js.map