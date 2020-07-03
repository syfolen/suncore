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
var puremvc;
(function (puremvc) {
    var CareModuleID;
    (function (CareModuleID) {
        CareModuleID[CareModuleID["NONE"] = 65536] = "NONE";
        CareModuleID[CareModuleID["CUSTOM"] = 131072] = "CUSTOM";
        CareModuleID[CareModuleID["TIMELINE"] = 196608] = "TIMELINE";
    })(CareModuleID = puremvc.CareModuleID || (puremvc.CareModuleID = {}));
    var Controller = (function () {
        function Controller() {
            this.$commands = {};
            if (Controller.inst !== null) {
                throw Error(Controller.SINGLETON_MSG);
            }
            Controller.inst = this;
        }
        Controller.prototype.executeCommand = function (name, args) {
            var cls = this.$commands[name];
            var command = new cls();
            if (args === void 0) {
                command.execute.call(command);
            }
            else if (args instanceof Array) {
                command.execute.apply(command, args);
            }
            else {
                command.execute.call(command, args);
            }
        };
        Controller.prototype.registerCommand = function (name, cls, priority, option) {
            if (name === void 0) {
                throw Error("注册无效的命令");
            }
            if (this.hasCommand(name) === true) {
                throw Error("重复注册命令：" + name);
            }
            this.$commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this, false, priority, option);
        };
        Controller.prototype.removeCommand = function (name) {
            if (this.hasCommand(name) === false) {
                throw Error("移除不存在的命令：" + name);
            }
            delete this.$commands[name];
            View.inst.removeObserver(name, this.executeCommand, this);
        };
        Controller.prototype.retrieveCommand = function (name) {
            return this.$commands[name] || null;
        };
        Controller.prototype.hasCommand = function (name) {
            return this.retrieveCommand(name) != null;
        };
        Controller.SINGLETON_MSG = "Controller singleton already constructed!";
        Controller.inst = null;
        return Controller;
    }());
    puremvc.Controller = Controller;
    var Facade = (function () {
        function Facade() {
            this.$view = new View();
            this.$model = new Model();
            this.$controller = new Controller();
            if (Facade.inst !== null) {
                throw Error(Facade.SINGLETON_MSG);
            }
            Facade.inst = this;
            this.$initializeFacade();
        }
        Facade.getInstance = function () {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        };
        Facade.prototype.$initializeFacade = function () {
            this.$initMsgQ();
            this.$initializeModel();
            this.$initializeView();
            this.$initializeController();
        };
        Facade.prototype.$initMsgQ = function () {
            MutexLocker.scope = new MutexScope();
            MutexLocker.locker = new MutexScope();
            MutexLocker.msgQMap["sun"] = suncore.MsgQModEnum.KAL;
            MutexLocker.msgQMap["MMI"] = suncore.MsgQModEnum.MMI;
        };
        Facade.prototype.$initializeModel = function () {
        };
        Facade.prototype.$initializeView = function () {
        };
        Facade.prototype.$initializeController = function () {
        };
        Facade.prototype.$regMMICmd = function (msgQMod, prefix) {
            this.$regMsgQCmd(msgQMod, prefix);
            MutexLocker.mmiMsgQMap[msgQMod] = true;
        };
        Facade.prototype.$regMsgQCmd = function (msgQMod, prefix) {
            MutexLocker.checkPrefix = true;
            MutexLocker.msgQMap[prefix] = msgQMod;
            MutexLocker.msgQCmd[msgQMod] = prefix;
        };
        Facade.prototype.$setCareStatForCmd = function (cmd) {
            this.$view.setCareStatForCmd(cmd);
        };
        Facade.prototype.registerObserver = function (name, method, caller, receiveOnce, priority, option) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            var observer = this.$view.registerObserver(name, method, caller, receiveOnce, priority, option);
            MutexLocker.deactive();
            return observer;
        };
        Facade.prototype.removeObserver = function (name, method, caller) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.removeObserver(name, method, caller);
            MutexLocker.deactive();
        };
        Facade.prototype.hasObserver = function (name, method, caller) {
            MutexLocker.deactive();
            return this.$view.hasObserver(name, method, caller);
        };
        Facade.prototype.registerCommand = function (name, cls, priority, option) {
            MutexLocker.deactive();
            this.$controller.registerCommand(name, cls, priority, option);
        };
        Facade.prototype.removeCommand = function (name) {
            MutexLocker.deactive();
            this.$controller.removeCommand(name);
        };
        Facade.prototype.hasCommand = function (name) {
            MutexLocker.deactive();
            return this.$controller.hasCommand(name);
        };
        Facade.prototype.registerProxy = function (proxy) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$model.registerProxy(proxy);
            MutexLocker.deactive();
        };
        Facade.prototype.removeProxy = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$model.removeProxy(name);
            MutexLocker.deactive();
        };
        Facade.prototype.retrieveProxy = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            var proxy = this.$model.retrieveProxy(name);
            MutexLocker.deactive();
            return proxy;
        };
        Facade.prototype.hasProxy = function (name) {
            MutexLocker.deactive();
            return this.$model.hasProxy(name);
        };
        Facade.prototype.registerMediator = function (mediator) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.registerMediator(mediator);
            MutexLocker.deactive();
        };
        Facade.prototype.removeMediator = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.removeMediator(name);
            MutexLocker.deactive();
        };
        Facade.prototype.retrieveMediator = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            var mediator = this.$view.retrieveMediator(name);
            MutexLocker.deactive();
            return mediator;
        };
        Facade.prototype.hasMediator = function (name) {
            MutexLocker.deactive();
            return this.$view.hasMediator(name);
        };
        Facade.prototype.sendNotification = function (name, args, cancelable, sys) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$view.notifyObservers(name, args, cancelable, sys);
            MutexLocker.deactive();
        };
        Facade.prototype.notifyCancel = function () {
            MutexLocker.deactive();
            this.$view.notifyCancel();
        };
        Facade.SINGLETON_MSG = "Facade singleton already constructed!";
        Facade.inst = null;
        return Facade;
    }());
    puremvc.Facade = Facade;
    var Model = (function () {
        function Model() {
            this.$proxies = {};
            if (Model.inst !== null) {
                throw Error(Model.SINGLETON_MSG);
            }
            Model.inst = this;
        }
        Model.prototype.registerProxy = function (proxy) {
            var name = proxy.getProxyName();
            if (name === null) {
                throw Error("注册无效的Proxy");
            }
            if (this.hasProxy(name) === true) {
                throw Error("重复注册Proxy：" + name);
            }
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        };
        Model.prototype.removeProxy = function (name) {
            if (name === void 0) {
                throw Error("移除无效的Proxy");
            }
            var proxy = this.retrieveProxy(name);
            if (proxy === null) {
                throw Error("重复移除Proxy：" + name);
            }
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            delete this.$proxies[name];
            proxy.onRemove();
        };
        Model.prototype.retrieveProxy = function (name) {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            return this.$proxies[name] || null;
        };
        Model.prototype.hasProxy = function (name) {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            return this.retrieveProxy(name) != null;
        };
        Model.SINGLETON_MSG = "Model singleton already constructed!";
        Model.inst = null;
        return Model;
    }());
    puremvc.Model = Model;
    var MutexScope = (function () {
        function MutexScope() {
            this.$actMsgQMod = suncore.MsgQModEnum.NIL;
            this.$curMsgQMod = suncore.MsgQModEnum.NIL;
            this.$target = {};
            this.$snapshots = [];
        }
        MutexScope.prototype.asserts = function (msgQMod, target) {
            if (msgQMod === suncore.MsgQModEnum.KAL) {
                return;
            }
            if (this.$curMsgQMod === suncore.MsgQModEnum.NIL || this.$curMsgQMod === suncore.MsgQModEnum.KAL) {
                return;
            }
            if (this.$curMsgQMod === suncore.MsgQModEnum.MMI) {
                if (msgQMod === suncore.MsgQModEnum.MMI || MutexLocker.mmiMsgQMap[msgQMod] === true) {
                    return;
                }
            }
            else if (this.$curMsgQMod === msgQMod) {
                return;
            }
            else if (msgQMod === suncore.MsgQModEnum.MMI && MutexLocker.mmiMsgQMap[this.$curMsgQMod] === true) {
                return;
            }
            if (target === null) {
                throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u4F20\u9012\u6D88\u606F\uFF0Csrc:" + suncore.MsgQModEnum[this.$curMsgQMod] + ", dest:" + suncore.MsgQModEnum[msgQMod]);
            }
            else {
                throw Error("\u7981\u6B62\u8DE8\u6A21\u5757\u76D1\u542C\u6D88\u606F\uFF0Csrc:" + suncore.MsgQModEnum[this.$curMsgQMod] + ", dest:" + suncore.MsgQModEnum[msgQMod]);
            }
        };
        MutexScope.prototype.update = function (target) {
            this.$target = target;
            if (target instanceof puremvc.Notifier) {
                this.$actMsgQMod = target.msgQMod;
            }
            else {
                this.$actMsgQMod = suncore.MsgQModEnum.MMI;
            }
            var prefix = target[MutexScope.MUTEX_PREFIX_KEY] || null;
            if (prefix === null) {
                this.$curMsgQMod = this.$actMsgQMod;
            }
            else {
                this.$curMsgQMod = MutexLocker.msgQMap[prefix];
            }
        };
        MutexScope.prototype.lock = function (msgQMod) {
            var a = this.$target[MutexScope.MUTEX_REFERENCE_KAL] || 0;
            var b = this.$target[MutexScope.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexScope.MUTEX_REFERENCE_ANY] || 0;
            if (msgQMod === suncore.MsgQModEnum.KAL) {
                a++;
            }
            else if (msgQMod === suncore.MsgQModEnum.MMI) {
                b++;
            }
            else {
                c++;
            }
            if (this.$curMsgQMod === suncore.MsgQModEnum.NIL || this.$curMsgQMod === suncore.MsgQModEnum.KAL) {
                this.$curMsgQMod = msgQMod;
            }
            else if (this.$curMsgQMod === suncore.MsgQModEnum.MMI && msgQMod !== suncore.MsgQModEnum.KAL) {
                this.$curMsgQMod = msgQMod;
            }
            this.$cache(a, b, c, false);
        };
        MutexScope.prototype.unlock = function (msgQMod) {
            var a = this.$target[MutexScope.MUTEX_REFERENCE_KAL] || 0;
            var b = this.$target[MutexScope.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexScope.MUTEX_REFERENCE_ANY] || 0;
            if (msgQMod === suncore.MsgQModEnum.KAL) {
                a--;
            }
            else if (msgQMod === suncore.MsgQModEnum.MMI) {
                b--;
            }
            else {
                c--;
            }
            if (a < 0 || b < 0 || c < 0) {
                throw Error("\u4E92\u65A5\u4F53\u91CA\u653E\u9519\u8BEF\uFF1AKAL[" + a + "], MMI[" + b + "], ANY[" + c + "]");
            }
            if (this.$curMsgQMod === this.$actMsgQMod) {
            }
            else if (c > 0) {
            }
            else if (b > 0) {
                this.$curMsgQMod = suncore.MsgQModEnum.MMI;
            }
            else if (a > 0) {
                this.$curMsgQMod = suncore.MsgQModEnum.KAL;
            }
            else {
                this.$curMsgQMod = this.$actMsgQMod;
            }
            this.$cache(a, b, c, true);
        };
        MutexScope.prototype.active = function (msgQMod) {
            if (this.$actMsgQMod === suncore.MsgQModEnum.NIL) {
                this.$actMsgQMod = this.$curMsgQMod = msgQMod;
            }
        };
        MutexScope.prototype.deactive = function () {
            var a = this.$target[MutexScope.MUTEX_REFERENCE_KAL] || 0;
            var b = this.$target[MutexScope.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexScope.MUTEX_REFERENCE_ANY] || 0;
            if (a === 0 && b === 0 && c === 0) {
                this.$actMsgQMod = this.$curMsgQMod = suncore.MsgQModEnum.NIL;
            }
        };
        MutexScope.prototype.$cache = function (a, b, c, d) {
            if (a > 0) {
                this.$target[MutexScope.MUTEX_REFERENCE_KAL] = a;
            }
            else if (d === true && this.$target[MutexScope.MUTEX_REFERENCE_KAL] > 0) {
                delete this.$target[MutexScope.MUTEX_REFERENCE_KAL];
            }
            if (b > 0) {
                this.$target[MutexScope.MUTEX_REFERENCE_MMI] = b;
            }
            else if (d === true && this.$target[MutexScope.MUTEX_REFERENCE_MMI] > 0) {
                delete this.$target[MutexScope.MUTEX_REFERENCE_MMI];
            }
            if (c > 0) {
                this.$target[MutexScope.MUTEX_PREFIX_KEY] = MutexLocker.msgQCmd[this.$curMsgQMod];
                this.$target[MutexScope.MUTEX_REFERENCE_ANY] = c;
            }
            else if (d === true && this.$target[MutexScope.MUTEX_REFERENCE_ANY] > 0) {
                delete this.$target[MutexScope.MUTEX_PREFIX_KEY];
                delete this.$target[MutexScope.MUTEX_REFERENCE_ANY];
            }
        };
        MutexScope.prototype.backup = function (target) {
            var msgQMod = null;
            if (target instanceof puremvc.Notifier) {
                msgQMod = target.msgQMod;
            }
            else {
                msgQMod = suncore.MsgQModEnum.MMI;
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
        MutexScope.prototype.restore = function () {
            var snapshot = this.$snapshots.pop() || null;
            if (snapshot !== null) {
                this.$target = snapshot.data;
                this.$actMsgQMod = snapshot.actMsgQMod;
                this.$curMsgQMod = snapshot.curMsgQMod;
            }
        };
        Object.defineProperty(MutexScope.prototype, "curMsgQMod", {
            get: function () {
                return this.$curMsgQMod;
            },
            enumerable: true,
            configurable: true
        });
        MutexScope.MUTEX_PREFIX_KEY = "puremvc$mutex$prefix";
        MutexScope.MUTEX_REFERENCE_KAL = "puremvc$mutex$reference$kal";
        MutexScope.MUTEX_REFERENCE_MMI = "puremvc$mutex$reference$mmi";
        MutexScope.MUTEX_REFERENCE_ANY = "puremvc$mutex$reference$any";
        return MutexScope;
    }());
    puremvc.MutexScope = MutexScope;
    var Notifier = (function () {
        function Notifier(msgQMod) {
            this.$msgQMod = suncore.MsgQModEnum.MMI;
            this.$facade = Facade.getInstance();
            this.$destroyed = false;
            if (msgQMod !== void 0) {
                this.$msgQMod = msgQMod;
            }
        }
        Notifier.prototype.destroy = function () {
            this.$destroyed = true;
        };
        Object.defineProperty(Notifier.prototype, "facade", {
            get: function () {
                MutexLocker.active(this.$msgQMod);
                return this.$facade;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Notifier.prototype, "msgQMod", {
            get: function () {
                return this.$msgQMod;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Notifier.prototype, "destroyed", {
            get: function () {
                return this.$destroyed;
            },
            enumerable: true,
            configurable: true
        });
        return Notifier;
    }());
    puremvc.Notifier = Notifier;
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(name, data) {
            var _this = _super.call(this) || this;
            if (name === void 0) {
                throw Error("无效的Proxy名字");
            }
            _this.$proxyName = name;
            if (data !== void 0) {
                _this.$data = data;
            }
            return _this;
        }
        Proxy.prototype.onRegister = function () {
        };
        Proxy.prototype.onRemove = function () {
        };
        Proxy.prototype.getProxyName = function () {
            return this.$proxyName || null;
        };
        return Proxy;
    }(Notifier));
    puremvc.Proxy = Proxy;
    var SimpleCommand = (function (_super) {
        __extends(SimpleCommand, _super);
        function SimpleCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SimpleCommand;
    }(Notifier));
    puremvc.SimpleCommand = SimpleCommand;
    var View = (function () {
        function View() {
            this.$mediators = {};
            this.$observers = {};
            this.$isCanceled = false;
            this.$onceObservers = [];
            this.$scModStatMap = {};
            this.$careStatCmds = {};
            if (View.inst !== null) {
                throw Error(View.SINGLETON_MSG);
            }
            View.inst = this;
            this.registerObserver(suncore.NotifyKey.START_TIMELINE, this.$onStartTimeline, this);
            this.registerObserver(suncore.NotifyKey.PAUSE_TIMELINE, this.$onPauseTimeline, this);
        }
        View.prototype.$onStartTimeline = function (mod, pause) {
            if (pause === false) {
                this.$scModStatMap[mod] = true;
            }
            else {
                this.$scModStatMap[mod] = false;
            }
        };
        View.prototype.$onPauseTimeline = function (mod, stop) {
            this.$scModStatMap[mod] = false;
        };
        View.prototype.setCareStatForCmd = function (cmd) {
            this.$careStatCmds[cmd] = true;
        };
        View.prototype.registerObserver = function (name, method, caller, receiveOnce, priority, option) {
            if (caller === void 0) { caller = null; }
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = suncom.EventPriorityEnum.MID; }
            if (option === void 0) { option = 1; }
            if (name === void 0) {
                throw Error("注册无效的监听");
            }
            if (method === void 0) {
                throw Error("注册无效的监听回调");
            }
            if (caller && caller.destroyed === true) {
                throw Error("对象己销毁");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                observers = this.$observers[name] = [false];
            }
            else if (observers[0] === true) {
                observers = this.$observers[name] = observers.concat();
                observers[0] = false;
            }
            var index = -1;
            for (var i = 1; i < observers.length; i++) {
                var observer_1 = observers[i];
                if (observer_1.method === method && observer_1.caller === caller) {
                    return null;
                }
                if (index === -1 && observer_1.priority < priority) {
                    index = i;
                }
            }
            MutexLocker.create(name, caller);
            option = this.$createOption(option);
            if (option.delay === void 0) {
                option.delay = 1;
            }
            suncom.Test.expect(option.delay).toBeGreaterThan(0);
            option.counter = 0;
            var observer = {
                name: name,
                method: method,
                caller: caller,
                option: option,
                priority: priority,
                receiveOnce: receiveOnce
            };
            if (index < 0) {
                observers.push(observer);
            }
            else {
                observers.splice(index, 0, observer);
            }
            return observer;
        };
        View.prototype.$createOption = function (data) {
            if (typeof data === "number") {
                if (data < CareModuleID.NONE) {
                    return {
                        delay: data
                    };
                }
                else {
                    if (data === CareModuleID.CUSTOM) {
                        return {
                            careStatMod: suncore.ModuleEnum.CUSTOM
                        };
                    }
                    else if (data === CareModuleID.TIMELINE) {
                        return {
                            careStatMod: suncore.ModuleEnum.TIMELINE
                        };
                    }
                }
            }
            else if (data instanceof Array) {
                return {
                    args: data
                };
            }
            else {
                return data;
            }
        };
        View.prototype.removeObserver = function (name, method, caller) {
            if (caller === void 0) { caller = null; }
            if (name === void 0) {
                throw Error("移除无效的监听");
            }
            if (method === void 0) {
                throw Error("移除无效的监听回调");
            }
            var observers = this.$observers[name] || null;
            if (observers === null || observers.length === 1) {
                return;
            }
            if (observers[0] === true) {
                observers = this.$observers[name] = observers.concat();
                observers[0] = false;
            }
            for (var i = 1; i < observers.length; i++) {
                var observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    observers.splice(i, 1);
                    MutexLocker.release(name, caller);
                    break;
                }
            }
            if (observers.length === 1) {
                delete this.$observers[name];
            }
        };
        View.prototype.hasObserver = function (name, method, caller) {
            if (caller === void 0) { caller = null; }
            if (name === void 0) {
                throw Error("查询无效的监听");
            }
            if (method === void 0) {
                throw Error("查询无效的监听回调");
            }
            if (method === null && caller === null) {
                throw Error("method\u548Ccaller\u4E0D\u5141\u8BB8\u540C\u65F6\u4E3A\u7A7A");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return false;
            }
            for (var i = 1; i < observers.length; i++) {
                var observer = observers[i];
                if (method === null) {
                    if (observer.caller === caller) {
                        return true;
                    }
                }
                else if (caller === null) {
                    if (observer.method === method) {
                        return true;
                    }
                }
                else if (observer.method === method && observer.caller === caller) {
                    return true;
                }
            }
            return false;
        };
        View.prototype.notifyCancel = function () {
            this.$isCanceled = true;
        };
        View.prototype.notifyObservers = function (name, args, cancelable, sys) {
            if (cancelable === void 0) { cancelable = false; }
            if (sys === void 0) { sys = true; }
            if (name === void 0) {
                throw Error("派发无效的通知");
            }
            var observers = this.$observers[name] || null;
            if (observers === null || observers.length === 1) {
                return;
            }
            observers[0] = true;
            MutexLocker.lock(name);
            var isCanceled = this.$isCanceled;
            this.$isCanceled = false;
            for (var i = 1; i < observers.length; i++) {
                var observer = observers[i];
                var option = observer.option;
                if (this.$careStatCmds[name] === true && sys === true) {
                    if (option.careStatMod !== void 0 && this.$scModStatMap[option.careStatMod] === false) {
                        continue;
                    }
                }
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
                }
                if (observer.caller && observer.caller.destroyed === true) {
                    if (suncom && suncom["Common"]) {
                        console.warn("\u5BF9\u8C61[" + suncom["Common"].getQualifiedClassName(observer.caller) + "]\u5DF1\u9500\u6BC1\uFF0C\u672A\u80FD\u54CD\u5E94" + name + "\u4E8B\u4EF6\u3002");
                    }
                    else {
                        console.warn("\u5BF9\u8C61\u5DF1\u9500\u6BC1\uFF0C\u672A\u80FD\u54CD\u5E94" + name + "\u4E8B\u4EF6\u3002");
                    }
                    continue;
                }
                option.counter++;
                if (option.counter < option.delay) {
                    continue;
                }
                option.counter = 0;
                if (option.args !== void 0) {
                    args = option.args.concat(args);
                }
                if (observer.caller === Controller.inst) {
                    observer.method.call(observer.caller, name, args);
                }
                else if (args === void 0) {
                    observer.method.call(observer.caller);
                }
                else if (args instanceof Array) {
                    observer.method.apply(observer.caller, args);
                }
                else {
                    observer.method.call(observer.caller, args);
                }
                if (cancelable === true && this.$isCanceled) {
                    break;
                }
            }
            this.$isCanceled = isCanceled;
            observers[0] = false;
            MutexLocker.unlock(name);
            while (this.$onceObservers.length > 0) {
                var observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        View.prototype.registerMediator = function (mediator) {
            var name = mediator.getMediatorName();
            if (name === null) {
                throw Error("注册无效的Mediator");
            }
            if (this.hasMediator(name) === true) {
                throw Error("重复注册Mediator " + name);
            }
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        };
        View.prototype.removeMediator = function (name) {
            if (name === void 0) {
                throw Error("移除无效的Mediator");
            }
            var mediator = this.retrieveMediator(name);
            if (mediator === null) {
                throw Error("移除不存在的Mediator " + name);
            }
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        };
        View.prototype.retrieveMediator = function (name) {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            return this.$mediators[name] || null;
        };
        View.prototype.hasMediator = function (name) {
            if (MutexLocker.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            return this.retrieveMediator(name) != null;
        };
        View.SINGLETON_MSG = "View singleton already constructed!";
        View.inst = null;
        return View;
    }());
    puremvc.View = View;
    var MacroCommand = (function (_super) {
        __extends(MacroCommand, _super);
        function MacroCommand() {
            var _this = _super.call(this) || this;
            _this.$commands = [];
            _this.$initializeMacroCommand();
            return _this;
        }
        MacroCommand.prototype.$addSubCommand = function (cls) {
            this.$commands.push(cls);
        };
        MacroCommand.prototype.execute = function () {
            for (var i = 0; i < this.$commands.length; i++) {
                var cls = this.$commands[i];
                var command = new cls();
                command.execute.apply(command, arguments);
            }
        };
        return MacroCommand;
    }(Notifier));
    puremvc.MacroCommand = MacroCommand;
    var Mediator = (function (_super) {
        __extends(Mediator, _super);
        function Mediator(name, viewComponent) {
            var _this = _super.call(this) || this;
            _this.$notificationInterests = [];
            if (name === void 0) {
                throw Error("无效的Mediator名字");
            }
            _this.$mediatorName = name || null;
            _this.$viewComponent = viewComponent || null;
            return _this;
        }
        Mediator.prototype.onRegister = function () {
        };
        Mediator.prototype.onRemove = function () {
        };
        Mediator.prototype.getMediatorName = function () {
            return this.$mediatorName;
        };
        Mediator.prototype.getViewComponent = function () {
            return this.$viewComponent;
        };
        Mediator.prototype.setViewComponent = function (view) {
            this.$viewComponent = view || null;
        };
        Mediator.prototype.listNotificationInterests = function () {
        };
        Mediator.prototype.removeNotificationInterests = function () {
            for (var i = 0; i < this.$notificationInterests.length; i++) {
                var observer = this.$notificationInterests[i];
                this.facade.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        Mediator.prototype.$handleNotification = function (name, method, priority, option) {
            if (priority === void 0) { priority = suncom.EventPriorityEnum.MID; }
            var observer = this.facade.registerObserver(name, method, this, void 0, priority, option);
            observer && this.$notificationInterests.push(observer);
        };
        return Mediator;
    }(Notifier));
    puremvc.Mediator = Mediator;
    var MutexLocker;
    (function (MutexLocker) {
        MutexLocker.MMI_COMMAND_PREFIX = "MMI";
        MutexLocker.KERNEL_COMMAND_PREFIX = "sun";
        MutexLocker.scope = null;
        MutexLocker.locker = null;
        MutexLocker.checkPrefix = false;
        MutexLocker.msgQMap = {};
        MutexLocker.msgQCmd = {};
        MutexLocker.mmiMsgQMap = {};
        function getCommandPrefix(name) {
            if (name.substr(0, 3) === MutexLocker.KERNEL_COMMAND_PREFIX) {
                return MutexLocker.KERNEL_COMMAND_PREFIX;
            }
            var index = name.indexOf("_");
            if (index < 1) {
                throw Error("\u5FC5\u987B\u4E3A\u547D\u4EE4\u6307\u5B9A\u4E00\u4E2A\u6A21\u5757\u540D\uFF0C\u683C\u5F0F\u5982 MOD_" + name);
            }
            var prefix = name.substr(0, index);
            if (MutexLocker.msgQMap[prefix] === void 0) {
                throw Error("\u672A\u6CE8\u518C\u7684MsgQ\u6D88\u606F\u524D\u7F00\uFF1A" + prefix);
            }
            return prefix;
        }
        function enableMMIAction() {
            if (MutexLocker.checkPrefix === false) {
                return true;
            }
            if (MutexLocker.scope.curMsgQMod === suncore.MsgQModEnum.NIL || MutexLocker.scope.curMsgQMod === suncore.MsgQModEnum.KAL || MutexLocker.scope.curMsgQMod === suncore.MsgQModEnum.MMI) {
                return true;
            }
            return MutexLocker.mmiMsgQMap[MutexLocker.scope.curMsgQMod] === true;
        }
        MutexLocker.enableMMIAction = enableMMIAction;
        function active(msgQMod) {
            if (MutexLocker.checkPrefix === true) {
                MutexLocker.scope.active(msgQMod);
            }
        }
        MutexLocker.active = active;
        function deactive() {
            if (MutexLocker.checkPrefix === true) {
                MutexLocker.scope.deactive();
            }
        }
        MutexLocker.deactive = deactive;
        function lock(name) {
            if (MutexLocker.checkPrefix === false) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = MutexLocker.msgQMap[prefix];
            MutexLocker.scope.asserts(msgQMod, null);
            MutexLocker.scope.lock(msgQMod);
        }
        MutexLocker.lock = lock;
        function unlock(name) {
            if (MutexLocker.checkPrefix === false) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = MutexLocker.msgQMap[prefix];
            MutexLocker.scope.asserts(msgQMod, null);
            MutexLocker.scope.unlock(msgQMod);
        }
        MutexLocker.unlock = unlock;
        function create(name, target) {
            if (MutexLocker.checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = MutexLocker.msgQMap[prefix];
            MutexLocker.locker.update(target);
            MutexLocker.locker.asserts(msgQMod, target);
            MutexLocker.locker.lock(msgQMod);
        }
        MutexLocker.create = create;
        function release(name, target) {
            if (MutexLocker.checkPrefix === false) {
                return;
            }
            if (target === null || target === puremvc.Controller.inst || target === puremvc.View.inst) {
                return;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = MutexLocker.msgQMap[prefix];
            MutexLocker.locker.update(target);
            MutexLocker.locker.asserts(msgQMod, target);
            MutexLocker.locker.unlock(msgQMod);
        }
        MutexLocker.release = release;
        function backup(target) {
            if (MutexLocker.checkPrefix === true) {
                MutexLocker.scope.backup(target);
            }
        }
        MutexLocker.backup = backup;
        function restore() {
            if (MutexLocker.checkPrefix === true) {
                MutexLocker.scope.restore();
            }
        }
        MutexLocker.restore = restore;
    })(MutexLocker = puremvc.MutexLocker || (puremvc.MutexLocker = {}));
})(puremvc || (puremvc = {}));
