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
        MsgQIdEnum[MsgQIdEnum["NSL_MSG_ID_BEGIN"] = 1] = "NSL_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["NSL_MSG_ID_END"] = 10] = "NSL_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["KAL_MSG_ID_BEGIN"] = 10] = "KAL_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["KAL_MSG_ID_END"] = 100] = "KAL_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["MMI_MSG_ID_BEGIN"] = 100] = "MMI_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["MMI_MSG_ID_END"] = 200] = "MMI_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["CUI_MSG_ID_BEGIN"] = 200] = "CUI_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["CUI_MSG_ID_END"] = 300] = "CUI_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["GUI_MSG_ID_BEGIN"] = 300] = "GUI_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["GUI_MSG_ID_END"] = 500] = "GUI_MSG_ID_END";
        MsgQIdEnum[MsgQIdEnum["L4C_MSG_ID_BEGIN"] = 500] = "L4C_MSG_ID_BEGIN";
        MsgQIdEnum[MsgQIdEnum["L4C_MSG_ID_END"] = 800] = "L4C_MSG_ID_END";
    })(MsgQIdEnum = suncore.MsgQIdEnum || (suncore.MsgQIdEnum = {}));
    var MsgQModEnum;
    (function (MsgQModEnum) {
        MsgQModEnum[MsgQModEnum["NIL"] = -1] = "NIL";
        MsgQModEnum[MsgQModEnum["SYS"] = 0] = "SYS";
        MsgQModEnum[MsgQModEnum["KAL"] = 1] = "KAL";
        MsgQModEnum[MsgQModEnum["MMI"] = 2] = "MMI";
        MsgQModEnum[MsgQModEnum["CUI"] = 3] = "CUI";
        MsgQModEnum[MsgQModEnum["GUI"] = 4] = "GUI";
        MsgQModEnum[MsgQModEnum["L4C"] = 5] = "L4C";
        MsgQModEnum[MsgQModEnum["NSL"] = 6] = "NSL";
        MsgQModEnum[MsgQModEnum["ANY"] = 7] = "ANY";
    })(MsgQModEnum = suncore.MsgQModEnum || (suncore.MsgQModEnum = {}));
    var AbstractTask = (function (_super) {
        __extends(AbstractTask, _super);
        function AbstractTask() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.$done = false;
            _this.$running = false;
            return _this;
        }
        AbstractTask.prototype.cancel = function () {
        };
        Object.defineProperty(AbstractTask.prototype, "done", {
            get: function () {
                return this.$done;
            },
            set: function (yes) {
                if (this.$done !== yes) {
                    this.$done = yes;
                    if (yes === true) {
                        this.cancel();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractTask.prototype, "running", {
            get: function () {
                return this.$running;
            },
            set: function (yes) {
                this.$running = yes;
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
            if (this.facade.hasObserver(NotifyKey.ENTER_FRAME, null, this) === true) {
                throw Error("\u8BF7\u91CD\u5199$frameLoop\u65B9\u6CD5\u6765\u66FF\u4EE3ENTER_FRAME\u4E8B\u4EF6");
            }
            if (this.$running === true && this.$frameLoop !== BaseService.prototype.$frameLoop) {
                this.facade.registerObserver(NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            }
        };
        BaseService.prototype.stop = function () {
            if (this.$running === false) {
                console.warn("\u670D\u52A1[" + suncom.Common.getQualifiedClassName(this) + "]\u672A\u8FD0\u884C");
                return;
            }
            this.$running = false;
            this.$onStop();
            if (this.$running === false && this.$frameLoop !== BaseService.prototype.$frameLoop) {
                this.facade.removeObserver(NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            }
        };
        BaseService.prototype.$onEnterFrame = function () {
            if (this.$running === true) {
                this.$frameLoop();
            }
        };
        BaseService.prototype.$frameLoop = function () {
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
            if (System.isModulePaused(ModuleEnum.CUSTOM) === false) {
                M.timeStamp.lapse(delta);
            }
            if (System.isModulePaused(ModuleEnum.TIMELINE) === false) {
                M.timeline.lapse(delta);
            }
            this.facade.sendNotification(NotifyKey.MSG_Q_BUSINESS, MsgQModEnum.NSL);
            this.facade.sendNotification(NotifyKey.PHYSICS_PREPARE);
            this.facade.sendNotification(NotifyKey.PHYSICS_FRAME);
            M.timerManager.executeTimer();
            this.facade.sendNotification(NotifyKey.ENTER_FRAME);
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
        MessageManager.prototype.cancelTaskByGroupId = function (mod, groupId) {
            this.$queues[mod].cancelTaskByGroupId(mod, groupId);
        };
        return MessageManager;
    }());
    suncore.MessageManager = MessageManager;
    var MessageQueue = (function () {
        function MessageQueue(mod) {
            this.$tasks = [];
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
                var queue = void 0;
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    queue = this.$tasks;
                }
                else {
                    queue = this.$queues[priority];
                }
                if (queue.length === 0 || priority === MessagePriorityEnum.PRIORITY_LAZY) {
                    continue;
                }
                if (priority === MessagePriorityEnum.PRIORITY_TASK) {
                    for (var id = this.$tasks.length - 1; id > -1; id--) {
                        var tasks = this.$tasks[id];
                        if (tasks.length > 0 && this.$dealTaskMessage(tasks[0]) === true) {
                            tasks.shift();
                            dealCount++;
                        }
                        if (tasks.length > 1) {
                            remainCount += tasks.length - 1;
                        }
                        else if (tasks.length === 0) {
                            this.$tasks.splice(id, 1);
                        }
                    }
                }
                else if (priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
                    var out = { canceled: false };
                    while (queue.length > 0 && this.$dealTriggerMessage(queue[0], out) === true) {
                        queue.shift();
                        if (out.canceled === false) {
                            dealCount++;
                        }
                    }
                }
                else {
                    var okCount = 0;
                    var totalCount = this.$getDealCountByPriority(priority);
                    for (; queue.length > 0 && (totalCount === 0 || okCount < totalCount); okCount++) {
                        if (this.$dealCustomMessage(queue.shift()) === false) {
                            okCount--;
                        }
                    }
                    dealCount += okCount;
                }
                remainCount += queue.length;
            }
            if (remainCount === 0 && dealCount === 0 && this.$messages0.length === 0) {
                var queue = this.$queues[MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    this.$dealCustomMessage(queue.shift());
                    dealCount++;
                }
            }
        };
        MessageQueue.prototype.$dealTaskMessage = function (message) {
            var task = message.task;
            if (task.running === false) {
                task.running = true;
                if (task.run() === true) {
                    task.done = true;
                }
            }
            return task.done === true;
        };
        MessageQueue.prototype.$dealTriggerMessage = function (message, out) {
            if (message.timeout > System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            out.canceled = message.handler.run() === false;
            return true;
        };
        MessageQueue.prototype.$dealCustomMessage = function (message) {
            return message.handler.run() !== false;
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
                if (message.priority === MessagePriorityEnum.PRIORITY_TASK) {
                    this.$addTaskMessage(message);
                }
                else if (message.priority === MessagePriorityEnum.PRIORITY_TRIGGER) {
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
        MessageQueue.prototype.$addTaskMessage = function (message) {
            var index = -1;
            for (var i = 0; i < this.$tasks.length; i++) {
                var tasks = this.$tasks[i];
                if (tasks.length > 0 && tasks[0].groupId === message.groupId) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                this.$tasks.unshift([message]);
            }
            else {
                this.$tasks[index].push(message);
            }
        };
        MessageQueue.prototype.clearMessages = function () {
            while (this.$messages0.length > 0) {
                this.$cancelMessage(this.$messages0.shift());
            }
            for (var i = 0; i < this.$tasks.length; i++) {
                var tasks = this.$tasks[i];
                while (tasks.length > 0) {
                    this.$cancelMessage(tasks.shift());
                }
            }
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                var queue = this.$queues[priority];
                while (queue.length > 0) {
                    this.$cancelMessage(queue.shift());
                }
            }
        };
        MessageQueue.prototype.$cancelMessage = function (message) {
            if (message.priority === MessagePriorityEnum.PRIORITY_TASK) {
                message.task.done = true;
            }
        };
        MessageQueue.prototype.cancelTaskByGroupId = function (mod, groupId) {
            for (var id = 0; id < this.$tasks.length; id++) {
                var tasks = this.$tasks[id];
                if (tasks[0].groupId === groupId) {
                    while (tasks.length > 0) {
                        tasks.shift().task.done = true;
                    }
                    break;
                }
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
            if (mod === void 0 || mod === this.msgQMod) {
                while (true) {
                    if (mod === MsgQModEnum.NSL) {
                        msg = MsgQ.fetch(MsgQModEnum.NSL, 2);
                    }
                    else if (this.msgQMod === MsgQModEnum.NSL) {
                        msg = MsgQ.fetch(MsgQModEnum.NSL, 1);
                    }
                    else {
                        msg = MsgQ.fetch(this.msgQMod);
                    }
                    if (msg === null) {
                        break;
                    }
                    this.$dealMsgQMsg(msg);
                }
                MsgQ.seqId++;
            }
        };
        return MsgQService;
    }(BaseService));
    suncore.MsgQService = MsgQService;
    var MutexLocker = (function () {
        function MutexLocker() {
            this.$actMsgQMod = MsgQModEnum.NIL;
            this.$curMsgQMod = MsgQModEnum.NIL;
            this.$target = {};
            this.$snapshots = [];
        }
        MutexLocker.prototype.asserts = function (msgQMod, target) {
            if (msgQMod === MsgQModEnum.SYS) {
                return;
            }
            if (this.$curMsgQMod === MsgQModEnum.NIL || this.$curMsgQMod === MsgQModEnum.SYS) {
                return;
            }
            if (this.$curMsgQMod === MsgQModEnum.MMI) {
                if (msgQMod === MsgQModEnum.MMI || Mutex.mmiMsgQMap[msgQMod] === true) {
                    return;
                }
            }
            else if (this.$curMsgQMod === msgQMod) {
                return;
            }
            else if (msgQMod === MsgQModEnum.MMI && Mutex.mmiMsgQMap[this.$curMsgQMod] === true) {
                return;
            }
            if (target === null) {
                throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u4F20\u9012\u6D88\u606F\uFF0Csrc:" + suncore.MsgQModEnum[this.$curMsgQMod] + ", dest:" + suncore.MsgQModEnum[msgQMod]);
            }
            else {
                throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u76D1\u542C\u6D88\u606F\uFF0Csrc:" + suncore.MsgQModEnum[this.$curMsgQMod] + ", dest:" + suncore.MsgQModEnum[msgQMod]);
            }
        };
        MutexLocker.prototype.update = function (target) {
            this.$target = target;
            if (target instanceof puremvc.Notifier) {
                this.$actMsgQMod = target.msgQMod;
            }
            else {
                this.$actMsgQMod = MsgQModEnum.MMI;
            }
            var prefix = target[MutexLocker.MUTEX_PREFIX_KEY] || null;
            if (prefix === null) {
                this.$curMsgQMod = this.$actMsgQMod;
            }
            else {
                this.$curMsgQMod = Mutex.msgQMap[prefix];
            }
        };
        MutexLocker.prototype.lock = function (msgQMod) {
            var a = this.$target[MutexLocker.MUTEX_REFERENCE_SYS] || 0;
            var b = this.$target[MutexLocker.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexLocker.MUTEX_REFERENCE_ANY] || 0;
            if (msgQMod === MsgQModEnum.SYS) {
                a++;
            }
            else if (msgQMod === MsgQModEnum.MMI) {
                b++;
            }
            else {
                c++;
            }
            if (this.$curMsgQMod === MsgQModEnum.NIL || this.$curMsgQMod === MsgQModEnum.SYS) {
                this.$curMsgQMod = msgQMod;
            }
            else if (this.$curMsgQMod === MsgQModEnum.MMI && msgQMod !== MsgQModEnum.SYS) {
                this.$curMsgQMod = msgQMod;
            }
            this.$cache(a, b, c, false);
        };
        MutexLocker.prototype.unlock = function (msgQMod) {
            var a = this.$target[MutexLocker.MUTEX_REFERENCE_SYS] || 0;
            var b = this.$target[MutexLocker.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexLocker.MUTEX_REFERENCE_ANY] || 0;
            if (msgQMod === MsgQModEnum.SYS) {
                a--;
            }
            else if (msgQMod === MsgQModEnum.MMI) {
                b--;
            }
            else {
                c--;
            }
            if (a < 0 || b < 0 || c < 0) {
                throw Error("\u4E92\u65A5\u4F53\u91CA\u653E\u9519\u8BEF\uFF1ASYS[" + a + "], MMI[" + b + "], ANY[" + c + "]");
            }
            if (this.$curMsgQMod === this.$actMsgQMod) {
            }
            else if (c > 0) {
            }
            else if (b > 0) {
                this.$curMsgQMod = MsgQModEnum.MMI;
            }
            else if (a > 0) {
                this.$curMsgQMod = MsgQModEnum.SYS;
            }
            else {
                this.$curMsgQMod = this.$actMsgQMod;
            }
            this.$cache(a, b, c, true);
        };
        MutexLocker.prototype.active = function (msgQMod) {
            if (this.$actMsgQMod === MsgQModEnum.NIL) {
                this.$actMsgQMod = this.$curMsgQMod = msgQMod;
            }
        };
        MutexLocker.prototype.deactive = function () {
            var a = this.$target[MutexLocker.MUTEX_REFERENCE_SYS] || 0;
            var b = this.$target[MutexLocker.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexLocker.MUTEX_REFERENCE_ANY] || 0;
            if (a === 0 && b === 0 && c === 0) {
                this.$actMsgQMod = this.$curMsgQMod = MsgQModEnum.NIL;
            }
        };
        MutexLocker.prototype.$cache = function (a, b, c, d) {
            if (a > 0) {
                this.$target[MutexLocker.MUTEX_REFERENCE_SYS] = a;
            }
            else if (d === true && this.$target[MutexLocker.MUTEX_REFERENCE_SYS] > 0) {
                delete this.$target[MutexLocker.MUTEX_REFERENCE_SYS];
            }
            if (b > 0) {
                this.$target[MutexLocker.MUTEX_REFERENCE_MMI] = b;
            }
            else if (d === true && this.$target[MutexLocker.MUTEX_REFERENCE_MMI] > 0) {
                delete this.$target[MutexLocker.MUTEX_REFERENCE_MMI];
            }
            if (c > 0) {
                this.$target[MutexLocker.MUTEX_PREFIX_KEY] = Mutex.msgQCmd[this.$curMsgQMod];
                this.$target[MutexLocker.MUTEX_REFERENCE_ANY] = c;
            }
            else if (d === true && this.$target[MutexLocker.MUTEX_REFERENCE_ANY] > 0) {
                delete this.$target[MutexLocker.MUTEX_PREFIX_KEY];
                delete this.$target[MutexLocker.MUTEX_REFERENCE_ANY];
            }
        };
        MutexLocker.prototype.backup = function (target) {
            var msgQMod = null;
            if (target instanceof puremvc.Notifier) {
                msgQMod = target.msgQMod;
            }
            else {
                msgQMod = MsgQModEnum.MMI;
            }
            if (msgQMod !== this.$curMsgQMod) {
                var snapshot = {
                    data: this.$target,
                    actMsgQMod: this.$actMsgQMod,
                    curMsgQMod: this.$curMsgQMod
                };
                this.$snapshots.push(snapshot);
                this.$target = {};
                this.$actMsgQMod = this.$curMsgQMod = msgQMod;
            }
            else {
                this.$snapshots.push(null);
            }
        };
        MutexLocker.prototype.restore = function () {
            var snapshot = this.$snapshots.pop() || null;
            if (snapshot !== null) {
                this.$target = snapshot.data;
                this.$actMsgQMod = snapshot.actMsgQMod;
                this.$curMsgQMod = snapshot.curMsgQMod;
            }
        };
        Object.defineProperty(MutexLocker.prototype, "curMsgQMod", {
            get: function () {
                return this.$curMsgQMod;
            },
            enumerable: true,
            configurable: true
        });
        MutexLocker.MUTEX_PREFIX_KEY = "suncore$mutex$prefix";
        MutexLocker.MUTEX_REFERENCE_SYS = "suncore$mutex$reference$sys";
        MutexLocker.MUTEX_REFERENCE_MMI = "suncore$mutex$reference$mmi";
        MutexLocker.MUTEX_REFERENCE_ANY = "suncore$mutex$reference$any";
        return MutexLocker;
    }());
    suncore.MutexLocker = MutexLocker;
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
            if (stop === void 0) {
                throw Error("\u5E94\u5F53\u4E3A\u53C2\u6570 stop \u6307\u5B9A\u6709\u6548\u503C");
            }
            if (stop === true) {
                if (System.isModuleStopped(mod) === true) {
                    console.error("\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u7ECF\u505C\u6B62\uFF01\uFF01\uFF01");
                    return;
                }
            }
            else if (System.isModulePaused(mod) === true) {
                console.error("\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u7ECF\u6682\u505C\uFF01\uFF01\uFF01");
                return;
            }
            else if (mod === ModuleEnum.SYSTEM) {
                console.error("\u65E0\u6CD5\u6682\u505C " + ModuleEnum[mod] + " \u6A21\u5757\uFF01\uFF01\uFF01");
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
            if (pause === void 0) {
                throw Error("\u5E94\u5F53\u4E3A\u53C2\u6570 pause \u6307\u5B9A\u6709\u6548\u503C");
            }
            if (System.isModulePaused(mod) === false) {
                console.error("\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u7ECF\u542F\u52A8\uFF01\uFF01\uFF01");
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
            this.$paused = true;
            this.$stopped = stop;
        };
        Timeline.prototype.resume = function (paused) {
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
                    while (timers.length > 0) {
                        var timer = timers[0];
                        if (timer.active === true) {
                            if (timer.timeout > timestamp) {
                                break;
                            }
                            if (timer.real === true) {
                                timer.count++;
                            }
                            else {
                                timer.count = Math.floor((timestamp - timer.timestamp) / timer.delay);
                            }
                        }
                        if (timer.active === false || (timer.loops > 0 && timer.count >= timer.loops)) {
                            delete this.$timerMap[timer.timerId];
                        }
                        else {
                            this.addTimer(timer.mod, timer.delay, timer.method, timer.caller, timer.loops, timer.real, timer.timerId, timer.timestamp, timer.timeout, timer.count);
                        }
                        timers.shift();
                        if (timer.active === true) {
                            timer.method.call(timer.caller, timer.count, timer.loops);
                        }
                    }
                }
            }
        };
        TimerManager.prototype.addTimer = function (mod, delay, method, caller, loops, real, timerId, timestamp, timeout, count) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (timerId === void 0) { timerId = 0; }
            if (timestamp === void 0) { timestamp = -1; }
            if (timeout === void 0) { timeout = -1; }
            if (count === void 0) { count = 0; }
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
            var timer = {
                mod: mod,
                active: true,
                delay: delay,
                method: method,
                caller: caller,
                real: real,
                count: count,
                loops: loops,
                timerId: timerId,
                timestamp: timestamp,
                timeout: timeout
            };
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
        function send(dst, id, data) {
            if (isModuleActive(dst) === false) {
                console.warn("\u6D88\u606F\u53D1\u9001\u5931\u8D25\uFF0C\u6A21\u5757\u5DF1\u6682\u505C mod:" + MsgQModEnum[dst]);
                return;
            }
            if (check(dst, id) === false) {
                console.warn("\u6D88\u606F\u53D1\u9001\u5931\u8D25\uFF0C\u6D88\u606FID\u975E\u6CD5 mod:" + dst + ", id:" + id);
                return;
            }
            var array = $queues[dst] || null;
            if (array === null) {
                array = $queues[dst] = [];
            }
            var msg = {
                dst: dst,
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
                if (mod === MsgQModEnum.NSL || msg.seqId < MsgQ.seqId) {
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
            if (mod === MsgQModEnum.KAL) {
                min = MsgQIdEnum.KAL_MSG_ID_BEGIN;
                max = MsgQIdEnum.KAL_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.MMI) {
                min = MsgQIdEnum.MMI_MSG_ID_BEGIN;
                max = MsgQIdEnum.MMI_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.CUI) {
                min = MsgQIdEnum.CUI_MSG_ID_BEGIN;
                max = MsgQIdEnum.CUI_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.GUI) {
                min = MsgQIdEnum.GUI_MSG_ID_BEGIN;
                max = MsgQIdEnum.GUI_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.L4C) {
                min = MsgQIdEnum.L4C_MSG_ID_BEGIN;
                max = MsgQIdEnum.L4C_MSG_ID_END;
            }
            else if (mod === MsgQModEnum.NSL) {
                min = MsgQIdEnum.NSL_MSG_ID_BEGIN;
                max = MsgQIdEnum.NSL_MSG_ID_END;
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
            if (active === false) {
                delete $queues[mod];
            }
        }
        MsgQ.setModuleActive = setModuleActive;
    })(MsgQ = suncore.MsgQ || (suncore.MsgQ = {}));
    var Mutex;
    (function (Mutex) {
        Mutex.MMI_COMMAND_PREFIX = "MMI";
        Mutex.SYSTEM_COMMAND_PREFIX = "sun";
        var data = new MutexLocker();
        var locker = new MutexLocker();
        Mutex.checkPrefix = false;
        Mutex.msgQMap = { "sun": MsgQModEnum.SYS, "MMI": MsgQModEnum.MMI };
        Mutex.msgQCmd = {};
        Mutex.mmiMsgQMap = {};
        function getCommandPrefix(name) {
            if (name.substr(0, 3) === Mutex.SYSTEM_COMMAND_PREFIX) {
                return Mutex.SYSTEM_COMMAND_PREFIX;
            }
            var index = name.indexOf("_");
            if (index < 1) {
                throw Error("\u5FC5\u987B\u4E3A\u547D\u4EE4\u6307\u5B9A\u4E00\u4E2A\u6A21\u5757\u540D\uFF0C\u683C\u5F0F\u5982 MOD_" + name);
            }
            var prefix = name.substr(0, index);
            if (Mutex.msgQMap[prefix] === void 0) {
                throw Error("\u672A\u6CE8\u518C\u7684MsgQ\u6D88\u606F\u524D\u7F00\uFF1A" + prefix);
            }
            return prefix;
        }
        function enableMMIAction() {
            if (Mutex.checkPrefix === false) {
                return true;
            }
            if (data.curMsgQMod === MsgQModEnum.NIL || data.curMsgQMod === MsgQModEnum.SYS || data.curMsgQMod === MsgQModEnum.MMI) {
                return true;
            }
            return Mutex.mmiMsgQMap[data.curMsgQMod] === true;
        }
        Mutex.enableMMIAction = enableMMIAction;
        function active(msgQMod) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            data.active(msgQMod);
        }
        Mutex.active = active;
        function deactive() {
            if (Mutex.checkPrefix === false) {
                return;
            }
            data.deactive();
        }
        Mutex.deactive = deactive;
        function lock(name) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = Mutex.msgQMap[prefix];
            data.asserts(msgQMod, null);
            data.lock(msgQMod);
        }
        Mutex.lock = lock;
        function unlock(name) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = Mutex.msgQMap[prefix];
            data.asserts(msgQMod, null);
            data.unlock(msgQMod);
        }
        Mutex.unlock = unlock;
        function create(name, target) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = Mutex.msgQMap[prefix];
            locker.update(target);
            locker.lock(msgQMod);
        }
        Mutex.create = create;
        function release(name, target) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = Mutex.msgQMap[prefix];
            locker.update(target);
            locker.unlock(msgQMod);
        }
        Mutex.release = release;
        function backup(target) {
            if (Mutex.checkPrefix === true) {
                data.backup(target);
            }
        }
        Mutex.backup = backup;
        function restore() {
            if (Mutex.checkPrefix === true) {
                data.restore();
            }
        }
        Mutex.restore = restore;
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
            if (isModuleStopped(ModuleEnum.SYSTEM) === false) {
                return M.engine.getDelta();
            }
            else {
                console.error("\u5C1D\u8BD5\u83B7\u53D6\u5E27\u65F6\u95F4\u95F4\u9694\uFF0C\u4F46\u7CFB\u7EDF\u6A21\u5757\u5DF1\u505C\u6B62\uFF01\uFF01\uFF01");
            }
        }
        System.getDelta = getDelta;
        function getModuleTimestamp(mod) {
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
                console.error("\u5C1D\u8BD5\u83B7\u53D6\u65F6\u95F4\u6233\uFF0C\u4F46\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u505C\u6B62\uFF01\uFF01\uFF01");
            }
        }
        System.getModuleTimestamp = getModuleTimestamp;
        function addTask(mod, groupId, task) {
            if (System.isModuleStopped(mod) === false) {
                var message = {
                    mod: mod,
                    task: task,
                    groupId: groupId,
                    priority: MessagePriorityEnum.PRIORITY_TASK
                };
                M.messageManager.putMessage(message);
            }
            else {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u4EFB\u52A1\uFF0C\u4F46\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u505C\u6B62\uFF01\uFF01\uFF01");
            }
        }
        System.addTask = addTask;
        function cancelTaskByGroupId(mod, groupId) {
            M.messageManager.cancelTaskByGroupId(mod, groupId);
        }
        System.cancelTaskByGroupId = cancelTaskByGroupId;
        function addTrigger(mod, delay, handler) {
            if (System.isModuleStopped(mod) === false) {
                var message = {
                    mod: mod,
                    handler: handler,
                    timeout: System.getModuleTimestamp(mod) + delay,
                    priority: MessagePriorityEnum.PRIORITY_TRIGGER
                };
                M.messageManager.putMessage(message);
            }
            else {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u89E6\u53D1\u5668\uFF0C\u4F46\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u505C\u6B62\uFF01\uFF01\uFF01");
            }
        }
        System.addTrigger = addTrigger;
        function addMessage(mod, priority, handler) {
            if (System.isModuleStopped(mod) === false) {
                var message = {
                    mod: mod,
                    handler: handler,
                    priority: priority
                };
                M.messageManager.putMessage(message);
            }
            else {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0Message\u6D88\u606F\uFF0C\u4F46\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u505C\u6B62\uFF01\uFF01\uFF01");
            }
        }
        System.addMessage = addMessage;
        function addTimer(mod, delay, method, caller, loops, real) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (System.isModuleStopped(mod) === false) {
                return M.timerManager.addTimer(mod, delay, method, caller, loops, real);
            }
            else {
                console.error("\u5C1D\u8BD5\u6DFB\u52A0\u5B9A\u65F6\u5668\uFF0C\u4F46\u6A21\u5757 " + ModuleEnum[mod] + " \u5DF1\u505C\u6B62\uFF01\uFF01\uFF01");
            }
        }
        System.addTimer = addTimer;
        function removeTimer(timerId) {
            return M.timerManager.removeTimer(timerId);
        }
        System.removeTimer = removeTimer;
    })(System = suncore.System || (suncore.System = {}));
})(suncore || (suncore = {}));
