/**
 *    Copyright 2019 Binfeng Sun<christon.sun@qq.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license suncore.js (c) 2019 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/suncore
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @license suncore.js (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://github.com/syfolen/suncore
 * https://blog.csdn.net/syfolen
 */
var suncore;
(function (suncore) {
    var MessagePriorityEnum;
    (function (MessagePriorityEnum) {
        MessagePriorityEnum[MessagePriorityEnum["MIN"] = 0] = "MIN";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_0"] = 0] = "PRIORITY_0";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_HIGH"] = 1] = "PRIORITY_HIGH";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_NOR"] = 2] = "PRIORITY_NOR";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LOW"] = 3] = "PRIORITY_LOW";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LAZY"] = 4] = "PRIORITY_LAZY";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TRIGGER"] = 5] = "PRIORITY_TRIGGER";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TASK"] = 6] = "PRIORITY_TASK";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_SOCKET"] = 7] = "PRIORITY_SOCKET";
        MessagePriorityEnum[MessagePriorityEnum["MAX"] = 8] = "MAX";
    })(MessagePriorityEnum = suncore.MessagePriorityEnum || (suncore.MessagePriorityEnum = {}));
    var ModuleEnum;
    (function (ModuleEnum) {
        ModuleEnum[ModuleEnum["MIN"] = 0] = "MIN";
        ModuleEnum[ModuleEnum["SYSTEM"] = 0] = "SYSTEM";
        ModuleEnum[ModuleEnum["CUSTOM"] = 1] = "CUSTOM";
        ModuleEnum[ModuleEnum["TIMELINE"] = 2] = "TIMELINE";
        ModuleEnum[ModuleEnum["MAX"] = 3] = "MAX";
    })(ModuleEnum = suncore.ModuleEnum || (suncore.ModuleEnum = {}));
    var AbstractTask = (function (_super) {
        __extends(AbstractTask, _super);
        function AbstractTask() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$done = false;
            return _this;
        }
        Object.defineProperty(AbstractTask.prototype, "done", {
            get: function () {
                return this.$done;
            },
            set: function (yes) {
                this.$done = yes;
            },
            enumerable: true,
            configurable: true
        });
        return AbstractTask;
    }(puremvc.Notifier));
    suncore.AbstractTask = AbstractTask;
    var CreateTimelineCommand = (function (_super) {
        __extends(CreateTimelineCommand, _super);
        function CreateTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreateTimelineCommand.prototype.execute = function () {
            System.engine = new Engine();
            System.timeline = new Timeline(false);
            System.timeStamp = new TimeStamp();
        };
        return CreateTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.CreateTimelineCommand = CreateTimelineCommand;
    var Engine = (function () {
        function Engine() {
            this.$runTime = 0;
            this.$delta = 0;
            this.$localTime = new Date().valueOf();
            Laya.timer.frameLoop(1, this, this.$onFrameLoop);
        }
        Engine.prototype.destroy = function () {
            Laya.timer.clear(this, this.$onFrameLoop);
        };
        Engine.prototype.$onFrameLoop = function () {
            var oldTime = this.$localTime;
            this.$localTime = new Date().valueOf();
            this.$delta = this.$localTime - oldTime;
            if (this.$delta > 0) {
                this.$runTime += this.$delta;
                System.timeStamp.lapse(this.$delta);
            }
        };
        Engine.prototype.getTime = function () {
            return this.$runTime;
        };
        Engine.prototype.getDelta = function () {
            return this.$delta;
        };
        return Engine;
    }());
    suncore.Engine = Engine;
    var Message = (function () {
        function Message() {
        }
        return Message;
    }());
    suncore.Message = Message;
    var MessageManager = (function () {
        function MessageManager() {
            this.$queues = [];
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$queues[mod] = new MessageQueue(mod);
            }
        }
        MessageManager.prototype.putMessage = function (message) {
            this.$queues[message.mod].putMessage(message);
        };
        MessageManager.prototype.dealMessage = function () {
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) === false) {
                    this.$queues[mod].dealMessage();
                }
            }
        };
        MessageManager.prototype.classifyMessages0 = function () {
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) === false) {
                    this.$queues[mod].classifyMessages0();
                }
            }
        };
        MessageManager.prototype.clearMessages = function (mod) {
            this.$queues[mod].clearMessages();
        };
        return MessageManager;
    }());
    suncore.MessageManager = MessageManager;
    var MessageNotifier = (function () {
        function MessageNotifier() {
        }
        MessageNotifier.notify = function (cmd, data) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("MessageNotifier=> notify cmd:" + cmd.toString(16) + ", data:" + JSON.stringify(data));
            }
            MessageNotifier.inst.dispatchEvent(cmd.toString(), data);
        };
        MessageNotifier.register = function (cmd, method, caller) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("MessageNotifier=>register cmd:" + cmd.toString(16));
            }
            MessageNotifier.inst.addEventListener(cmd.toString(), method, caller);
        };
        MessageNotifier.unregister = function (cmd, method, caller) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("MessageNotifier=>unregister cmd:" + cmd.toString(16));
            }
            MessageNotifier.inst.removeEventListener(cmd.toString(), method, caller);
        };
        MessageNotifier.inst = new suncom.EventSystem();
        return MessageNotifier;
    }());
    suncore.MessageNotifier = MessageNotifier;
    var MessageQueue = (function () {
        function MessageQueue(mod) {
            this.$queues = [];
            this.$messages0 = [];
            this.$mod = mod;
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority] = [];
            }
        }
        MessageQueue.prototype.putMessage = function (message) {
            this.$messages0.push(message);
        };
        MessageQueue.prototype.dealMessage = function () {
            var dealCount = 0;
            var remainCount = 0;
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                var queue = this.$queues[priority];
                if (priority === MessagePriorityEnum.PRIORITY_LAZY) {
                    continue;
                }
                if (priority === MessagePriorityEnum.PRIORITY_SOCKET && System.timeStamp.paused === true) {
                    continue;
                }
                remainCount += queue.length;
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    if (queue.length > 0) {
                        if (this.$dealTaskMessage(queue[0]) === true) {
                            queue.shift();
                        }
                        dealCount++;
                    }
                }
                else if (priority === MessagePriorityEnum.PRIORITY_SOCKET) {
                    if (queue.length > 0) {
                        this.$dealSocketMessage(queue.shift());
                        dealCount++;
                    }
                }
                else if (priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    while (queue.length && this.$dealTriggerMessage(queue[0]) == true) {
                        queue.shift();
                        dealCount++;
                    }
                }
                else if (queue.length > 0) {
                    var count = 0;
                    var ignoreCount = 0;
                    var totalCount = this.$getDealCountByPriority(priority);
                    for (; queue.length && (totalCount == 0 || count < totalCount); count++) {
                        if (this.$dealCustomMessage(queue.shift()) === false) {
                            count--;
                            ignoreCount++;
                        }
                    }
                    dealCount += count;
                    if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                        ignoreCount && suncom.Logger.log("MessageQueue=> mod:" + this.$mod + ", priority:" + priority + ", count:" + count + ", ignoreCount:" + ignoreCount);
                    }
                }
            }
            if (remainCount === 0 && this.$messages0.length === 0) {
                var queue = this.$queues[MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    this.$dealCustomMessage(queue.shift());
                    dealCount++;
                }
            }
            return dealCount;
        };
        MessageQueue.prototype.$dealTaskMessage = function (message) {
            var task = message.task;
            if (message.active === false) {
                message.active = true;
                if (task.run() === true) {
                    task.done = true;
                }
            }
            return task.done == true;
        };
        MessageQueue.prototype.$dealSocketMessage = function (message) {
            var data = message.data;
        };
        MessageQueue.prototype.$dealTriggerMessage = function (message) {
            if (message.timeout > System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            message.handler.run();
            return true;
        };
        MessageQueue.prototype.$dealCustomMessage = function (message) {
            var res = message.handler.run();
            if (res === false) {
                return false;
            }
            return true;
        };
        MessageQueue.prototype.$getDealCountByPriority = function (priority) {
            if (priority === MessagePriorityEnum.PRIORITY_0) {
                return 0;
            }
            if (priority === MessagePriorityEnum.PRIORITY_HIGH) {
                return 7;
            }
            if (priority === MessagePriorityEnum.PRIORITY_NOR) {
                return 2;
            }
            if (priority === MessagePriorityEnum.PRIORITY_LOW) {
                return 1;
            }
            throw Error("错误的消息优先级");
        };
        MessageQueue.prototype.classifyMessages0 = function () {
            while (this.$messages0.length) {
                var message = this.$messages0.shift();
                if (message.priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    this.$addTriggerMessage(message);
                }
                else {
                    this.$queues[message.priority].push(message);
                }
            }
        };
        MessageQueue.prototype.$addTriggerMessage = function (message) {
            var queue = this.$queues[MessagePriorityEnum.PRIORITY_TRIGGER];
            var min = 0;
            var mid = 0;
            var max = queue.length - 1;
            var index = -1;
            while (max - min > 1) {
                mid = Math.floor((min + max) * 0.5);
                if (queue[mid].timeout <= message.timeout) {
                    min = mid;
                }
                else if (queue[mid].timeout > message.timeout) {
                    max = mid;
                }
                else {
                    break;
                }
            }
            for (var i = min; i <= max; i++) {
                if (queue[i].timeout > message.timeout) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                queue.push(message);
            }
            else {
                queue.splice(index, 0, message);
            }
        };
        MessageQueue.prototype.clearMessages = function () {
            this.$messages0.length = 0;
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority].length = 0;
            }
        };
        MessageQueue.prototype.$cancelMessage = function (message) {
            message.task && message.task.cancel();
        };
        return MessageQueue;
    }());
    suncore.MessageQueue = MessageQueue;
    var NotifyKey = (function () {
        function NotifyKey() {
        }
        NotifyKey.STARTUP = "suncore.NotifyKey.STARTUP";
        NotifyKey.SHUTDOWN = "suncore.NotifyKey.SHUTDOWN";
        NotifyKey.FRAME_ENTER = "suncore.NotifyKey.FRAME_ENTER";
        NotifyKey.FRAME_LATER = "suncore.NotifyKey.FRAME_LATER";
        NotifyKey.CREATE_TIMELINE = "suncore.NotifyKey.CREATE_TIMELINE";
        NotifyKey.REMOVE_TIMELINE = "suncore.NotifyKey.REMOVE_TIMELINE";
        NotifyKey.TIMELINE_STOPPED = "suncore.NotifyKey.TIMELINE_STOPPED";
        NotifyKey.TIMESTAMP_STOPPED = "suncore.NotifyKey.TIMESTAMP_STOPPED";
        return NotifyKey;
    }());
    suncore.NotifyKey = NotifyKey;
    var RemoveTimelineCommand = (function (_super) {
        __extends(RemoveTimelineCommand, _super);
        function RemoveTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RemoveTimelineCommand.prototype.execute = function () {
            System.engine.destroy();
        };
        return RemoveTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.RemoveTimelineCommand = RemoveTimelineCommand;
    var SimpleTask = (function (_super) {
        __extends(SimpleTask, _super);
        function SimpleTask(handler) {
            var _this = _super.call(this) || this;
            _this.$handler = handler;
            return _this;
        }
        SimpleTask.prototype.run = function () {
            this.$handler.run();
            return true;
        };
        return SimpleTask;
    }(AbstractTask));
    suncore.SimpleTask = SimpleTask;
    var SocketData = (function () {
        function SocketData() {
        }
        return SocketData;
    }());
    suncore.SocketData = SocketData;
    var System = (function () {
        function System() {
        }
        System.isModulePaused = function (mod) {
            if (mod === ModuleEnum.CUSTOM) {
                return System.timeStamp.paused;
            }
            else if (mod === ModuleEnum.TIMELINE) {
                return System.timeline.paused;
            }
            return false;
        };
        System.getModuleTimestamp = function (mod) {
            if (mod === ModuleEnum.CUSTOM) {
                return System.timeStamp.getTime();
            }
            else if (mod === ModuleEnum.TIMELINE) {
                return System.timeline.getTime();
            }
            return System.engine.getTime();
        };
        System.addTask = function (mod, task) {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add task failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.task = task;
            message.active = false;
            message.priority = MessagePriorityEnum.PRIORITY_TASK;
            System.timeStamp.messageManager.putMessage(message);
        };
        System.addTrigger = function (mod, delay, handler) {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add trigger failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.timeout = System.getModuleTimestamp(mod) + delay;
            message.priority = MessagePriorityEnum.PRIORITY_TRIGGER;
            System.timeStamp.messageManager.putMessage(message);
        };
        System.addSocketMessage = function (cmd, socData) {
            var data = new SocketData();
            data.cmd = cmd;
            data.socData = socData;
            var message = new Message();
            message.mod = ModuleEnum.SYSTEM;
            message.data = data;
            message.priority = MessagePriorityEnum.PRIORITY_SOCKET;
            return System.timeStamp.messageManager.putMessage(message);
        };
        System.addMessage = function (mod, priority, handler) {
            if (System.isModulePaused(mod) === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add message failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.priority = priority;
            System.timeStamp.messageManager.putMessage(message);
        };
        System.addTimer = function (mod, delay, method, caller, loops, real) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (System.isModulePaused(mod) == true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.ENGINE) === suncom.DebugMode.ENGINE) {
                    suncom.Logger.warn("System=> add timer failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return 0;
            }
            return System.timeStamp.timerManager.addTimer(mod, delay, method, caller, loops, real);
        };
        System.removeTimer = function (timerId) {
            return System.timeStamp.timerManager.removeTimer(timerId);
        };
        return System;
    }());
    suncore.System = System;
    var Timeline = (function () {
        function Timeline(lockStep) {
            this.$paused = true;
            this.$stopped = true;
            this.$runTime = 0;
            this.$delta = 0;
            this.$lockStep = lockStep;
        }
        Timeline.prototype.lapse = function (delta) {
            this.$delta = delta;
            this.$runTime += delta;
        };
        Timeline.prototype.pause = function () {
            this.$paused = true;
        };
        Timeline.prototype.resume = function (paused) {
            if (paused === void 0) { paused = false; }
            this.$paused = paused;
            this.$stopped = false;
        };
        Timeline.prototype.stop = function () {
            this.$stopped = true;
            System.timeStamp.timerManager.clearTimer(ModuleEnum.TIMELINE);
            System.timeStamp.messageManager.clearMessages(ModuleEnum.TIMELINE);
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMELINE_STOPPED);
        };
        Timeline.prototype.getTime = function () {
            return this.$runTime;
        };
        Timeline.prototype.getDelta = function () {
            return this.$delta;
        };
        Object.defineProperty(Timeline.prototype, "paused", {
            get: function () {
                return this.$paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timeline.prototype, "stopped", {
            get: function () {
                return this.$stopped;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timeline.prototype, "lockStep", {
            get: function () {
                return this.$lockStep;
            },
            enumerable: true,
            configurable: true
        });
        return Timeline;
    }());
    suncore.Timeline = Timeline;
    var Timer = (function () {
        function Timer() {
        }
        return Timer;
    }());
    suncore.Timer = Timer;
    var TimerManager = (function () {
        function TimerManager() {
            this.$seedId = 0;
            this.$timers = [];
            this.$timerMap = {};
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$timers[mod] = [];
            }
        }
        TimerManager.prototype.$createNewTimerId = function () {
            this.$seedId++;
            return this.$seedId;
        };
        TimerManager.prototype.executeTimer = function () {
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                var timers = this.$timers[mod];
                var timestamp = System.getModuleTimestamp(mod);
                if (System.isModulePaused(mod) === false) {
                    while (timers.length) {
                        var timer = timers[0];
                        if (timer.active === true) {
                            if (timer.timeout > timestamp) {
                                break;
                            }
                            if (timer.real === true) {
                                timer.repeat++;
                            }
                            else {
                                timer.repeat = Math.floor((timestamp - timer.timestamp) / timer.delay);
                            }
                        }
                        if (timer.active === false || (timer.loops > 0 && timer.repeat >= timer.loops)) {
                            delete this.$timerMap[timer.timerId];
                        }
                        else {
                            this.addTimer(timer.mod, timer.delay, timer.method, timer.caller, timer.loops, timer.real, timer.timerId, timer.timestamp, timer.timeout, timer.repeat);
                        }
                        timers.shift();
                        if (timer.active === true) {
                            timer.method.call(timer.caller, timer.repeat, timer.loops);
                        }
                    }
                }
            }
        };
        TimerManager.prototype.addTimer = function (mod, delay, method, caller, loops, real, timerId, timestamp, timeout, repeat) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (timerId === void 0) { timerId = 0; }
            if (timestamp === void 0) { timestamp = -1; }
            if (timeout === void 0) { timeout = -1; }
            if (repeat === void 0) { repeat = 0; }
            var timer = new Timer();
            var currentTimestamp = System.getModuleTimestamp(mod);
            if (timerId === 0) {
                timerId = this.$createNewTimerId();
            }
            if (timestamp === -1) {
                timestamp = currentTimestamp;
            }
            if (timeout === -1) {
                timeout = currentTimestamp;
            }
            if (delay < 1) {
                throw Error("非法的定时器执行间隔");
            }
            var dev = 0;
            if (real === true) {
                dev = (currentTimestamp - timeout) % delay;
            }
            else {
                dev = (currentTimestamp - timestamp) % delay;
            }
            timeout = currentTimestamp + delay - dev;
            timer.mod = mod;
            timer.active = true;
            timer.delay = delay;
            timer.method = method;
            timer.caller = caller;
            timer.real = real;
            timer.loops = loops;
            timer.repeat = repeat;
            timer.timerId = timerId;
            timer.timestamp = timestamp;
            timer.timeout = timeout;
            var timers = this.$timers[mod];
            var index = -1;
            var min = 0;
            var mid = 0;
            var max = timers.length - 1;
            while (max - min > 1) {
                mid = Math.floor((min + max) * 0.5);
                if (timers[mid].timeout <= timeout) {
                    min = mid;
                }
                else if (timers[mid].timeout > timeout) {
                    max = mid;
                }
                else {
                    break;
                }
            }
            for (var i = min; i <= max; i++) {
                if (timers[i].timeout > timeout) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                timers.push(timer);
            }
            else {
                timers.splice(index, 0, timer);
            }
            this.$timerMap[timerId] = timer;
            return timerId;
        };
        TimerManager.prototype.removeTimer = function (timerId) {
            if (timerId > 0 && this.$timerMap[timerId] !== void 0) {
                this.$timerMap[timerId].active = false;
            }
            return 0;
        };
        TimerManager.prototype.clearTimer = function (mod) {
            var timers = this.$timers[mod];
            while (timers.length > 0) {
                var timer = timers.pop();
                delete this.$timerMap[timer.timerId];
            }
        };
        return TimerManager;
    }());
    suncore.TimerManager = TimerManager;
    var TimeStamp = (function (_super) {
        __extends(TimeStamp, _super);
        function TimeStamp() {
            var _this = _super.call(this, false) || this;
            _this.$timerManager = new TimerManager();
            _this.$messageManager = new MessageManager();
            return _this;
        }
        TimeStamp.prototype.lapse = function (delta) {
            if (this.paused === false) {
                _super.prototype.lapse.call(this, delta);
                if (System.timeline.paused === false) {
                    if (System.timeline.lockStep === false) {
                        System.timeline.lapse(delta);
                    }
                }
            }
            puremvc.Facade.getInstance().sendNotification(NotifyKey.FRAME_ENTER);
            this.$timerManager.executeTimer();
            this.$messageManager.dealMessage();
            this.$messageManager.classifyMessages0();
            puremvc.Facade.getInstance().sendNotification(NotifyKey.FRAME_LATER);
        };
        TimeStamp.prototype.stop = function () {
            this.$stopped = true;
            System.timeStamp.timerManager.clearTimer(ModuleEnum.CUSTOM);
            System.timeStamp.messageManager.clearMessages(ModuleEnum.CUSTOM);
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMESTAMP_STOPPED);
        };
        Object.defineProperty(TimeStamp.prototype, "timerManager", {
            get: function () {
                return this.$timerManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeStamp.prototype, "messageManager", {
            get: function () {
                return this.$messageManager;
            },
            enumerable: true,
            configurable: true
        });
        return TimeStamp;
    }(Timeline));
    suncore.TimeStamp = TimeStamp;
})(suncore || (suncore = {}));
