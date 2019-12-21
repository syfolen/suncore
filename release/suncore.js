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
var suncore;
(function (suncore) {
    var MessagePriorityEnum;
    (function (MessagePriorityEnum) {
        MessagePriorityEnum[MessagePriorityEnum["MIN"] = 0] = "MIN";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_0"] = 1] = "PRIORITY_0";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_HIGH"] = 2] = "PRIORITY_HIGH";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_NOR"] = 3] = "PRIORITY_NOR";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LOW"] = 4] = "PRIORITY_LOW";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LAZY"] = 5] = "PRIORITY_LAZY";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TRIGGER"] = 6] = "PRIORITY_TRIGGER";
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TASK"] = 7] = "PRIORITY_TASK";
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
    var MsgQIdEnum;
    (function (MsgQIdEnum) {
        MsgQIdEnum[MsgQIdEnum["NET_MSG_ID_BEGIN"] = 1] = "NET_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["NET_MSG_ID_END"] = 10] = "NET_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["CUI_MSG_ID_BEGIN"] = 10] = "CUI_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["CUI_MSG_ID_END"] = 100] = "CUI_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["GUI_MSG_ID_BEGIN"] = 100] = "GUI_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["GUI_MSG_ID_END"] = 200] = "GUI_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["OSL_MSG_ID_BEGIN"] = 200] = "OSL_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["OSL_MSG_ID_END"] = 300] = "OSL_MSG_ID_END";
    })(MsgQIdEnum = suncore.MsgQIdEnum || (suncore.MsgQIdEnum = {}));
    var MsgQModEnum;
    (function (MsgQModEnum) {
        MsgQModEnum[MsgQModEnum["MMI"] = 9527] = "MMI";
        MsgQModEnum[MsgQModEnum["SYS"] = 0] = "SYS";
        MsgQModEnum[MsgQModEnum["CUI"] = 1] = "CUI";
        MsgQModEnum[MsgQModEnum["GUI"] = 2] = "GUI";
        MsgQModEnum[MsgQModEnum["OSL"] = 3] = "OSL";
        MsgQModEnum[MsgQModEnum["NET"] = 4] = "NET";
    })(MsgQModEnum = suncore.MsgQModEnum || (suncore.MsgQModEnum = {}));
    var AbstractTask = (function (_super) {
        __extends(AbstractTask, _super);
        function AbstractTask() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$done = false;
            return _this;
        }
        AbstractTask.prototype.cancel = function () {
        };
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
    var BaseService = (function (_super) {
        __extends(BaseService, _super);
        function BaseService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$running = false;
            return _this;
        }
        BaseService.prototype.run = function () {
            if (this.$running === true) {
                console.warn("\u670D\u52A1[" + suncom.Common.getQualifiedClassName(this) + "]\u5DF1\u8FD0\u884C");
                return;
            }
            this.$running = true;
            this.$onRun();
        };
        BaseService.prototype.stop = function () {
            if (this.$running === false) {
                console.warn("\u670D\u52A1[" + suncom.Common.getQualifiedClassName(this) + "]\u672A\u8FD0\u884C");
                return;
            }
            this.$running = false;
            this.$onStop();
        };
        Object.defineProperty(BaseService.prototype, "running", {
            get: function () {
                return this.$running;
            },
            enumerable: true,
            configurable: true
        });
        return BaseService;
    }(puremvc.Notifier));
    suncore.BaseService = BaseService;
    var Engine = (function (_super) {
        __extends(Engine, _super);
        function Engine() {
            var _this = _super.call(this, MsgQModEnum.SYS) || this;
            _this.$delta = 0;
            _this.$runTime = 0;
            _this.$localTime = new Date().valueOf();
            Laya.timer.frameLoop(1, _this, _this.$onFrameLoop);
            return _this;
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
                this.$lapse(this.$delta);
            }
        };
        Engine.prototype.$lapse = function (delta) {
            if (System.isModulePaused(ModuleEnum.TIMELINE) === false) {
                M.timeline.lapse(delta);
            }
            if (System.isModulePaused(ModuleEnum.CUSTOM) === false) {
                M.timeStamp.lapse(delta);
            }
            MsgQ.seqId++;
            this.facade.sendNotification(NotifyKey.MSG_Q_BUSINESS, MsgQModEnum.NET);
            this.facade.sendNotification(NotifyKey.PHYSICS_PREPARE);
            this.facade.sendNotification(NotifyKey.PHYSICS_FRAME);
            this.facade.sendNotification(NotifyKey.ENTER_FRAME);
            M.timerManager.executeTimer();
            M.messageManager.dealMessage();
            M.messageManager.classifyMessages0();
            this.facade.sendNotification(NotifyKey.LATER_FRAME);
            this.facade.sendNotification(NotifyKey.MSG_Q_BUSINESS);
        };
        Engine.prototype.getTime = function () {
            return this.$runTime;
        };
        Engine.prototype.getDelta = function () {
            return this.$delta;
        };
        return Engine;
    }(puremvc.Notifier));
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
                if (System.isModuleStopped(mod) === false) {
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
                remainCount += queue.length;
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    if (queue.length > 0) {
                        if (this.$dealTaskMessage(queue[0]) === true) {
                            queue.shift();
                        }
                        dealCount++;
                    }
                }
                else if (priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    while (queue.length && this.$dealTriggerMessage(queue[0]) === true) {
                        queue.shift();
                        dealCount++;
                    }
                }
                else if (queue.length > 0) {
                    var okCount = 0;
                    var totalCount = this.$getDealCountByPriority(priority);
                    for (; queue.length > 0 && (totalCount === 0 || okCount < totalCount); okCount++) {
                        if (this.$dealCustomMessage(queue.shift()) === false) {
                            okCount--;
                        }
                    }
                    dealCount += okCount;
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
            return task.done === true;
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
                return 10;
            }
            if (priority === MessagePriorityEnum.PRIORITY_NOR) {
                return 3;
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
            while (this.$messages0.length > 0) {
                this.$cancelMessage(this.$messages0.pop());
            }
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                var queue = this.$queues[priority];
                while (queue.length > 0) {
                    this.$cancelMessage(queue.pop());
                }
            }
        };
        MessageQueue.prototype.$cancelMessage = function (message) {
            if (message.priority === MessagePriorityEnum.PRIORITY_TASK) {
                message.task.cancel();
            }
        };
        return MessageQueue;
    }());
    suncore.MessageQueue = MessageQueue;
    var MsgQService = (function (_super) {
        __extends(MsgQService, _super);
        function MsgQService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MsgQService.prototype.$onRun = function () {
            MsgQ.setModuleActive(this.msgQMod, true);
            this.facade.registerObserver(NotifyKey.MSG_Q_BUSINESS, this.$onMsgQBusiness, this);
        };
        MsgQService.prototype.$onStop = function () {
            MsgQ.setModuleActive(this.msgQMod, false);
            this.facade.removeObserver(NotifyKey.MSG_Q_BUSINESS, this.$onMsgQBusiness, this);
        };
        MsgQService.prototype.$onMsgQBusiness = function (mod) {
            var msg = null;
            if (mod !== void 0 && mod !== this.msgQMod) {
                return;
            }
            while (true) {
                if (mod === MsgQModEnum.NET) {
                    msg = MsgQ.fetch(MsgQModEnum.NET, 2);
                }
                else if (this.msgQMod === MsgQModEnum.NET) {
                    msg = MsgQ.fetch(MsgQModEnum.NET, 1);
                }
                else {
                    msg = MsgQ.fetch(this.msgQMod);
                }
                if (msg === null) {
                    break;
                }
                this.$dealMsgQMsg(msg);
            }
        };
        return MsgQService;
    }(BaseService));
    suncore.MsgQService = MsgQService;
    var NotifyKey = (function () {
        function NotifyKey() {
        }
        NotifyKey.STARTUP = "suncore.NotifyKey.STARTUP";
        NotifyKey.SHUTDOWN = "suncore.NotifyKey.SHUTDOWN";
        NotifyKey.START_TIMELINE = "suncore.NotifyKey.START_TIMELINE";
        NotifyKey.PAUSE_TIMELINE = "suncore.NotifyKey.PAUSE_TIMELINE";
        NotifyKey.PHYSICS_FRAME = "suncore.NotifyKey.PHYSICS_FRAME";
        NotifyKey.PHYSICS_PREPARE = "suncore.NotifyKey.PHYSICS_PREPARE";
        NotifyKey.ENTER_FRAME = "suncore.NotifyKey.ENTER_FRAME";
        NotifyKey.LATER_FRAME = "suncore.NotifyKey.LATER_FRAME";
        NotifyKey.MSG_Q_BUSINESS = "suncore.NotifyKey.MSG_Q_BUSINESS";
        return NotifyKey;
    }());
    suncore.NotifyKey = NotifyKey;
    var PauseTimelineCommand = (function (_super) {
        __extends(PauseTimelineCommand, _super);
        function PauseTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PauseTimelineCommand.prototype.execute = function (mod, stop) {
            if (stop === void 0) { stop = true; }
            if (stop === void 0) {
                throw Error("\u6682\u505C\u65F6\u95F4\u8F74\u65F6\u5E94\u5F53\u6307\u5B9A\u53C2\u6570 stop \u7684\u503C");
            }
            if (stop === true) {
                if (System.isModuleStopped(mod) === true) {
                    console.error("Module " + ModuleEnum[mod] + " Is Already Stopped!!!");
                    return;
                }
            }
            else if (System.isModulePaused(mod) === true) {
                console.error("Module " + ModuleEnum[mod] + " Is Already Paused!!!");
                return;
            }
            else if (mod === ModuleEnum.SYSTEM) {
                console.error("Module " + ModuleEnum[mod] + " Cannot Be Paused!!!");
                return;
            }
            if (mod === ModuleEnum.TIMELINE) {
                M.timeline.pause(stop);
            }
            else if (mod === ModuleEnum.CUSTOM) {
                M.timeStamp.pause(stop);
            }
            if (stop === false) {
                return;
            }
            if (mod === ModuleEnum.SYSTEM) {
                if (System.isModuleStopped(ModuleEnum.TIMELINE) === false || System.isModuleStopped(ModuleEnum.CUSTOM) === false) {
                    throw Error("SYSTEM \u4E0D\u80FD\u505C\u6B62\u56E0\u4E3A CUSTOM \u6216 TIMELINE \u4F9D\u7136\u5728\u8FD0\u884C");
                }
            }
            M.timerManager.clearTimer(mod);
            M.messageManager.clearMessages(mod);
            if (mod === ModuleEnum.TIMELINE) {
                M.timeline = null;
            }
            else if (mod === ModuleEnum.CUSTOM) {
                M.timeStamp = null;
            }
            else {
                M.engine.destroy();
                M.engine = null;
            }
            if (mod === ModuleEnum.SYSTEM) {
                M.timerManager = null;
                M.messageManager = null;
            }
        };
        return PauseTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.PauseTimelineCommand = PauseTimelineCommand;
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
    var StartTimelineCommand = (function (_super) {
        __extends(StartTimelineCommand, _super);
        function StartTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StartTimelineCommand.prototype.execute = function (mod, pause) {
            if (pause === void 0) { pause = false; }
            if (pause === void 0) {
                throw Error("\u6682\u505C\u65F6\u95F4\u8F74\u65F6\u5E94\u5F53\u6307\u5B9A\u53C2\u6570 pause \u7684\u503C");
            }
            if (System.isModulePaused(mod) === false) {
                console.error("Module " + ModuleEnum[mod] + " Is Already Started!!!");
                return;
            }
            if (mod === ModuleEnum.SYSTEM && M.engine === null) {
                M.timerManager = new TimerManager();
                M.messageManager = new MessageManager();
            }
            if (mod === ModuleEnum.TIMELINE) {
                if (M.timeline === null) {
                    M.timeline = new Timeline();
                }
                M.timeline.resume(pause);
            }
            else if (mod === ModuleEnum.CUSTOM) {
                if (M.timeStamp === null) {
                    M.timeStamp = new Timeline();
                }
                M.timeStamp.resume(pause);
            }
            else if (mod === ModuleEnum.SYSTEM) {
                if (M.engine === null) {
                    M.engine = new Engine();
                }
            }
        };
        return StartTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.StartTimelineCommand = StartTimelineCommand;
    var Timeline = (function () {
        function Timeline() {
            this.$runTime = 0;
            this.$paused = true;
            this.$stopped = true;
        }
        Timeline.prototype.lapse = function (delta) {
            this.$runTime += delta;
        };
        Timeline.prototype.pause = function (stop) {
            if (stop === void 0) { stop = false; }
            this.$paused = true;
            this.$stopped = stop;
        };
        Timeline.prototype.resume = function (paused) {
            if (paused === void 0) { paused = false; }
            this.$paused = paused;
            this.$stopped = false;
        };
        Timeline.prototype.getTime = function () {
            return this.$runTime;
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
                if (System.isModulePaused(mod) === false) {
                    var timers = this.$timers[mod];
                    var timestamp = System.getModuleTimestamp(mod);
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
    var M;
    (function (M) {
        M.engine = null;
        M.timeline = null;
        M.timeStamp = null;
        M.timerManager = null;
        M.messageManager = null;
    })(M = suncore.M || (suncore.M = {}));
    var MsgQ;
    (function (MsgQ) {
        var $queues = {};
        var $modStats = {};
        MsgQ.seqId = 1;
        function send(src, dest, id, data) {
            if (isModuleActive(dest) === false) {
                console.warn("\u6D88\u606F\u53D1\u9001\u5931\u8D25\uFF0C\u6A21\u5757\u5DF1\u6682\u505C mod:" + MsgQModEnum[dest]);
                return;
            }
            if (check(dest, id) === false) {
                console.warn("\u6D88\u606F\u53D1\u9001\u5931\u8D25\uFF0C\u6D88\u606FID\u975E\u6CD5 mod:" + dest + ", id:" + id);
                return;
            }
            var array = $queues[dest] || null;
            if (array === null) {
                array = $queues[dest] = [];
            }
            var msg = {
                src: src,
                dest: dest,
                seqId: MsgQ.seqId,
                id: id,
                data: data
            };
            array.push(msg);
        }
        MsgQ.send = send;
        function fetch(mod, id) {
            var queue = $queues[mod] || null;
            if (queue === null || queue.length === 0) {
                return null;
            }
            for (var i = 0; i < queue.length; i++) {
                var msg = queue[i];
                if (mod === MsgQModEnum.NET || msg.seqId < MsgQ.seqId) {
                    if (id === void 0 || msg.id === id) {
                        queue.splice(i, 1);
                        return msg;
                    }
                }
            }
            return null;
        }
        MsgQ.fetch = fetch;
        function check(mod, id) {
            var min, max;
            if (mod === MsgQModEnum.NET) {
                min = MsgQIdEnum.NET_MSG_ID_BEGIN;
                max = MsgQIdEnum.NET_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.OSL) {
                min = MsgQIdEnum.OSL_MSG_ID_BEGIN;
                max = MsgQIdEnum.OSL_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.CUI) {
                min = MsgQIdEnum.CUI_MSG_ID_BEGIN;
                max = MsgQIdEnum.CUI_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.GUI) {
                min = MsgQIdEnum.GUI_MSG_ID_BEGIN;
                max = MsgQIdEnum.GUI_MSG_ID_END;
            }
            else {
                throw Error("\u672A\u77E5\u7684\u6D88\u606F\u8303\u56F4 mod:" + mod);
            }
            return id >= min && id < max;
        }
        function isModuleActive(mod) {
            return $modStats[mod] === true;
        }
        MsgQ.isModuleActive = isModuleActive;
        function setModuleActive(mod, active) {
            $modStats[mod] = active;
            if (active === true) {
                return;
            }
            var queue = $queues[mod] || null;
            if (queue === null) {
                return;
            }
            queue.length = 0;
        }
        MsgQ.setModuleActive = setModuleActive;
    })(MsgQ = suncore.MsgQ || (suncore.MsgQ = {}));
    var Mutex;
    (function (Mutex) {
        var SYSTEM_COMMAND_PREFIX = "sun";
        var MUTEX_PREFIX_KEY = "suncore$mutex$prefix";
        var MUTEX_MUTEXES_KEY = "suncore$mutex$mutexes";
        var MUTEX_REFERENCES_KEY = "suncore$mutex$references";
        var mutexes = 0;
        var references = 0;
        var currentPrefix = null;
        Mutex.actMsgQMod = -1;
        Mutex.checkPrefix = false;
        Mutex.mmiMsgQMap = {};
        Mutex.mmiMsgQCmd = {};
        function getCommandPrefix(name) {
            var index = name.indexOf("_");
            if (index < 1) {
                throw Error("\u5FC5\u987B\u4E3A\u547D\u4EE4\u6307\u5B9A\u4E00\u4E2A\u6A21\u5757\u540D\uFF0C\u683C\u5F0F\u4E3A MOD_" + name);
            }
            return name.substr(0, index);
        }
        function isSunCmd(name) {
            return name.substr(0, 3) === SYSTEM_COMMAND_PREFIX;
        }
        function isMMIPrefix(prefix) {
            var msgQMod = Mutex.mmiMsgQMap[prefix] || -1;
            return msgQMod !== -1;
        }
        function asserts(prefix) {
            var yes = isMMIPrefix(prefix);
            if (Mutex.actMsgQMod === MsgQModEnum.MMI) {
                if (yes === true) {
                    Mutex.actMsgQMod = Mutex.mmiMsgQMap[prefix];
                    currentPrefix = prefix;
                }
                else {
                    throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u4F20\u9012\u6D88\u606F src:MMI, dest:" + prefix);
                }
            }
            return prefix;
        }
        function active(msgQMod) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (Mutex.actMsgQMod === -1) {
                Mutex.actMsgQMod = msgQMod;
            }
        }
        Mutex.active = active;
        function deactive() {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (references === 0 && Mutex.actMsgQMod !== -1) {
                Mutex.actMsgQMod = -1;
            }
        }
        Mutex.deactive = deactive;
        function lock(name) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (isSunCmd(name) === true) {
                references++;
            }
            else {
                var prefix = asserts(getCommandPrefix(name));
                if (currentPrefix === null || currentPrefix === prefix) {
                    mutexes++;
                    if (mutexes === 1) {
                        currentPrefix = prefix;
                    }
                }
                else {
                    throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u4F20\u9012\u6D88\u606F\uFF0Csrc:" + prefix + ", dest:" + getCommandPrefix(name));
                }
            }
        }
        Mutex.lock = lock;
        function unlock(name) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (isSunCmd(name) === true) {
                references--;
            }
            else {
                var prefix = getCommandPrefix(name);
                if (currentPrefix === null || prefix === currentPrefix) {
                    mutexes--;
                    if (mutexes === 0) {
                        currentPrefix = null;
                    }
                    else if (mutexes < 0) {
                        throw Error("\u4E92\u65A5\u4F53\u91CA\u653E\u9519\u8BEF\uFF1A" + mutexes);
                    }
                }
                else {
                    throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u4F20\u9012\u6D88\u606F\uFF0Csrc:" + prefix + ", dest:" + getCommandPrefix(name));
                }
            }
        }
        Mutex.unlock = unlock;
        function enableMMIAction() {
            if (Mutex.checkPrefix === false) {
                return true;
            }
            if (currentPrefix === null) {
                return true;
            }
            var msgQMod = Mutex.mmiMsgQMap[currentPrefix] || -1;
            return msgQMod !== -1;
        }
        Mutex.enableMMIAction = enableMMIAction;
        function create(name, target) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }
            if (isSunCmd(name) === true) {
                return;
            }
            var mutex = target[MUTEX_MUTEXES_KEY] || 0;
            if (mutex > 0) {
                var prefix = target[MUTEX_PREFIX_KEY] || null;
                if (prefix === null) {
                    throw Error("\u610F\u5916\u7684\u4E92\u65A5\u91CF mutex:" + mutex);
                }
                if (prefix !== getCommandPrefix(name)) {
                    throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u76D1\u542C\u6D88\u606F\uFF0Csrc:" + prefix + ", dest:" + getCommandPrefix(name));
                }
            }
            else {
                target[MUTEX_PREFIX_KEY] = getCommandPrefix(name);
            }
            target[MUTEX_MUTEXES_KEY] = mutex + 1;
        }
        Mutex.create = create;
        function release(name, target) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }
            if (isSunCmd(name) === true) {
                return;
            }
            var mutex = target[MUTEX_MUTEXES_KEY] || 0;
            if (mutex <= 0) {
                throw Error("\u4E92\u65A5\u91CF\u4E0D\u5B58\u5728");
            }
            var prefix = target[MUTEX_PREFIX_KEY] || null;
            if (prefix === null) {
                throw Error("\u4E92\u65A5\u4F53\u4E0D\u5B58\u5728");
            }
            if (prefix !== getCommandPrefix(name)) {
                throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u76D1\u542C\u6D88\u606F\uFF0Csrc:" + prefix + ", dest:" + getCommandPrefix(name));
            }
            if (mutex - 1 === 0) {
                delete target[MUTEX_PREFIX_KEY];
                delete target[MUTEX_MUTEXES_KEY];
            }
            else {
                target[MUTEX_MUTEXES_KEY] = mutex - 1;
            }
        }
        Mutex.release = release;
    })(Mutex = suncore.Mutex || (suncore.Mutex = {}));
    var System;
    (function (System) {
        function isModuleStopped(mod) {
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
        System.isModuleStopped = isModuleStopped;
        function isModulePaused(mod) {
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
        System.isModulePaused = isModulePaused;
        function getDelta() {
            return M.engine.getDelta();
        }
        System.getDelta = getDelta;
        function getModuleTimestamp(mod) {
            if (isModuleStopped(mod) === true) {
                console.error("\u5C1D\u8BD5\u83B7\u53D6\u65F6\u95F4\u6233\uFF0C\u4F46\u6A21\u5757\u5DF1\u505C\u6B62 mod:" + suncom.Common.convertEnumToString(mod, ModuleEnum));
            }
            if (mod === ModuleEnum.TIMELINE) {
                return M.timeline.getTime();
            }
            else if (mod === ModuleEnum.CUSTOM) {
                return M.timeStamp.getTime();
            }
            return M.engine.getTime();
        }
        System.getModuleTimestamp = getModuleTimestamp;
        function addTask(mod, task) {
            if (System.isModuleStopped(mod) === true) {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u4EFB\u52A1\uFF0C\u4F46\u6A21\u5757\u5DF1\u505C\u6B62 mod:" + suncom.Common.convertEnumToString(mod, ModuleEnum));
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.task = task;
            message.active = false;
            message.priority = MessagePriorityEnum.PRIORITY_TASK;
            M.messageManager.putMessage(message);
        }
        System.addTask = addTask;
        function addTrigger(mod, delay, handler) {
            if (System.isModuleStopped(mod) === true) {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u89E6\u53D1\u5668\uFF0C\u4F46\u6A21\u5757\u5DF1\u505C\u6B62 mod:" + suncom.Common.convertEnumToString(mod, ModuleEnum));
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.timeout = System.getModuleTimestamp(mod) + delay;
            message.priority = MessagePriorityEnum.PRIORITY_TRIGGER;
            M.messageManager.putMessage(message);
        }
        System.addTrigger = addTrigger;
        function addMessage(mod, priority, handler) {
            if (System.isModuleStopped(mod) === true) {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u6D88\u606F\uFF0C\u4F46\u6A21\u5757\u5DF1\u505C\u6B62 mod:" + suncom.Common.convertEnumToString(mod, ModuleEnum));
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.priority = priority;
            M.messageManager.putMessage(message);
        }
        System.addMessage = addMessage;
        function addTimer(mod, delay, method, caller, loops, real) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (System.isModuleStopped(mod) === true) {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u5B9A\u65F6\u5668\uFF0C\u4F46\u6A21\u5757\u5DF1\u505C\u6B62 mod:" + suncom.Common.convertEnumToString(mod, ModuleEnum));
                return;
            }
            return M.timerManager.addTimer(mod, delay, method, caller, loops, real);
        }
        System.addTimer = addTimer;
        function removeTimer(timerId) {
            return M.timerManager.removeTimer(timerId);
        }
        System.removeTimer = removeTimer;
    })(System = suncore.System || (suncore.System = {}));
})(suncore || (suncore = {}));
