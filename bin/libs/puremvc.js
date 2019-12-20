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
        Controller.prototype.registerCommand = function (name, cls) {
            if (this.hasCommand(name) === true) {
                throw Error("Register Duplicate Command " + name);
            }
            this.$commands[name] = cls;
            View.inst.registerObserver(name, this.executeCommand, this);
        };
        Controller.prototype.removeCommand = function (name) {
            if (this.hasCommand(name) === false) {
                throw Error("Remove Non-Existent Command " + name);
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
            this.$regMMICmd(1, "OSL");
        };
        Facade.prototype.$initializeModel = function () {
        };
        Facade.prototype.$initializeView = function () {
        };
        Facade.prototype.$initializeController = function () {
        };
        Facade.prototype.$regMMICmd = function (msgQMod, prefix) {
            Mutex.checkPrefix = true;
            Mutex.mmiMsgQMap[prefix] = msgQMod;
        };
        Facade.prototype.registerObserver = function (name, method, caller, receiveOnce, priority) {
            Mutex.deactive();
            this.$view.registerObserver(name, method, caller, receiveOnce, priority);
        };
        Facade.prototype.removeObserver = function (name, method, caller) {
            Mutex.deactive();
            this.$view.removeObserver(name, method, caller);
        };
        Facade.prototype.registerCommand = function (name, cls) {
            Mutex.deactive();
            this.$controller.registerCommand(name, cls);
        };
        Facade.prototype.removeCommand = function (name) {
            Mutex.deactive();
            this.$controller.removeCommand(name);
        };
        Facade.prototype.hasCommand = function (name) {
            Mutex.deactive();
            return this.$controller.hasCommand(name);
        };
        Facade.prototype.registerProxy = function (proxy) {
            Mutex.deactive();
            this.$model.registerProxy(proxy);
        };
        Facade.prototype.removeProxy = function (name) {
            Mutex.deactive();
            this.$model.removeProxy(name);
        };
        Facade.prototype.retrieveProxy = function (name) {
            Mutex.deactive();
            return this.$model.retrieveProxy(name);
        };
        Facade.prototype.hasProxy = function (name) {
            Mutex.deactive();
            return this.$model.hasProxy(name);
        };
        Facade.prototype.registerMediator = function (mediator) {
            Mutex.deactive();
            this.$view.registerMediator(mediator);
        };
        Facade.prototype.removeMediator = function (name) {
            Mutex.deactive();
            this.$view.removeMediator(name);
        };
        Facade.prototype.retrieveMediator = function (name) {
            Mutex.deactive();
            return this.$view.retrieveMediator(name);
        };
        Facade.prototype.hasMediator = function (name) {
            Mutex.deactive();
            return this.$view.hasMediator(name);
        };
        Facade.prototype.sendNotification = function (name, args, cancelable) {
            Mutex.active(9527);
            this.$view.notifyObservers(name, args, cancelable);
            Mutex.deactive();
        };
        Facade.prototype.notifyCancel = function () {
            Mutex.deactive();
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
                throw Error("Register Invalid Proxy");
            }
            if (this.hasProxy(name) === true) {
                throw Error("Register Duplicate Proxy " + name);
            }
            if (Mutex.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            this.$proxies[name] = proxy;
            proxy.onRegister();
        };
        Model.prototype.removeProxy = function (name) {
            if (name === void 0) {
                throw Error("Remove Invalid Proxy");
            }
            var proxy = this.retrieveProxy(name);
            if (proxy === null) {
                throw Error("Remove Non-Existent Proxy " + name);
            }
            if (Mutex.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            delete this.$proxies[name];
            proxy.onRemove();
        };
        Model.prototype.retrieveProxy = function (name) {
            if (Mutex.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            return this.$proxies[name] || null;
        };
        Model.prototype.hasProxy = function (name) {
            if (Mutex.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            return this.retrieveProxy(name) != null;
        };
        Model.SINGLETON_MSG = "Model singleton already constructed!";
        Model.inst = null;
        return Model;
    }());
    puremvc.Model = Model;
    var Notifier = (function () {
        function Notifier(msgQMod) {
            if (msgQMod === void 0) { msgQMod = 0; }
            this.$msgQMod = 9527;
            this.$facade = Facade.getInstance();
            if (msgQMod > 0) {
                this.$msgQMod = msgQMod;
            }
        }
        Object.defineProperty(Notifier.prototype, "facade", {
            get: function () {
                Mutex.active(this.$msgQMod);
                return this.$facade;
            },
            enumerable: true,
            configurable: true
        });
        return Notifier;
    }());
    puremvc.Notifier = Notifier;
    var Observer = (function () {
        function Observer() {
        }
        return Observer;
    }());
    puremvc.Observer = Observer;
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(name, data) {
            var _this = _super.call(this) || this;
            if (name === void 0) {
                throw Error("Invalid Proxy Name");
            }
            _this.$proxyName = name;
            if (data !== void 0) {
                _this.data = data;
            }
            return _this;
        }
        Proxy.prototype.getProxyName = function () {
            return this.$proxyName || null;
        };
        Proxy.prototype.onRegister = function () {
        };
        Proxy.prototype.onRemove = function () {
        };
        Proxy.prototype.setData = function (data) {
            this.data = data;
        };
        Proxy.prototype.getData = function () {
            return this.data;
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
            if (View.inst !== null) {
                throw Error(View.SINGLETON_MSG);
            }
            View.inst = this;
        }
        View.prototype.registerObserver = function (name, method, caller, receiveOnce, priority) {
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = 1; }
            if (name === void 0) {
                throw Error("Register Invalid Observer");
            }
            if (method === void 0) {
                throw Error("Register Invalid Observer Method");
            }
            Mutex.create(name, caller);
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
            var observer = new Observer();
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
            if (name === void 0) {
                throw Error("Remove Invalid Observer");
            }
            if (method === void 0) {
                throw Error("Remove Invalid Observer Method");
            }
            Mutex.release(name, caller);
            var observers = this.$observers[name];
            if (observers === void 0) {
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
                    break;
                }
            }
            if (observers.length === 1) {
                delete this.$observers[name];
            }
        };
        View.prototype.notifyCancel = function () {
            this.$isCanceled = true;
        };
        View.prototype.notifyObservers = function (name, args, cancelable) {
            if (cancelable === void 0) { cancelable = false; }
            if (name === void 0) {
                throw Error("Notify Invalid Command");
            }
            var observers = this.$observers[name];
            if (observers === void 0) {
                return;
            }
            observers[0] = true;
            Mutex.lock(name);
            var isCanceled = this.$isCanceled;
            this.$isCanceled = false;
            for (var i = 1; i < observers.length; i++) {
                var observer = observers[i];
                if (observer.receiveOnce === true) {
                    this.$onceObservers.push(observer);
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
            Mutex.unlock(name);
            while (this.$onceObservers.length > 0) {
                var observer = this.$onceObservers.pop();
                this.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        View.prototype.registerMediator = function (mediator) {
            var name = mediator.getMediatorName();
            if (name === null) {
                throw Error("Register Invalid Mediator");
            }
            if (this.hasMediator(name) === true) {
                throw Error("Register Duplicate Mediator " + name);
            }
            if (Mutex.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            this.$mediators[name] = mediator;
            mediator.listNotificationInterests();
            mediator.onRegister();
        };
        View.prototype.removeMediator = function (name) {
            if (name === void 0) {
                throw Error("Remove Invalid Mediator");
            }
            var mediator = this.retrieveMediator(name);
            if (mediator === null) {
                throw Error("Remove Non-Existent Mediator " + name);
            }
            if (Mutex.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            delete this.$mediators[name];
            mediator.removeNotificationInterests();
            mediator.onRemove();
        };
        View.prototype.retrieveMediator = function (name) {
            if (Mutex.enableMMIAction() === false) {
                throw Error("\u975EMMI\u6A21\u5757\u7981\u7528\u63A5\u53E3");
            }
            return this.$mediators[name] || null;
        };
        View.prototype.hasMediator = function (name) {
            if (Mutex.enableMMIAction() === false) {
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
            _this.initializeMacroCommand();
            return _this;
        }
        MacroCommand.prototype.addSubCommand = function (cls) {
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
                throw Error("Invalid Mediator Name");
            }
            if (viewComponent === void 0) {
                throw Error("Invalid View Component");
            }
            _this.$mediatorName = name;
            if (viewComponent !== void 0) {
                _this.viewComponent = viewComponent;
            }
            return _this;
        }
        Mediator.prototype.getMediatorName = function () {
            return this.$mediatorName || null;
        };
        Mediator.prototype.getViewComponent = function () {
            return this.viewComponent;
        };
        Mediator.prototype.listNotificationInterests = function () {
        };
        Mediator.prototype.removeNotificationInterests = function () {
            for (var i = 0; i < this.$notificationInterests.length; i++) {
                var observer = this.$notificationInterests[i];
                View.inst.removeObserver(observer.name, observer.method, observer.caller);
            }
        };
        Mediator.prototype.handleNotification = function (name, method) {
            var observer = View.inst.registerObserver(name, method, this);
            observer && this.$notificationInterests.push(observer);
        };
        Mediator.prototype.onRegister = function () {
        };
        Mediator.prototype.onRemove = function () {
        };
        return Mediator;
    }(Notifier));
    puremvc.Mediator = Mediator;
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
        function isMMICmd(name) {
            if (isSunCmd(name) === true) {
                return false;
            }
            var prefix = getCommandPrefix(name);
            var msgQMod = Mutex.mmiMsgQMap[prefix] || 0;
            return msgQMod !== 0;
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
                var prefix = getCommandPrefix(name);
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
            var msgQMod = Mutex.mmiMsgQMap[currentPrefix] || 0;
            return msgQMod !== 0;
        }
        Mutex.enableMMIAction = enableMMIAction;
        function create(name, target) {
            if (Mutex.checkPrefix === false) {
                return;
            }
            if (target === null || target === Controller.inst || target === View.inst) {
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
            if (target === null || target === Controller.inst || target === View.inst) {
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
    })(Mutex = puremvc.Mutex || (puremvc.Mutex = {}));
})(puremvc || (puremvc = {}));
