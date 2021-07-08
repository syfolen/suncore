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
            this.$initializeModel();
            this.$initializeController();
            this.$initializeView();
        };
        Facade.prototype.$initializeModel = function () {
        };
        Facade.prototype.$initializeView = function () {
        };
        Facade.prototype.$initializeController = function () {
        };
        Facade.prototype.registerObserver = function (name, method, caller, receiveOnce, priority, args) {
            this.$var_view.registerObserver(name, method, caller, receiveOnce, priority, args);
        };
        Facade.prototype.removeObserver = function (name, method, caller) {
            this.$var_view.removeObserver(name, method, caller);
        };
        Facade.prototype.hasObserver = function (name, method, caller) {
            return this.$var_view.hasObserver(name, method, caller);
        };
        Facade.prototype.registerCommand = function (name, cls, priority, args) {
            this.$var_controller.registerCommand(name, cls, priority, args);
        };
        Facade.prototype.removeCommand = function (name) {
            this.$var_controller.removeCommand(name);
        };
        Facade.prototype.hasCommand = function (name) {
            return this.$var_controller.hasCommand(name);
        };
        Facade.prototype.registerProxy = function (proxy) {
            this.$var_model.registerProxy(proxy);
        };
        Facade.prototype.removeProxy = function (name) {
            this.$var_model.removeProxy(name);
        };
        Facade.prototype.retrieveProxy = function (name) {
            return this.$var_model.retrieveProxy(name);
        };
        Facade.prototype.hasProxy = function (name) {
            return this.$var_model.hasProxy(name);
        };
        Facade.prototype.registerMediator = function (mediator) {
            this.$var_view.registerMediator(mediator);
        };
        Facade.prototype.removeMediator = function (name) {
            this.$var_view.removeMediator(name);
        };
        Facade.prototype.retrieveMediator = function (name) {
            return this.$var_view.retrieveMediator(name);
        };
        Facade.prototype.hasMediator = function (name) {
            return this.$var_view.hasMediator(name);
        };
        Facade.prototype.sendNotification = function (name, data, cancelable) {
            this.$var_view.notifyObservers(name, data, cancelable);
        };
        Facade.prototype.notifyCancel = function () {
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
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u6A21\u578B\u7C7B");
            }
            if (this.hasProxy(name) === true) {
                throw Error("\u91CD\u590D\u6CE8\u518C\u6A21\u578B\u7C7B\uFF1A" + name);
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        };
        Model.prototype.removeProxy = function (name) {
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
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
            return this.$proxies[name] || null;
        };
        Model.prototype.hasProxy = function (name) {
            return this.$proxies[name] !== void 0;
        };
        Model.inst = null;
        return Model;
    }());
    puremvc.Model = Model;
    var Notifier = (function () {
        function Notifier() {
            this.$var_facade = Facade.getInstance();
            this.$destroyed = false;
        }
        Notifier.prototype.destroy = function () {
            this.$destroyed = true;
        };
        Object.defineProperty(Notifier.prototype, "facade", {
            get: function () {
                return this.$var_facade;
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
            _this.$var_lockData = null;
            _this.$data = void 0;
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error("\u65E0\u6548\u7684\u6A21\u578B\u7C7B\u540D\u5B57");
            }
            _this.$data = data;
            _this.$var_proxyName = name;
            _this.$lockJsonData(data);
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
            if (this.$var_lockData === null) {
                this.$lockJsonData(data);
            }
        };
        Proxy.prototype.hasData = function () {
            return this.$data ? true : false;
        };
        Proxy.prototype.hasDataStrictly = function () {
            return this.$data !== void 0;
        };
        Proxy.prototype.$lockJsonData = function (data) {
            if (data instanceof Object && data instanceof Array === false) {
                this.$var_lockData = data;
            }
        };
        Proxy.prototype.$setDefaultJsonValue = function (key, value) {
            if (this.$var_lockData[key] === void 0) {
                this.$var_lockData[key] = value;
            }
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
            this.$recycle = [];
            this.$notifyCount = 0;
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
            if (method === void 0) {
                method = null;
            }
            if (caller === void 0) {
                caller = null;
            }
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u76D1\u542C");
            }
            if (method === null) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u76D1\u542C\u56DE\u8C03\uFF1A" + name);
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
                    suncom.Logger.warn("\u5FFD\u7565\u91CD\u590D\u6CE8\u518C\u7684\u76D1\u542C name:" + name);
                    return null;
                }
                if (index === -1 && observer_1.priority < priority) {
                    index = i;
                }
            }
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
            if (method === void 0) {
                method = null;
            }
            if (caller === void 0) {
                caller = null;
            }
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u76D1\u542C");
            }
            if (method === null) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u76D1\u542C\u56DE\u8C03\uFF1A" + name);
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
                    this.$recycle.push(observers.splice(i, 1)[0]);
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
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error("\u67E5\u8BE2\u65E0\u6548\u7684\u76D1\u542C");
            }
            if (method === null) {
                throw Error("\u67E5\u8BE2\u65E0\u6548\u7684\u76D1\u542C\u56DE\u8C03\uFF01\uFF01\uFF01");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return false;
            }
            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];
                if (observer.method === method && observer.caller === caller) {
                    return true;
                }
            }
            return false;
        };
        View.prototype.notifyObservers = function (name, data, cancelable) {
            if (cancelable === void 0) { cancelable = true; }
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
                throw Error("\u6D3E\u53D1\u65E0\u6548\u7684\u901A\u77E5");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            this.$lockers[name] = true;
            var isCanceled = this.$isCanceled;
            this.$isCanceled = false;
            this.$notifyCount++;
            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];
                var caller_1 = observer.caller;
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
                }
                if (caller_1 !== null) {
                    if (caller_1 instanceof fairygui.GObject) {
                        if (caller_1.isDisposed === true) {
                            suncom.Logger.warn("\u5BF9\u8C61[" + suncom.Common.getQualifiedClassName(caller_1) + "]\u5DF1\u9500\u6BC1\uFF0C\u672A\u80FD\u54CD\u5E94" + name + "\u4E8B\u4EF6\u3002");
                        }
                    }
                    else if (caller_1 instanceof Laya.Node || caller_1 instanceof puremvc.Notifier) {
                        if (caller_1.destroyed === true) {
                            suncom.Logger.warn("\u5BF9\u8C61[" + suncom.Common.getQualifiedClassName(caller_1) + "]\u5DF1\u9500\u6BC1\uFF0C\u672A\u80FD\u54CD\u5E94" + name + "\u4E8B\u4EF6\u3002");
                        }
                    }
                    else if (caller_1 instanceof suncore.BaseService) {
                        if (caller_1.running === false) {
                            suncom.Logger.warn("\u670D\u52A1[" + suncom.Common.getQualifiedClassName(caller_1) + "]\u5DF1\u505C\u6B62\uFF0C\u672A\u80FD\u54CD\u5E94" + name + "\u4E8B\u4EF6\u3002");
                        }
                    }
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
            this.$notifyCount--;
            while (this.$onceObservers.length > 0) {
                var observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
            if (this.$notifyCount === 0) {
                while (this.$recycle.length > 0) {
                    var observer = this.$recycle.pop();
                    observer.args = observer.caller = observer.method = null;
                    this.$pool.push(observer);
                }
            }
        };
        View.prototype.notifyCancel = function () {
            this.$isCanceled = true;
        };
        View.prototype.registerMediator = function (mediator) {
            var name = mediator.func_getMediatorName();
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
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
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
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
            return this.$mediators[name] || null;
        };
        View.prototype.hasMediator = function (name) {
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
            if (suncom.Common.isStringNullOrEmpty(name) === true) {
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
        Mediator.prototype.hasViewComponent = function () {
            return this.$viewComponent !== null;
        };
        return Mediator;
    }(Notifier));
    puremvc.Mediator = Mediator;
})(puremvc || (puremvc = {}));
//# sourceMappingURL=puremvc.js.map