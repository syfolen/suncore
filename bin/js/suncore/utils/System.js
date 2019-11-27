var suncore;
(function (suncore) {
    /**
     * 系统接口
     * export
     */
    var System;
    (function (System) {
        /**
         * 判断指定模块是否己停止
         * export
         */
        function isModuleStopped(mod) {
            if (mod === suncore.ModuleEnum.TIMELINE) {
                if (suncore.M.timeline === null || suncore.M.timeline.stopped === true) {
                    return true;
                }
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                if (suncore.M.timeStamp === null || suncore.M.timeStamp.stopped === true) {
                    return true;
                }
            }
            else if (suncore.M.engine === null) {
                return true;
            }
            return false;
        }
        System.isModuleStopped = isModuleStopped;
        /**
         * 判断指定模块是否己暂停
         * export
         */
        function isModulePaused(mod) {
            if (isModuleStopped(mod) === true) {
                return true;
            }
            if (mod === suncore.ModuleEnum.TIMELINE) {
                return suncore.M.timeline.paused;
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                return suncore.M.timeStamp.paused;
            }
            return false;
        }
        System.isModulePaused = isModulePaused;
        /**
         * 获取时间间隔（所有模块共享）
         */
        function getDelta() {
            return suncore.M.engine.getDelta();
        }
        System.getDelta = getDelta;
        /**
         * 获取指定模块的时间戳
         * export
         */
        function getModuleTimestamp(mod) {
            if (isModuleStopped(mod) === true) {
                console.error("模块停止时不允许获取时间戳");
                return;
            }
            if (mod === suncore.ModuleEnum.TIMELINE) {
                return suncore.M.timeline.getTime();
            }
            else if (mod === suncore.ModuleEnum.CUSTOM) {
                return suncore.M.timeStamp.getTime();
            }
            return suncore.M.engine.getTime();
        }
        System.getModuleTimestamp = getModuleTimestamp;
        /**
         * 添加任务
         * export
         */
        function addTask(mod, task) {
            if (System.isModuleStopped(mod) === true) {
                console.error("模块停止时不允许添加任务");
                return;
            }
            var message = new suncore.Message();
            message.mod = mod;
            message.task = task;
            message.active = false;
            message.priority = suncore.MessagePriorityEnum.PRIORITY_TASK;
            suncore.M.messageManager.putMessage(message);
        }
        System.addTask = addTask;
        /**
         * 添加触发器
         * export
         */
        function addTrigger(mod, delay, handler) {
            if (System.isModuleStopped(mod) === true) {
                console.error("模块停止时不允许添加触发器");
                return;
            }
            // 获取模块依赖的时间轴的时间戳
            var message = new suncore.Message();
            message.mod = mod;
            message.handler = handler;
            message.timeout = System.getModuleTimestamp(mod) + delay;
            message.priority = suncore.MessagePriorityEnum.PRIORITY_TRIGGER;
            suncore.M.messageManager.putMessage(message);
        }
        System.addTrigger = addTrigger;
        /**
         * 添加消息
         * export
         */
        function addMessage(mod, priority, handler) {
            if (System.isModuleStopped(mod) === true) {
                console.error("模块停止时不允许添加消息");
                return;
            }
            var message = new suncore.Message();
            message.mod = mod;
            message.handler = handler;
            message.priority = priority;
            suncore.M.messageManager.putMessage(message);
        }
        System.addMessage = addMessage;
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
        function addTimer(mod, delay, method, caller, loops, real) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (System.isModuleStopped(mod) === true) {
                console.error("模块停止时不允许添加定时器");
                return;
            }
            return suncore.M.timerManager.addTimer(mod, delay, method, caller, loops, real);
        }
        System.addTimer = addTimer;
        /**
         * 移除定时器
         * export
         */
        function removeTimer(timerId) {
            return suncore.M.timerManager.removeTimer(timerId);
        }
        System.removeTimer = removeTimer;
    })(System = suncore.System || (suncore.System = {}));
})(suncore || (suncore = {}));
//# sourceMappingURL=System.js.map