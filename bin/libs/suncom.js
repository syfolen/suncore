var suncom;
(function (suncom) {
    var DebugMode;
    (function (DebugMode) {
        DebugMode[DebugMode["ANY"] = 1] = "ANY";
        DebugMode[DebugMode["ENGINE"] = 2] = "ENGINE";
        DebugMode[DebugMode["NATIVE"] = 4] = "NATIVE";
        DebugMode[DebugMode["NETWORK"] = 8] = "NETWORK";
        DebugMode[DebugMode["NETWORK_HEARTBEAT"] = 16] = "NETWORK_HEARTBEAT";
        DebugMode[DebugMode["DEBUG"] = 32] = "DEBUG";
        DebugMode[DebugMode["ENGINEER"] = 64] = "ENGINEER";
        DebugMode[DebugMode["NORMAL"] = 128] = "NORMAL";
        DebugMode[DebugMode["TEST"] = 256] = "TEST";
        DebugMode[DebugMode["TDD"] = 512] = "TDD";
        DebugMode[DebugMode["ATDD"] = 1024] = "ATDD";
    })(DebugMode = suncom.DebugMode || (suncom.DebugMode = {}));
    var EnvMode;
    (function (EnvMode) {
        EnvMode[EnvMode["DEVELOP"] = 0] = "DEVELOP";
        EnvMode[EnvMode["DEBUG"] = 1] = "DEBUG";
        EnvMode[EnvMode["WEB"] = 2] = "WEB";
        EnvMode[EnvMode["NATIVE"] = 3] = "NATIVE";
    })(EnvMode = suncom.EnvMode || (suncom.EnvMode = {}));
    var EventPriorityEnum;
    (function (EventPriorityEnum) {
        EventPriorityEnum[EventPriorityEnum["LOWEST"] = 0] = "LOWEST";
        EventPriorityEnum[EventPriorityEnum["LOW"] = 1] = "LOW";
        EventPriorityEnum[EventPriorityEnum["MID"] = 2] = "MID";
        EventPriorityEnum[EventPriorityEnum["HIGH"] = 3] = "HIGH";
        EventPriorityEnum[EventPriorityEnum["HIGHEST"] = 4] = "HIGHEST";
        EventPriorityEnum[EventPriorityEnum["FWL"] = 5] = "FWL";
        EventPriorityEnum[EventPriorityEnum["EGL"] = 6] = "EGL";
        EventPriorityEnum[EventPriorityEnum["OSL"] = 7] = "OSL";
    })(EventPriorityEnum = suncom.EventPriorityEnum || (suncom.EventPriorityEnum = {}));
    var Dictionary = (function () {
        function Dictionary(primaryKey) {
            this.$var_primaryKey = null;
            this.$var_dataMap = {};
            this.source = [];
            if (typeof primaryKey === "number") {
                primaryKey = primaryKey + "";
            }
            if (typeof primaryKey !== "string") {
                throw Error("\u975E\u6CD5\u7684\u4E3B\u952E\u5B57\u6BB5\u540D\uFF1A" + primaryKey);
            }
            if (primaryKey.length === 0) {
                throw Error("\u65E0\u6548\u7684\u4E3B\u952E\u5B57\u6BB5\u540D\u5B57\u957F\u5EA6\uFF1A" + primaryKey.length);
            }
            this.$var_primaryKey = primaryKey;
        }
        Dictionary.prototype.$func_removeByIndex = function (index) {
            var data = this.source[index];
            this.source.splice(index, 1);
            var value = data[this.$var_primaryKey];
            delete this.$var_dataMap[value];
            return data;
        };
        Dictionary.prototype.$func_getIndexByValue = function (key, value) {
            if (value === void 0) {
                return -1;
            }
            for (var i = 0; i < this.source.length; i++) {
                var data = this.source[i];
                if (data[key] === value) {
                    return i;
                }
            }
            return -1;
        };
        Dictionary.prototype.put = function (data) {
            var value = data[this.$var_primaryKey];
            if (Common.isStringNullOrEmpty(value) === true) {
                throw Error("\u65E0\u6548\u7684\u4E3B\u952E\u7684\u503C\uFF0Ctype:" + typeof value + ", value:" + value);
            }
            if (this.getByPrimaryValue(value) === null) {
                this.source.push(data);
                this.$var_dataMap[value] = data;
            }
            else {
                throw Error("\u91CD\u590D\u7684\u4E3B\u952E\u503C\uFF1A[" + this.$var_primaryKey + "]" + value);
            }
            return data;
        };
        Dictionary.prototype.getByValue = function (key, value) {
            if (key === this.$var_primaryKey) {
                return this.getByPrimaryValue(value);
            }
            var index = this.$func_getIndexByValue(key, value);
            if (index === -1) {
                return null;
            }
            return this.source[index];
        };
        Dictionary.prototype.getByPrimaryValue = function (value) {
            return this.$var_dataMap[value.toString()] || null;
        };
        Dictionary.prototype.remove = function (data) {
            var index = this.source.indexOf(data);
            if (index === -1) {
                return data;
            }
            return this.$func_removeByIndex(index);
        };
        Dictionary.prototype.removeByValue = function (key, value) {
            if (key === this.$var_primaryKey) {
                return this.removeByPrimaryValue(value);
            }
            var index = this.$func_getIndexByValue(key, value);
            if (index === -1) {
                return null;
            }
            return this.$func_removeByIndex(index);
        };
        Dictionary.prototype.removeByPrimaryValue = function (value) {
            var data = this.getByPrimaryValue(value);
            if (data === null) {
                return null;
            }
            return this.remove(data);
        };
        Dictionary.prototype.clear = function () {
            this.source.length = 0;
            this.$var_dataMap = {};
        };
        Dictionary.prototype.forEach = function (method) {
            for (var i = 0; i < this.source.length; i++) {
                if (method(this.source[i]) === true) {
                    break;
                }
            }
        };
        return Dictionary;
    }());
    suncom.Dictionary = Dictionary;
    var EventInfo = (function () {
        function EventInfo() {
            this.type = null;
            this.caller = null;
            this.method = null;
            this.priority = EventPriorityEnum.MID;
            this.receiveOnce = false;
        }
        EventInfo.prototype.recover = function () {
            this.caller = null;
            this.method = null;
            Pool.recover("suncom.EventInfo", this);
        };
        return EventInfo;
    }());
    suncom.EventInfo = EventInfo;
    var EventSystem = (function () {
        function EventSystem() {
            this.$var_events = {};
            this.$var_lockers = {};
            this.$var_onceList = [];
            this.$var_isCanceled = false;
        }
        EventSystem.prototype.addEventListener = function (type, method, caller, receiveOnce, priority) {
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = EventPriorityEnum.MID; }
            if (Common.isStringNullOrEmpty(type) === true) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u4E8B\u4EF6\uFF01\uFF01\uFF01");
            }
            if (method === void 0 || method === null) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u4E8B\u4EF6\u56DE\u8C03\uFF01\uFF01\uFF01");
            }
            if (caller === void 0) {
                caller = null;
            }
            var list = this.$var_events[type];
            if (list === void 0) {
                list = this.$var_events[type] = [];
            }
            else if (this.$var_lockers[type] === true) {
                this.$var_events[type] = list = list.slice(0);
                this.$var_lockers[type] = false;
            }
            var index = -1;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.method === method && item.caller === caller) {
                    return;
                }
                if (index === -1 && item.priority < priority) {
                    index = i;
                }
            }
            var event = Pool.getItemByClass("suncom.EventInfo", EventInfo);
            event.type = type;
            event.caller = caller;
            event.method = method;
            event.priority = priority;
            event.receiveOnce = receiveOnce;
            if (index < 0) {
                list.push(event);
            }
            else {
                list.splice(index, 0, event);
            }
        };
        EventSystem.prototype.removeEventListener = function (type, method, caller) {
            if (Common.isStringNullOrEmpty(type) === true) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u4E8B\u4EF6\uFF01\uFF01\uFF01");
            }
            if (method === void 0 || method === null) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u4E8B\u4EF6\u56DE\u8C03\uFF01\uFF01\uFF01");
            }
            if (caller === void 0) {
                caller = null;
            }
            var list = this.$var_events[type];
            if (list === void 0) {
                return;
            }
            if (this.$var_lockers[type] === true) {
                this.$var_events[type] = list = list.slice(0);
                this.$var_lockers[type] = false;
            }
            for (var i = 0; i < list.length; i++) {
                var event_1 = list[i];
                if (event_1.method === method && event_1.caller === caller) {
                    list.splice(i, 1)[0].recover();
                    break;
                }
            }
            if (list.length === 0) {
                delete this.$var_events[type];
                delete this.$var_lockers[type];
            }
        };
        EventSystem.prototype.dispatchEvent = function (type, data, cancelable) {
            if (cancelable === void 0) { cancelable = true; }
            if (Common.isStringNullOrEmpty(type) === true) {
                throw Error("\u6D3E\u53D1\u65E0\u6548\u4E8B\u4EF6\uFF01\uFF01\uFF01");
            }
            var list = this.$var_events[type];
            if (list === void 0) {
                return;
            }
            this.$var_lockers[type] = true;
            var isCanceled = this.$var_isCanceled;
            this.$var_isCanceled = false;
            for (var i = 0; i < list.length; i++) {
                var event_2 = list[i];
                if (event_2.receiveOnce === true) {
                    this.$var_onceList.push(event_2);
                }
                if (data instanceof Array) {
                    event_2.method.apply(event_2.caller, data);
                }
                else {
                    event_2.method.call(event_2.caller, data);
                }
                if (this.$var_isCanceled) {
                    if (cancelable === true) {
                        break;
                    }
                    console.error("\u5C1D\u8BD5\u53D6\u6D88\u4E0D\u53EF\u88AB\u53D6\u6D88\u7684\u4E8B\u4EF6\uFF1A" + type);
                    this.$var_isCanceled = false;
                }
            }
            this.$var_isCanceled = isCanceled;
            this.$var_lockers[type] = false;
            while (this.$var_onceList.length > 0) {
                var event_3 = this.$var_onceList.pop();
                this.removeEventListener(event_3.type, event_3.method, event_3.caller);
            }
        };
        EventSystem.prototype.dispatchCancel = function () {
            this.$var_isCanceled = true;
        };
        return EventSystem;
    }());
    suncom.EventSystem = EventSystem;
    var Expect = (function () {
        function Expect(description) {
            if (description === void 0) { description = null; }
            this.$var_value = void 0;
            this.$var_asNot = false;
            this.$var_interpretation = null;
            if (Global.debugMode & DebugMode.TEST) {
                description !== null && Logger.log(DebugMode.ANY, description);
            }
        }
        Expect.prototype.expect = function (value) {
            this.$var_value = value;
            return this;
        };
        Expect.prototype.interpret = function (str) {
            this.$var_interpretation = str;
            return this;
        };
        Expect.prototype.test = function (pass, message) {
            if ((this.$var_asNot === false && pass === false) || (this.$var_asNot === true && pass === true)) {
                Test.ASSERT_FAILED = true;
                message !== null && Logger.error(DebugMode.ANY, message);
                this.$var_interpretation !== null && Logger.error(DebugMode.ANY, this.$var_interpretation);
                if (Test.ASSERT_BREAKPOINT === true) {
                    debugger;
                }
                throw Error("测试失败！");
            }
        };
        Expect.prototype.anything = function () {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value !== null && this.$var_value !== void 0;
                var message = "\u671F\u671B\u503C" + (this.$var_asNot === false ? "" : "不为") + "\uFF1Anull or undefined, \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$var_value);
                this.test(pass, message);
            }
        };
        Expect.prototype.arrayContaining = function (array) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = true;
                for (var i = 0; i < array.length; i++) {
                    var value = array[i];
                    if (this.$var_value.indexOf(value) < 0) {
                        pass = false;
                        break;
                    }
                }
                var message = "\u671F\u671B" + (this.$var_asNot === false ? "" : "不") + "\u5305\u542B\uFF1A" + Common.toDisplayString(array) + ", \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$var_value);
                this.test(pass, message);
            }
        };
        Expect.prototype.stringContaining = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value.indexOf(value) > -1;
                var message = "\u671F\u671B" + (this.$var_asNot === false ? "" : "不") + "\u5305\u542B\uFF1A" + value + ", \u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.stringMatching = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value.indexOf(this.$var_value) > -1;
                var message = "\u671F\u671B" + (this.$var_asNot === false ? "" : "不") + "\u88AB\u5305\u542B\uFF1A" + value + ", \u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toHaveProperty = function (key, value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value === void 0 ? this.$var_value[key] !== void 0 : this.$var_value[key] === value;
                var message = "\u671F\u671B" + (this.$var_asNot === false ? "" : "不") + "\u5B58\u5728\u5C5E\u6027\uFF1A" + key + ", \u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBe = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value === value;
                var message = "\u671F\u671B\u503C" + (this.$var_asNot === false ? "" : "不为") + "\uFF1A" + Common.toDisplayString(value) + ", \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$var_value);
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeNull = function () {
            this.toBe(null);
        };
        Expect.prototype.toBeUndefined = function () {
            this.toBe(void 0);
        };
        Expect.prototype.toBeBoolean = function () {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = typeof this.$var_value === "boolean";
                var message = "\u671F\u671B" + (this.$var_asNot === false ? "为" : "不为") + "\uFF1A\u5E03\u5C14\u7C7B\u578B, \u5B9E\u9645\u4E3A\uFF1A" + typeof this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeInstanceOf = function (cls) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value instanceof cls;
                var message = "\u671F\u671B " + Common.getQualifiedClassName(this.$var_value) + " \u7684\u7C7B\u578B" + (this.$var_asNot === false ? "" : "不") + "\u4E3A " + Common.getClassName(cls);
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeFalsy = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value ? false : true;
                var message = "\u671F\u671B " + Common.toDisplayString(value) + " " + (this.$var_asNot === false ? "" : "不") + "\u4E3A\u5047, \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$var_value);
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeTruthy = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value ? true : false;
                var message = "\u671F\u671B " + Common.toDisplayString(value) + " " + (this.$var_asNot === false ? "" : "不") + "\u4E3A\u5047, \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$var_value);
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeCloseTo = function (value, deviation) {
            if (deviation === void 0) { deviation = 0; }
            if (Global.debugMode & DebugMode.TEST) {
                var pass = Math.abs(this.$var_value - value) <= Math.abs(deviation);
                var message = "\u671F\u671B\u4E0E" + value + "\u7684\u8BEF\u5DEE" + (this.$var_asNot === true ? "" : "不") + "\u8D85\u8FC7" + deviation + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeGreaterThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value > value;
                var message = "\u671F\u671B" + (this.$var_asNot === true ? "" : "不") + "\u5927\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeGreaterOrEqualThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value >= value;
                var message = "\u671F\u671B" + (this.$var_asNot === true ? "" : "不") + "\u5927\u4E8E\u7B49\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeLessThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value < value;
                var message = "\u671F\u671B" + (this.$var_asNot === true ? "" : "不") + "\u5C0F\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeLessOrEqualThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$var_value <= value;
                var message = "\u671F\u671B" + (this.$var_asNot === true ? "" : "不") + "\u5C0F\u4E8E\u7B49\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$var_value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toEqual = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = Common.isEqual(this.$var_value, value, false);
                var message = "\u671F\u671B\u76F8\u7B49\uFF1A" + Common.toDisplayString(value) + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$var_value);
                this.test(pass, message);
            }
        };
        Expect.prototype.toStrictEqual = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = Common.isEqual(this.$var_value, value, true);
                var message = "\u671F\u671B\u76F8\u7B49\uFF1A" + Common.toDisplayString(value) + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$var_value);
                this.test(pass, message);
            }
        };
        Object.defineProperty(Expect.prototype, "not", {
            get: function () {
                this.$var_asNot = true;
                return this;
            },
            enumerable: false,
            configurable: true
        });
        return Expect;
    }());
    suncom.Expect = Expect;
    var Handler = (function () {
        function Handler() {
            this.$var_id = 0;
            this.$var_args = null;
            this.$var_caller = null;
            this.$var_method = null;
            this.$var_once = false;
        }
        Handler.prototype.$func_setTo = function (caller, method, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = true; }
            if (this.$var_id === -1) {
                throw Error("Handler\u5DF1\u88AB\u56DE\u6536\uFF01\uFF01\uFF01");
            }
            this.$var_id = Common.createHashId();
            this.$var_caller = caller || null;
            this.$var_method = method || null;
            this.$var_args = args;
            this.$var_once = once;
            return this;
        };
        Handler.prototype.run = function () {
            var id = this.$var_id;
            var res = this.$var_method.apply(this.$var_caller, this.$var_args);
            id === this.$var_id && this.$var_once === true && this.recover();
            return res;
        };
        Handler.prototype.runWith = function (args) {
            var id = this.$var_id;
            var res;
            if (this.$var_args !== null) {
                res = this.$var_method.apply(this.$var_caller, this.$var_args.concat(args));
            }
            else if (args instanceof Array) {
                res = this.$var_method.apply(this.$var_caller, args);
            }
            else {
                res = this.$var_method.call(this.$var_caller, args);
            }
            id === this.$var_id && this.$var_once === true && this.recover();
            return res;
        };
        Handler.prototype.recover = function () {
            if (Pool.recover("suncom.Handler", this) === true) {
                this.$var_id = -1;
                this.$var_args = null;
                this.$var_caller = null;
                this.$var_method = null;
            }
        };
        Object.defineProperty(Handler.prototype, "caller", {
            get: function () {
                return this.$var_caller;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Handler.prototype, "method", {
            get: function () {
                return this.$var_method;
            },
            enumerable: false,
            configurable: true
        });
        Handler.create = function (caller, method, args, once) {
            var handler = Pool.getItemByClass("suncom.Handler", Handler);
            handler.$var_id = 0;
            return handler.$func_setTo(caller, method, args, once);
        };
        return Handler;
    }());
    suncom.Handler = Handler;
    var HashMap = (function () {
        function HashMap() {
            this.$var_nextId = 0;
            this.$var_ids = [];
            this.$var_keys = [];
            this.$var_id2value = {};
        }
        HashMap.prototype.$toInnerKey = function (key) {
            if (key === void 0) {
                return "__suncom_hashMap_innerKey__undefined__";
            }
            if (key === null) {
                return "__suncom_hashMap_innerKey__null__";
            }
            if (typeof key === "number" && isNaN(key) === true) {
                return "__suncom_hashMap_innerKey__isNaN__";
            }
            return key;
        };
        HashMap.prototype.$getInnerIndex = function (key) {
            var rkey = this.$toInnerKey(key);
            return this.$var_keys.indexOf(rkey);
        };
        HashMap.prototype.size = function () {
            return this.$var_keys.length;
        };
        HashMap.prototype.exist = function (key) {
            return this.$getInnerIndex(key) > -1;
        };
        HashMap.prototype.set = function (key, value) {
            var index = this.$getInnerIndex(key);
            var id;
            if (index === -1) {
                id = this.$var_nextId++;
                this.$var_ids.push(id);
                this.$var_keys.push(this.$toInnerKey(key));
            }
            else {
                id = this.$var_ids[index];
            }
            this.$var_id2value[id] = value;
            return value;
        };
        HashMap.prototype.get = function (key) {
            var index = this.$getInnerIndex(key);
            if (index === -1) {
                return null;
            }
            var id = this.$var_ids[index];
            return this.$var_id2value[id];
        };
        HashMap.prototype.remove = function (key) {
            var index = this.$getInnerIndex(key);
            if (index === -1) {
                return null;
            }
            var id = this.$var_ids[index];
            var value = this.$var_id2value[index];
            this.$var_ids.splice(index, 1);
            this.$var_keys.splice(index, 1);
            delete this.$var_id2value[id];
            return value;
        };
        HashMap.prototype.clear = function () {
            this.$var_ids.length = 0;
            this.$var_keys.length = 0;
            this.$var_id2value = {};
        };
        HashMap.prototype.forEach = function (method) {
            for (var i = 0; i < this.$var_ids.length; i++) {
                var id = this.$var_ids[i];
                if (method(this.$var_id2value[id], this.$var_keys[id]) === true) {
                    break;
                }
            }
        };
        return HashMap;
    }());
    suncom.HashMap = HashMap;
    var Common;
    (function (Common) {
        var $hashId = 0;
        function createHashId() {
            $hashId++;
            return $hashId;
        }
        Common.createHashId = createHashId;
        function isNullOrUndefined(value) {
            return value === void 0 || value === null;
        }
        Common.isNullOrUndefined = isNullOrUndefined;
        function getClassName(cls) {
            if (cls instanceof Function && this.isStringNullOrEmpty(cls.name) === false) {
                return cls.name;
            }
            var classString = cls.toString().trim();
            var index = classString.indexOf("(");
            return cls.name || classString.substring(9, index);
        }
        Common.getClassName = getClassName;
        function getQualifiedClassName(obj) {
            var type = typeof obj;
            if (type !== "object") {
                return type;
            }
            var prototype = obj.prototype || Object.getPrototypeOf(obj) || null;
            if (prototype === null) {
                return type;
            }
            return this.getClassName(prototype.constructor);
        }
        Common.getQualifiedClassName = getQualifiedClassName;
        function getMethodName(method, caller) {
            if (caller === void 0) { caller = null; }
            if (caller === null) {
                return this.getClassName(method);
            }
            for (var key in caller) {
                if (caller[key] === method) {
                    return key;
                }
            }
            return null;
        }
        Common.getMethodName = getMethodName;
        function trim(str) {
            if (this.isNullOrUndefined(str) === true) {
                return null;
            }
            var chrs = ["\r", "\n", "\t", " "];
            var from = 0;
            while (from < str.length) {
                var chr = str.charAt(from);
                var index = chrs.indexOf(chr);
                if (index === -1) {
                    break;
                }
                from++;
            }
            var to = str.length - 1;
            while (to > from) {
                var chr = str.charAt(to);
                var index = chrs.indexOf(chr);
                if (index === -1) {
                    break;
                }
                to--;
            }
            return str.substring(from, to + 1);
        }
        Common.trim = trim;
        function isStringNullOrEmpty(value) {
            if (typeof value === "number") {
                return isNaN(value);
            }
            if (typeof value === "string" && value !== "") {
                return false;
            }
            return true;
        }
        Common.isStringNullOrEmpty = isStringNullOrEmpty;
        function formatString(str, args) {
            var remain = str.length;
            for (var i = 0; i < args.length; i++) {
                var flag = "{" + i + "}";
                var index = str.indexOf(flag, str.length - remain);
                if (index === -1) {
                    break;
                }
                remain = str.length - index - 3;
                str = str.substr(0, index) + args[i] + str.substr(index + 3);
            }
            return str;
        }
        Common.formatString = formatString;
        function convertToDate(date) {
            if (date instanceof Date) {
                return date;
            }
            if (Mathf.isNumber(date) === true) {
                return new Date(date);
            }
            if (typeof date === "string") {
                var array = date.split(" ");
                var dates = array.length === 1 ? [] : array.shift().split("-");
                var times = array[0].split(":");
                if (times.length === 3) {
                    if (dates.length === 0) {
                        var dt = new Date();
                        dates[0] = dt.getFullYear().toString();
                        dates[1] = (dt.getMonth() + 1).toString();
                        dates[2] = dt.getDate().toString();
                    }
                    return new Date(+dates[0], +dates[1] - 1, +dates[2], +times[0], +times[1], +times[2]);
                }
                return new Date(date);
            }
            throw Error("Convert Date Error:" + date);
        }
        Common.convertToDate = convertToDate;
        function dateAdd(datepart, increment, time) {
            var date = this.convertToDate(time);
            if (datepart === "yy") {
                date.setFullYear(date.getFullYear() + increment);
            }
            else if (datepart === "MM") {
                var rem = increment % 12;
                var mul = (increment - rem) / 12;
                date.setFullYear(date.getFullYear() + mul);
                var month = date.getMonth() + rem;
                if (month > 11) {
                    date.setMonth(month - 12);
                    date.setFullYear(date.getFullYear() + 1);
                }
                else if (month < 0) {
                    date.setMonth(rem + 11);
                    date.setFullYear(date.getFullYear() - 1);
                }
                else {
                    date.setMonth(month);
                }
            }
            var timestamp = date.valueOf();
            if (datepart === "ww") {
                timestamp += increment * 7 * 24 * 3600 * 1000;
            }
            else if (datepart === "dd") {
                timestamp += increment * 24 * 3600 * 1000;
            }
            else if (datepart === "hh") {
                timestamp += increment * 3600 * 1000;
            }
            else if (datepart === "mm") {
                timestamp += increment * 60 * 1000;
            }
            else if (datepart === "ss") {
                timestamp += increment * 1000;
            }
            else if (datepart === "ms") {
                timestamp += increment;
            }
            return timestamp;
        }
        Common.dateAdd = dateAdd;
        function dateDiff(datepart, date, date2) {
            var d1 = this.convertToDate(date);
            var d2 = this.convertToDate(date2);
            var t1 = d1.valueOf();
            var t2 = d2.valueOf();
            if (datepart === "ms") {
                return t2 - t1;
            }
            t1 = Math.floor(t1 / 1000);
            t2 = Math.floor(t2 / 1000);
            if (datepart === "ss") {
                return t2 - t1;
            }
            t1 = Math.floor(t1 / 60);
            t2 = Math.floor(t2 / 60);
            if (datepart === "mm") {
                return t2 - t1;
            }
            t1 = Math.floor(t1 / 60);
            t2 = Math.floor(t2 / 60);
            if (datepart === "hh") {
                return t2 - t1;
            }
            t1 = Math.floor(t1 / 24);
            t2 = Math.floor(t2 / 24);
            if (datepart === "dd") {
                return t2 - t1;
            }
            if (datepart === "ww") {
                return Math.floor(((t2 - 4) - (t1 - 4)) / 7);
            }
            if (datepart === "MM") {
                return d2.getMonth() - d1.getMonth() + (d2.getFullYear() - d1.getFullYear()) * 12;
            }
            if (datepart === "yy") {
                return d2.getFullYear() - d1.getFullYear();
            }
            return 0;
        }
        Common.dateDiff = dateDiff;
        function formatDate(str, time) {
            var date = this.convertToDate(time);
            str = str.replace("MS", ("00" + (date.getMilliseconds()).toString()).substr(-3));
            str = str.replace("ms", (date.getMilliseconds()).toString());
            str = str.replace("yyyy", date.getFullYear().toString());
            str = str.replace("yy", date.getFullYear().toString().substr(2, 2));
            str = str.replace("MM", ("0" + (date.getMonth() + 1).toString()).substr(-2));
            str = str.replace("dd", ("0" + (date.getDate()).toString()).substr(-2));
            str = str.replace("hh", ("0" + (date.getHours()).toString()).substr(-2));
            str = str.replace("mm", ("0" + (date.getMinutes()).toString()).substr(-2));
            str = str.replace("ss", ("0" + (date.getSeconds()).toString()).substr(-2));
            str = str.replace("M", (date.getMonth() + 1).toString());
            str = str.replace("d", (date.getDate()).toString());
            str = str.replace("h", (date.getHours()).toString());
            str = str.replace("m", (date.getMinutes()).toString());
            str = str.replace("s", (date.getSeconds()).toString());
            return str;
        }
        Common.formatDate = formatDate;
        function getQueryString(name, param) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var str = param || window.location.search;
            var array = str.substr(1).match(reg) || null;
            return array === null ? null : decodeURIComponent(array[2]);
        }
        Common.getQueryString = getQueryString;
        function createHttpSign(params, key, sign) {
            if (sign === void 0) { sign = "sign"; }
            var array = [];
            for (var key_1 in params) {
                if (key_1 !== sign) {
                    array.push(key_1 + "=" + params[key_1]);
                }
            }
            array.push("key=" + key);
            return this.md5(array.join("&"));
        }
        Common.createHttpSign = createHttpSign;
        function getFileName(path) {
            var index = path.lastIndexOf("/");
            if (index > -1) {
                path = path.substr(index + 1);
            }
            var suffix = this.getFileExtension(path);
            if (suffix === null) {
                return path;
            }
            return path.substr(0, path.length - suffix.length - 1);
        }
        Common.getFileName = getFileName;
        function getFileExtension(path) {
            var index = path.lastIndexOf(".");
            if (index === -1) {
                return null;
            }
            return path.substr(index + 1).toLowerCase();
        }
        Common.getFileExtension = getFileExtension;
        function replacePathExtension(path, newExt) {
            var index = path.lastIndexOf(".");
            if (index === -1) {
                return path;
            }
            return path.substr(0, index + 1) + newExt;
        }
        Common.replacePathExtension = replacePathExtension;
        function findInArray(array, method, out) {
            if (out === void 0) { out = null; }
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                if (method(item) === true) {
                    if (out === null) {
                        return item;
                    }
                    out.push(item);
                }
            }
            return null;
        }
        Common.findInArray = findInArray;
        function removeItemFromArray(item, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === item) {
                    array.splice(i, 1);
                    break;
                }
            }
        }
        Common.removeItemFromArray = removeItemFromArray;
        function removeItemsFromArray(items, array) {
            for (var i = 0; i < items.length; i++) {
                this.removeItemFromArray(items[i], array);
            }
        }
        Common.removeItemsFromArray = removeItemsFromArray;
        function copy(data, deep) {
            if (deep === void 0) { deep = false; }
            if (data instanceof Array) {
                if (deep === false) {
                    return data.slice(0);
                }
                else {
                    var array = [];
                    for (var i = 0; i < data.length; i++) {
                        array.push(this.copy(data[i], deep));
                    }
                    return array;
                }
            }
            else if (data instanceof Object) {
                var newData = {};
                if (deep === false) {
                    for (var key in data) {
                        newData[key] = data[key];
                    }
                }
                else {
                    for (var key in data) {
                        newData[key] = this.copy(data[key], deep);
                    }
                }
                return newData;
            }
            return data;
        }
        Common.copy = copy;
        function clone(data) {
            var newData = {};
            for (var key in data) {
                var value = data[key];
                if (typeof value === "number") {
                    newData[key] = 0;
                }
                else if (typeof value === "boolean") {
                    newData[key] = false;
                }
                else if (value instanceof Array) {
                    newData[key] = [];
                }
                else if (value instanceof Object) {
                    newData[key] = null;
                }
                else {
                    throw Error("克隆意外的数据类型：" + value);
                }
            }
            return newData;
        }
        Common.clone = clone;
        function isEqual(oldData, newData, strict) {
            if (oldData === newData) {
                return true;
            }
            if (typeof oldData === "number" && typeof newData === "number" && isNaN(oldData) && isNaN(newData)) {
                return true;
            }
            if (oldData instanceof Array && newData instanceof Array && oldData.length === newData.length) {
                if (strict === false) {
                    oldData = oldData.slice();
                    newData = newData.slice();
                    oldData.sort();
                    newData.sort();
                }
                for (var i = 0; i < oldData.length; i++) {
                    if (this.isEqual(oldData[i], newData[i], strict) === false) {
                        return false;
                    }
                }
                return true;
            }
            else if (oldData instanceof Object && newData instanceof Object && Object.keys(oldData).length === Object.keys(newData).length) {
                if (strict === true && oldData.constructor !== newData.constructor) {
                    return false;
                }
                for (var key in oldData) {
                    if (oldData.hasOwnProperty(key) === true && this.isEqual(oldData[key], newData[key], strict) === false) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        Common.isEqual = isEqual;
        function toDisplayString(data) {
            if (data === void 0 || data === null) {
                return data;
            }
            if (typeof data === "number" || typeof data === "string" || typeof data === "boolean") {
                return data.toString();
            }
            var str;
            if (data instanceof Array) {
                var array = [];
                for (var i = 0; i < data.length; i++) {
                    array.push(this.toDisplayString(data[i]));
                }
                return "[" + array.join(",") + "]";
            }
            else {
                try {
                    str = JSON.stringify(data);
                }
                catch (error) {
                    str = "[" + this.getQualifiedClassName(data) + "]";
                }
            }
            return str;
        }
        Common.toDisplayString = toDisplayString;
        function compareVersion(ver) {
            if (typeof ver !== "string") {
                Logger.error(DebugMode.ANY, "参数版本号无效");
                return 0;
            }
            if (typeof Global.VERSION !== "string") {
                Logger.error(DebugMode.ANY, "版本号未设置");
                return 0;
            }
            var array = ver.split(".");
            var array2 = Global.VERSION.split(".");
            var length = Math.max(array.length, array2.length);
            for (var i = 0; i < length; i++) {
                array.length === i && array.push("0");
                array2.length === i && array2.push("0");
            }
            var error = 0;
            for (var i = 0; i < length; i++) {
                var s0 = array[i];
                var s1 = array2[i];
                if (Mathf.isNumber(s0) === false) {
                    error |= 0x01;
                }
                if (Mathf.isNumber(s1) === false) {
                    error |= 0x02;
                }
            }
            if (error & 0x1) {
                Logger.error(DebugMode.ANY, "参数版本号无效 " + ("ver:" + ver));
            }
            if (error & 0x2) {
                Logger.error(DebugMode.ANY, "当前版本号无效 " + ("ver:" + Global.VERSION));
            }
            if (error > 0) {
                return 0;
            }
            for (var i = 0; i < length; i++) {
                var reg0 = +array[i];
                var reg1 = +array2[i];
                if (reg0 < reg1) {
                    return 1;
                }
                else if (reg0 > reg1) {
                    return -1;
                }
            }
            return 0;
        }
        Common.compareVersion = compareVersion;
    })(Common = suncom.Common || (suncom.Common = {}));
    var DBService;
    (function (DBService) {
        var $id = 0;
        var $table = {};
        function get(name) {
            return $table[name];
        }
        DBService.get = get;
        function put(name, data) {
            if (name < 0) {
                $id++;
                $table["auto_" + $id] = data;
            }
            else {
                $table[name] = data;
            }
            return data;
        }
        DBService.put = put;
        function exist(name) {
            return $table[name] !== void 0;
        }
        DBService.exist = exist;
        function drop(name) {
            var data = DBService.get(name);
            delete $table[name];
            return data;
        }
        DBService.drop = drop;
    })(DBService = suncom.DBService || (suncom.DBService = {}));
    var Global;
    (function (Global) {
        Global.envMode = 0;
        Global.debugMode = 0;
        Global.WIDTH = 1280;
        Global.HEIGHT = 720;
        Global.width = 1280;
        Global.height = 720;
        Global.VERSION = "1.0.0";
        Global.dataMap = {};
    })(Global = suncom.Global || (suncom.Global = {}));
    var Logger;
    (function (Logger) {
        function log(mod, str) {
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                console.log(str);
            }
        }
        Logger.log = log;
        function warn(mod, str) {
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                console.warn(str);
            }
        }
        Logger.warn = warn;
        function error(mod, str) {
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                console.error(str);
            }
        }
        Logger.error = error;
        function log2f(mod, str) {
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                console.info(str);
            }
        }
        Logger.log2f = log2f;
    })(Logger = suncom.Logger || (suncom.Logger = {}));
    var Mathf;
    (function (Mathf) {
        Mathf.PI = Math.PI;
        Mathf.PI2 = Math.PI * 2;
        Mathf.MAX_SAFE_INTEGER = 9007199254740991;
        Mathf.MIN_SAFE_INTEGER = -9007199254740991;
        function d2r(d) {
            return d * Math.PI / 180;
        }
        Mathf.d2r = d2r;
        function r2d(a) {
            return a * 180 / Math.PI;
        }
        Mathf.r2d = r2d;
        function clamp(value, min, max) {
            if (value < min) {
                return min;
            }
            else if (value > max) {
                return max;
            }
            return value;
        }
        Mathf.clamp = clamp;
        function round(value, n) {
            if (n === void 0) { n = 0; }
            var str = value.toString();
            var dotIndex = str.indexOf(".");
            if (dotIndex === -1) {
                return value;
            }
            var integerDotLength = dotIndex + 1;
            if (str.length - integerDotLength <= n) {
                return value;
            }
            var s0 = str.substr(0, dotIndex);
            var s1 = str.substr(integerDotLength, n);
            var s2 = str.substr(integerDotLength + n, 2);
            var a = s2.length === 1 ? s2 : s2.charAt(0);
            var b = s2.length === 1 ? "0" : s2.charAt(1);
            var intValue = parseInt(s0 + s1);
            var floatValue = parseInt(a + b);
            if (intValue < 0 && floatValue > 0) {
                intValue -= 1;
                floatValue = 100 - floatValue;
            }
            var s3 = floatValue.toString();
            var reg0 = parseInt(s3.charAt(0));
            var reg1 = parseInt(s3.charAt(1));
            if (reg0 > 5) {
                intValue += 1;
            }
            else if (reg0 === 5) {
                if (reg1 > 0) {
                    intValue++;
                }
                else {
                    var modValue = intValue % 2;
                    if (modValue === 1 || modValue === -1) {
                        intValue += 1;
                    }
                }
            }
            var newValue = intValue.toString();
            var newDotIndex = newValue.length - n;
            var retValue = newValue.substr(0, newDotIndex) + "." + newValue.substr(newDotIndex);
            var retValueF = parseFloat(retValue);
            return retValueF;
        }
        Mathf.round = round;
        function random(min, max) {
            var value = Math.random() * (max - min);
            return Math.floor(value) + min;
        }
        Mathf.random = random;
        function isNumber(str) {
            if (typeof str === "number") {
                return isNaN(str) === false;
            }
            if (typeof str === "string") {
                if (str === "") {
                    return false;
                }
                return isNaN(+str) === false;
            }
            return false;
        }
        Mathf.isNumber = isNumber;
    })(Mathf = suncom.Mathf || (suncom.Mathf = {}));
    var Pool;
    (function (Pool) {
        var $pool = {};
        function getItem(sign) {
            var array = $pool[sign];
            if (array === void 0 || array.length === 0) {
                return null;
            }
            var item = array.pop();
            delete item["__suncom__$__inPool__"];
            return item;
        }
        Pool.getItem = getItem;
        function getItemByClass(sign, cls, args) {
            var item = Pool.getItem(sign);
            if (item === null) {
                if (Laya.Prefab !== void 0 && cls === Laya.Prefab) {
                    var prefab = new Laya.Prefab();
                    prefab.json = args;
                    item = prefab.create();
                }
                else {
                    item = {};
                    item.__proto__ = cls.prototype;
                    if (args instanceof Array) {
                        cls.apply(item, args);
                    }
                    else {
                        cls.call(item, args);
                    }
                }
            }
            return item;
        }
        Pool.getItemByClass = getItemByClass;
        function recover(sign, item) {
            if (item["__suncom__$__inPool__"] === true) {
                return false;
            }
            item["__suncom__$__inPool__"] = true;
            var array = $pool[sign];
            if (array === void 0) {
                $pool[sign] = [item];
            }
            else {
                array.push(item);
            }
            return true;
        }
        Pool.recover = recover;
        function clear(sign) {
            if ($pool[sign] !== void 0) {
                delete $pool[sign];
            }
        }
        Pool.clear = clear;
    })(Pool = suncom.Pool || (suncom.Pool = {}));
    var Random;
    (function (Random) {
        var $r = 1;
        var $A = 1103515245;
        var $C = 12345;
        var $M = 32767;
        function seed(value) {
            if (value < 1) {
                value = 1;
                Logger.warn(DebugMode.ANY, "\u968F\u673A\u79CD\u5B50\u4E0D\u5141\u8BB8\u5C0F\u4E8E1");
            }
            $r = value;
        }
        Random.seed = seed;
        function random() {
            var r = dcodeIO.Long.fromNumber($r);
            var A = dcodeIO.Long.fromNumber($A);
            var C = dcodeIO.Long.fromNumber($C);
            $r = Math.floor(r.mul(A).add(C).low / $M);
            return ($r % $M + $M) / ($M * 2);
        }
        Random.random = random;
    })(Random = suncom.Random || (suncom.Random = {}));
    var Test;
    (function (Test) {
        Test.ASSERT_FAILED = false;
        Test.ASSERT_BREAKPOINT = true;
        var $expect = null;
        function expect(value, description) {
            if (Global.debugMode & DebugMode.TEST) {
                return new Expect(description).expect(value);
            }
            if ($expect === null) {
                $expect = new Expect();
            }
            return $expect;
        }
        Test.expect = expect;
        function notExpected(message) {
            if (Global.debugMode & DebugMode.TEST) {
                Test.expect(true).interpret("Test.notExpected \u671F\u671B\u4E4B\u5916\u7684").toBe(false);
            }
        }
        Test.notExpected = notExpected;
        function assertTrue(value, message) {
            if (Global.debugMode & DebugMode.TEST) {
                Test.expect(value).interpret(message || "Test.assertTrue error\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(value)).toBe(true);
            }
        }
        Test.assertTrue = assertTrue;
        function assertFalse(value, message) {
            if (Global.debugMode & DebugMode.TEST) {
                Test.expect(value).interpret(message || "Test.assertFalse error\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(value)).toBe(false);
            }
        }
        Test.assertFalse = assertFalse;
    })(Test = suncom.Test || (suncom.Test = {}));
})(suncom || (suncom = {}));
//# sourceMappingURL=suncom.js.map