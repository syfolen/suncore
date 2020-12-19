var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
    var Controller = (function () {
        function Controller() {
            this.$commands = {};
            if (Controller.inst !== null) {
                throw Error("\u91CD\u590D\u6784\u5EFA\u63A7\u5236\u7C7B\uFF01\uFF01\uFF01");
            }
            Controller.inst = this;
        }
        Controller.prototype.executeCommand = function (name, data) {
            var cmd = new this.$commands[name]();
            if (data instanceof Array) {
                cmd.execute.apply(cmd, data);
            }
            else {
                cmd.execute.call(cmd, data);
            }
        };
        Controller.prototype.registerCommand = function (name, cls, priority, args) {
            if (this.hasCommand(name) === true) {
                throw Error("\u91CD\u590D\u6CE8\u518C\u547D\u4EE4\uFF1A" + name);
            }
            this.$commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this, false, priority, args);
        };
        Controller.prototype.removeCommand = function (name) {
            if (this.hasCommand(name) === false) {
                throw Error("\u79FB\u9664\u4E0D\u5B58\u5728\u7684\u547D\u4EE4\uFF1A" + name);
            }
            delete this.$commands[name];
            View.inst.removeObserver(name, this.executeCommand, this);
        };
        Controller.prototype.hasCommand = function (name) {
            return this.$commands[name] !== void 0;
        };
        Controller.inst = null;
        return Controller;
    }());
    puremvc.Controller = Controller;
    var Facade = (function () {
        function Facade() {
            this.$var_view = new View();
            this.$var_model = new Model();
            this.$var_controller = new Controller();
            if (Facade.inst !== null) {
                throw Error("\u91CD\u590D\u6784\u5EFAPureMVC\u5916\u89C2\u7C7B\uFF01\uFF01\uFF01");
            }
            Facade.inst = this;
            this.$func_initializeFacade();
        }
        Facade.getInstance = function () {
            if (Facade.inst === null) {
                Facade.inst = new Facade();
            }
            return Facade.inst;
        };
        Facade.prototype.$func_initializeFacade = function () {
            this.$initMsgQ();
            this.$initializeModel();
            this.$initializeController();
            this.$initializeView();
        };
        Facade.prototype.$initMsgQ = function () {
            MutexLocker.scope = new MutexScope();
            MutexLocker.locker = new MutexScope();
            MutexLocker.msgQMap["sun"] = suncore.MsgQModEnum.E_KAL;
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
        Facade.prototype.registerObserver = function (name, method, caller, receiveOnce, priority, args) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            var observer = this.$var_view.registerObserver(name, method, caller, receiveOnce, priority, args);
            MutexLocker.deactive();
        };
        Facade.prototype.removeObserver = function (name, method, caller) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.removeObserver(name, method, caller);
            MutexLocker.deactive();
        };
        Facade.prototype.hasObserver = function (name, method, caller) {
            MutexLocker.deactive();
            return this.$var_view.hasObserver(name, method, caller);
        };
        Facade.prototype.registerCommand = function (name, cls, priority, args) {
            MutexLocker.deactive();
            this.$var_controller.registerCommand(name, cls, priority, args);
        };
        Facade.prototype.removeCommand = function (name) {
            MutexLocker.deactive();
            this.$var_controller.removeCommand(name);
        };
        Facade.prototype.hasCommand = function (name) {
            MutexLocker.deactive();
            return this.$var_controller.hasCommand(name);
        };
        Facade.prototype.registerProxy = function (proxy) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_model.registerProxy(proxy);
            MutexLocker.deactive();
        };
        Facade.prototype.removeProxy = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_model.removeProxy(name);
            MutexLocker.deactive();
        };
        Facade.prototype.retrieveProxy = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            var proxy = this.$var_model.retrieveProxy(name);
            MutexLocker.deactive();
            return proxy;
        };
        Facade.prototype.hasProxy = function (name) {
            MutexLocker.deactive();
            return this.$var_model.hasProxy(name);
        };
        Facade.prototype.registerMediator = function (mediator) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.registerMediator(mediator);
            MutexLocker.deactive();
        };
        Facade.prototype.removeMediator = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.removeMediator(name);
            MutexLocker.deactive();
        };
        Facade.prototype.retrieveMediator = function (name) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            var mediator = this.$var_view.retrieveMediator(name);
            MutexLocker.deactive();
            return mediator;
        };
        Facade.prototype.hasMediator = function (name) {
            MutexLocker.deactive();
            return this.$var_view.hasMediator(name);
        };
        Facade.prototype.sendNotification = function (name, data, cancelable) {
            MutexLocker.active(suncore.MsgQModEnum.MMI);
            this.$var_view.notifyObservers(name, data, cancelable);
            MutexLocker.deactive();
        };
        Facade.prototype.notifyCancel = function () {
            MutexLocker.deactive();
            this.$var_view.notifyCancel();
        };
        Facade.DEBUG = true;
        Facade.inst = null;
        return Facade;
    }());
    puremvc.Facade = Facade;
    var Model = (function () {
        function Model() {
            this.$proxies = {};
            if (Model.inst !== null) {
                throw Error("\u91CD\u590D\u6784\u5EFA\u6A21\u578B\u7C7B\uFF01\uFF01\uFF01");
            }
            Model.inst = this;
        }
        Model.prototype.registerProxy = function (proxy) {
            var name = proxy.func_getProxyName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u6A21\u578B\u7C7B");
            }
            if (this.hasProxy(name) === true) {
                throw Error("\u91CD\u590D\u6CE8\u518C\u6A21\u578B\u7C7B\uFF1A" + name);
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        };
        Model.prototype.removeProxy = function (name) {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u6A21\u578B\u7C7B");
            }
            if (this.hasProxy(name) === false) {
                throw Error("\u79FB\u9664\u4E0D\u5B58\u5728\u7684\u6A21\u578B\u7C7B\uFF1A" + name);
            }
            var proxy = this.$proxies[name];
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
            return this.$proxies[name] !== void 0;
        };
        Model.inst = null;
        return Model;
    }());
    puremvc.Model = Model;
    var MutexScope = (function () {
        function MutexScope() {
            this.$actMsgQMod = suncore.MsgQModEnum.E_NIL;
            this.$curMsgQMod = suncore.MsgQModEnum.E_NIL;
            this.$target = {};
            this.$snapshots = [];
        }
        MutexScope.prototype.asserts = function (msgQMod, target) {
            if (msgQMod === suncore.MsgQModEnum.E_KAL) {
                return;
            }
            if (this.$curMsgQMod === suncore.MsgQModEnum.E_NIL || this.$curMsgQMod === suncore.MsgQModEnum.E_KAL) {
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
            if (target instanceof Notifier) {
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
            if (msgQMod === suncore.MsgQModEnum.E_KAL) {
                a++;
            }
            else if (msgQMod === suncore.MsgQModEnum.MMI) {
                b++;
            }
            else {
                c++;
            }
            if (this.$curMsgQMod === suncore.MsgQModEnum.E_NIL || this.$curMsgQMod === suncore.MsgQModEnum.E_KAL) {
                this.$curMsgQMod = msgQMod;
            }
            else if (this.$curMsgQMod === suncore.MsgQModEnum.MMI && msgQMod !== suncore.MsgQModEnum.E_KAL) {
                this.$curMsgQMod = msgQMod;
            }
            this.$cache(a, b, c, false);
        };
        MutexScope.prototype.unlock = function (msgQMod) {
            var a = this.$target[MutexScope.MUTEX_REFERENCE_KAL] || 0;
            var b = this.$target[MutexScope.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexScope.MUTEX_REFERENCE_ANY] || 0;
            if (msgQMod === suncore.MsgQModEnum.E_KAL) {
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
                this.$curMsgQMod = suncore.MsgQModEnum.E_KAL;
            }
            else {
                this.$curMsgQMod = this.$actMsgQMod;
            }
            this.$cache(a, b, c, true);
        };
        MutexScope.prototype.active = function (msgQMod) {
            if (this.$actMsgQMod === suncore.MsgQModEnum.E_NIL) {
                this.$actMsgQMod = this.$curMsgQMod = msgQMod;
            }
        };
        MutexScope.prototype.deactive = function () {
            var a = this.$target[MutexScope.MUTEX_REFERENCE_KAL] || 0;
            var b = this.$target[MutexScope.MUTEX_REFERENCE_MMI] || 0;
            var c = this.$target[MutexScope.MUTEX_REFERENCE_ANY] || 0;
            if (a === 0 && b === 0 && c === 0) {
                this.$actMsgQMod = this.$curMsgQMod = suncore.MsgQModEnum.E_NIL;
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
            if (target instanceof Notifier) {
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
            enumerable: false,
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
            this.$var_facade = Facade.getInstance();
            this.$var_msgQMod = suncore.MsgQModEnum.MMI;
            this.$destroyed = false;
            if (msgQMod !== void 0) {
                this.$var_msgQMod = msgQMod;
            }
        }
        Notifier.prototype.destroy = function () {
            this.$destroyed = true;
        };
        Object.defineProperty(Notifier.prototype, "facade", {
            get: function () {
                MutexLocker.active(this.$var_msgQMod);
                return this.$var_facade;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Notifier.prototype, "msgQMod", {
            get: function () {
                return this.$var_msgQMod;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Notifier.prototype, "destroyed", {
            get: function () {
                return this.$destroyed;
            },
            enumerable: false,
            configurable: true
        });
        return Notifier;
    }());
    puremvc.Notifier = Notifier;
    var Observer = (function () {
        function Observer() {
            this.args = null;
            this.name = null;
            this.caller = null;
            this.method = null;
            this.priority = suncom.EventPriorityEnum.MID;
            this.receiveOnce = false;
        }
        return Observer;
    }());
    puremvc.Observer = Observer;
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(name, data) {
            var _this = _super.call(this) || this;
            _this.$var_proxyName = null;
            _this.$data = void 0;
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u65E0\u6548\u7684\u6A21\u578B\u7C7B\u540D\u5B57");
            }
            _this.$data = data;
            _this.$var_proxyName = name;
            return _this;
        }
        Proxy.prototype.func_getProxyName = function () {
            return this.$var_proxyName || null;
        };
        Proxy.prototype.onRegister = function () {
        };
        Proxy.prototype.onRemove = function () {
        };
        Proxy.prototype.getData = function () {
            return this.$data;
        };
        Proxy.prototype.setData = function (data) {
            this.$data = data;
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
            this.$pool = [];
            this.$lockers = {};
            this.$observers = {};
            this.$isCanceled = false;
            this.$onceObservers = [];
            this.$mediators = {};
            if (View.inst !== null) {
                throw Error("\u91CD\u590D\u6784\u5EFA\u89C6\u56FE\u7C7B\uFF01\uFF01\uFF01");
            }
            View.inst = this;
        }
        View.prototype.registerObserver = function (name, method, caller, receiveOnce, priority, args) {
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = suncom.EventPriorityEnum.MID; }
            if (args === void 0) { args = null; }
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u76D1\u542C");
            }
            if (method === void 0 || method === null) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u76D1\u542C\u56DE\u8C03\uFF1A" + name);
            }
            if (caller === void 0) {
                caller = null;
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                observers = this.$observers[name] = [];
            }
            else if (this.$lockers[name] === true) {
                this.$lockers[name] = false;
                this.$observers[name] = observers = observers.slice();
            }
            var index = -1;
            for (var i = 0; i < observers.length; i++) {
                var observer_1 = observers[i];
                if (observer_1.method === method && observer_1.caller === caller) {
                    Facade.DEBUG === true && console.warn("\u5FFD\u7565\u91CD\u590D\u6CE8\u518C\u7684\u76D1\u542C name:" + name);
                    return null;
                }
                if (index === -1 && observer_1.priority < priority) {
                    index = i;
                }
            }
            MutexLocker.create(name, caller);
            var observer = this.$pool.length > 0 ? this.$pool.pop() : new Observer();
            observer.args = args;
            observer.name = name;
            observer.caller = caller;
            observer.method = method;
            observer.priority = priority;
            observer.receiveOnce = receiveOnce;
            if (index < 0) {
                observers.push(observer);
            }
            else {
                observers.splice(index, 0, observer);
            }
            return observer;
        };
        View.prototype.removeObserver = function (name, method, caller) {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u76D1\u542C");
            }
            if (method === void 0 || method === null) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u76D1\u542C\u56DE\u8C03\uFF1A" + name);
            }
            if (caller === void 0) {
                caller = null;
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            if (this.$lockers[name] === true) {
                this.$lockers[name] = false;
                this.$observers[name] = observers = observers.slice();
            }
            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    observer.args = observer.caller = observer.method = null;
                    this.$pool.push(observers.splice(i, 1)[0]);
                    MutexLocker.release(name, caller);
                    break;
                }
            }
            if (observers.length === 0) {
                delete this.$lockers[name];
                delete this.$observers[name];
            }
        };
        View.prototype.hasObserver = function (name, method, caller) {
            if (method === void 0) {
                method = null;
            }
            if (caller === void 0) {
                caller = null;
            }
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u67E5\u8BE2\u65E0\u6548\u7684\u76D1\u542C");
            }
            if (method === null && caller === null) {
                throw Error("method\u548Ccaller\u4E0D\u5141\u8BB8\u540C\u65F6\u4E3A\u7A7A");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return false;
            }
            for (var i = 0; i < observers.length; i++) {
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
        View.prototype.notifyObservers = function (name, data, cancelable) {
            if (cancelable === void 0) { cancelable = true; }
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u6D3E\u53D1\u65E0\u6548\u7684\u901A\u77E5");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            this.$lockers[name] = true;
            MutexLocker.lock(name);
            var isCanceled = this.$isCanceled;
            this.$isCanceled = false;
            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
                }
                if (observer.caller !== null && observer.caller.destroyed === true) {
                    if (suncom && suncom.Common) {
                        console.warn("\u5BF9\u8C61[" + suncom.Common.getQualifiedClassName(observer.caller) + "]\u5DF1\u9500\u6BC1\uFF0C\u672A\u80FD\u54CD\u5E94" + name + "\u4E8B\u4EF6\u3002");
                    }
                    else {
                        console.warn("\u5BF9\u8C61\u5DF1\u9500\u6BC1\uFF0C\u672A\u80FD\u54CD\u5E94" + name + "\u4E8B\u4EF6\u3002");
                    }
                    continue;
                }
                var args = observer.args === null ? data : observer.args.concat(data);
                if (observer.caller === Controller.inst) {
                    observer.method.call(observer.caller, name, args);
                }
                else if (args instanceof Array) {
                    observer.method.apply(observer.caller, args);
                }
                else {
                    observer.method.call(observer.caller, args);
                }
                if (this.$isCanceled) {
                    if (cancelable === true) {
                        break;
                    }
                    console.error("\u5C1D\u8BD5\u53D6\u6D88\u4E0D\u53EF\u88AB\u53D6\u6D88\u7684\u901A\u77E5\uFF1A" + name);
                    this.$isCanceled = false;
                }
            }
            this.$isCanceled = isCanceled;
            this.$lockers[name] = false;
            MutexLocker.unlock(name);
            while (this.$onceObservers.length > 0) {
                var observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        View.prototype.notifyCancel = function () {
            this.$isCanceled = true;
        };
        View.prototype.registerMediator = function (mediator) {
            var name = mediator.func_getMediatorName();
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u4E2D\u4ECB\u8005\u5BF9\u8C61");
            }
            if (this.hasMediator(name) === true) {
                throw Error("\u91CD\u590D\u6CE8\u518C\u4E2D\u4ECB\u8005\u5BF9\u8C61" + name);
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        };
        View.prototype.removeMediator = function (name) {
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u4E2D\u4ECB\u8005\u5BF9\u8C61");
            }
            if (this.hasMediator(name) === false) {
                throw Error("\u79FB\u9664\u4E0D\u5B58\u5728\u7684\u4E2D\u4ECB\u8005\u5BF9\u8C61" + name);
            }
            var mediator = this.$mediators[name];
            delete this.$mediators[name];
            mediator.func_removeNotificationInterests();
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
            return this.$mediators[name] !== void 0;
        };
        View.inst = null;
        return View;
    }());
    puremvc.View = View;
    var MacroCommand = (function (_super) {
        __extends(MacroCommand, _super);
        function MacroCommand() {
            var _this = _super.call(this) || this;
            _this.$var_commands = [];
            _this.$initializeMacroCommand();
            return _this;
        }
        MacroCommand.prototype.$addSubCommand = function (cls) {
            this.$var_commands.push(cls);
        };
        MacroCommand.prototype.execute = function () {
            for (var i = 0; i < this.$var_commands.length; i++) {
                var cmd = new this.$var_commands[i]();
                cmd.execute.apply(cmd, arguments);
            }
        };
        return MacroCommand;
    }(Notifier));
    puremvc.MacroCommand = MacroCommand;
    var Mediator = (function (_super) {
        __extends(Mediator, _super);
        function Mediator(name, viewComponent) {
            var _this = _super.call(this) || this;
            _this.$var_mediatorName = null;
            _this.$var_notificationInterests = [];
            _this.$viewComponent = null;
            if (isStringNullOrEmpty(name) === true) {
                throw Error("\u65E0\u6548\u7684\u4E2D\u4ECB\u8005\u5BF9\u8C61\u540D\u5B57");
            }
            _this.$var_mediatorName = name;
            _this.$viewComponent = viewComponent || null;
            return _this;
        }
        Mediator.prototype.$handleNotification = function (name, method, priority, args) {
            if (priority === void 0) { priority = suncom.EventPriorityEnum.MID; }
            var observer = View.inst.registerObserver(name, method, this, void 0, priority, args);
            observer && this.$var_notificationInterests.push(observer);
        };
        Mediator.prototype.func_getMediatorName = function () {
            return this.$var_mediatorName;
        };
        Mediator.prototype.listNotificationInterests = function () {
        };
        Mediator.prototype.func_removeNotificationInterests = function () {
            for (var i = 0; i < this.$var_notificationInterests.length; i++) {
                var observer = this.$var_notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        Mediator.prototype.onRegister = function () {
        };
        Mediator.prototype.onRemove = function () {
        };
        Mediator.prototype.getViewComponent = function () {
            return this.$viewComponent;
        };
        Mediator.prototype.setViewComponent = function (view) {
            this.$viewComponent = view || null;
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
            if (MutexLocker.scope.curMsgQMod === suncore.MsgQModEnum.E_NIL || MutexLocker.scope.curMsgQMod === suncore.MsgQModEnum.E_KAL || MutexLocker.scope.curMsgQMod === suncore.MsgQModEnum.MMI) {
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
            if (target === null || target === Controller.inst || target === View.inst) {
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
            if (target === null || target === Controller.inst || target === View.inst) {
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
    function isStringNullOrEmpty(str) {
        return str === void 0 || str === null || str === "";
    }
    puremvc.isStringNullOrEmpty = isStringNullOrEmpty;
})(puremvc || (puremvc = {}));
//# sourceMappingURL=puremvc.js.map