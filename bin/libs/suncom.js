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
    })(EnvMode = suncom.EnvMode || (suncom.EnvMode = {}));
    var EventPriorityEnum;
    (function (EventPriorityEnum) {
        EventPriorityEnum[EventPriorityEnum["LAZY"] = 0] = "LAZY";
        EventPriorityEnum[EventPriorityEnum["LOW"] = 1] = "LOW";
        EventPriorityEnum[EventPriorityEnum["MID"] = 2] = "MID";
        EventPriorityEnum[EventPriorityEnum["HIGH"] = 3] = "HIGH";
        EventPriorityEnum[EventPriorityEnum["FWL"] = 4] = "FWL";
        EventPriorityEnum[EventPriorityEnum["EGL"] = 5] = "EGL";
        EventPriorityEnum[EventPriorityEnum["OSL"] = 6] = "OSL";
    })(EventPriorityEnum = suncom.EventPriorityEnum || (suncom.EventPriorityEnum = {}));
    var EventSystem = (function () {
        function EventSystem() {
            this.$events = {};
            this.$onceList = [];
            this.$isCanceled = false;
        }
        EventSystem.prototype.dispatchCancel = function () {
            this.$isCanceled = true;
        };
        EventSystem.prototype.dispatchEvent = function (type, args, cancelable) {
            if (cancelable === void 0) { cancelable = false; }
            if (Common.isStringInvalidOrEmpty(type) === true) {
                throw Error("派发无效事件！！！");
            }
            var list = this.$events[type] || null;
            if (list === null) {
                return;
            }
            list[0] = true;
            var isCanceled = this.$isCanceled;
            this.$isCanceled = false;
            for (var i = 1; i < list.length; i++) {
                var event_1 = list[i];
                if (event_1.receiveOnce === true) {
                    this.$onceList.push(event_1);
                }
                if (args === void 0) {
                    event_1.method.call(event_1.caller);
                }
                else if (args instanceof Array) {
                    event_1.method.apply(event_1.caller, args);
                }
                else {
                    event_1.method.call(event_1.caller, args);
                }
                if (cancelable === true && this.$isCanceled) {
                    break;
                }
            }
            this.$isCanceled = isCanceled;
            list[0] = false;
            while (this.$onceList.length > 0) {
                var event_2 = this.$onceList.pop();
                this.removeEventListener(event_2.type, event_2.method, event_2.caller);
            }
        };
        EventSystem.prototype.addEventListener = function (type, method, caller, receiveOnce, priority) {
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = EventPriorityEnum.LOW; }
            if (Common.isStringInvalidOrEmpty(type) === true) {
                throw Error("注册无效事件！！！");
            }
            if (method === void 0 || method === null) {
                throw Error("\u6CE8\u518C\u65E0\u6548\u7684\u4E8B\u4EF6\u56DE\u8C03\uFF01\uFF01\uFF01");
            }
            var list = this.$events[type] || null;
            if (list === null) {
                list = this.$events[type] = [false];
            }
            else if (list[0] === true) {
                list = this.$events[type] = list.slice(0);
                list[0] = false;
            }
            var index = -1;
            for (var i = 1; i < list.length; i++) {
                var item = list[i];
                if (item.method === method && item.caller === caller) {
                    return;
                }
                if (index === -1 && item.priority < priority) {
                    index = i;
                }
            }
            var event = {
                type: type,
                method: method,
                caller: caller,
                priority: priority,
                receiveOnce: receiveOnce
            };
            if (index < 0) {
                list.push(event);
            }
            else {
                list.splice(index, 0, event);
            }
        };
        EventSystem.prototype.removeEventListener = function (type, method, caller) {
            if (Common.isStringInvalidOrEmpty(type) === true) {
                throw Error("移除无效的事件！！！");
            }
            if (method === void 0 || method === null) {
                throw Error("\u79FB\u9664\u65E0\u6548\u7684\u4E8B\u4EF6\u56DE\u8C03\uFF01\uFF01\uFF01");
            }
            var list = this.$events[type] || null;
            if (list === null) {
                return;
            }
            if (list[0] === true) {
                list = this.$events[type] = list.slice(0);
                list[0] = false;
            }
            for (var i = 0; i < list.length; i++) {
                var event_3 = list[i];
                if (event_3.method === method && event_3.caller === caller) {
                    list.splice(i, 1);
                    break;
                }
            }
            if (list.length === 1) {
                delete this.$events[type];
            }
        };
        return EventSystem;
    }());
    suncom.EventSystem = EventSystem;
    var Expect = (function () {
        function Expect(description) {
            if (description === void 0) { description = null; }
            this.$asNot = false;
            this.$interpretation = null;
            if (Global.debugMode & DebugMode.TEST) {
                description !== null && Logger.log(DebugMode.ANY, description);
            }
        }
        Expect.prototype.expect = function (value) {
            this.$value = value;
            return this;
        };
        Expect.prototype.interpret = function (str) {
            this.$interpretation = str;
            return this;
        };
        Expect.prototype.test = function (pass, message) {
            if ((this.$asNot === false && pass === false) || (this.$asNot === true && pass === true)) {
                Test.ASSERT_FAILED = true;
                message !== null && Logger.error(DebugMode.ANY, message);
                this.$interpretation !== null && Logger.error(DebugMode.ANY, this.$interpretation);
                if (Test.ASSERT_BREAKPOINT === true) {
                    debugger;
                }
                throw Error("测试失败！");
            }
        };
        Expect.prototype.anything = function () {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value !== null && this.$value !== void 0;
                var message = "\u671F\u671B\u503C" + (this.$asNot === false ? "" : "不为") + "\uFF1Anull or undefined, \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$value);
                this.test(pass, message);
            }
        };
        Expect.prototype.arrayContaining = function (array) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = true;
                for (var i = 0; i < array.length; i++) {
                    var value = array[i];
                    if (this.$value.indexOf(value) < 0) {
                        pass = false;
                        break;
                    }
                }
                var message = "\u671F\u671B" + (this.$asNot === false ? "" : "不") + "\u5305\u542B\uFF1A" + Common.toDisplayString(array) + ", \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$value);
                this.test(pass, message);
            }
        };
        Expect.prototype.stringContaining = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value.indexOf(value) > -1;
                var message = "\u671F\u671B" + (this.$asNot === false ? "" : "不") + "\u5305\u542B\uFF1A" + value + ", \u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.stringMatching = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value.indexOf(this.$value) > -1;
                var message = "\u671F\u671B" + (this.$asNot === false ? "" : "不") + "\u88AB\u5305\u542B\uFF1A" + value + ", \u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toHaveProperty = function (key, value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value === void 0 ? this.$value[key] !== void 0 : this.$value[key] === value;
                var message = "\u671F\u671B" + (this.$asNot === false ? "" : "不") + "\u5B58\u5728\u5C5E\u6027\uFF1A" + key + ", \u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBe = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value === value;
                var message = "\u671F\u671B\u503C" + (this.$asNot === false ? "" : "不为") + "\uFF1A" + Common.toDisplayString(value) + ", \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$value);
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
                var pass = typeof this.$value === "boolean";
                var message = "\u671F\u671B" + (this.$asNot === false ? "为" : "不为") + "\uFF1A\u5E03\u5C14\u7C7B\u578B, \u5B9E\u9645\u4E3A\uFF1A" + typeof this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeInstanceOf = function (cls) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value instanceof cls;
                var message = "\u671F\u671B " + Common.getQualifiedClassName(this.$value) + " \u7684\u7C7B\u578B" + (this.$asNot === false ? "" : "不") + "\u4E3A " + Common.getClassName(cls);
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeFalsy = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value ? false : true;
                var message = "\u671F\u671B " + Common.toDisplayString(value) + " " + (this.$asNot === false ? "" : "不") + "\u4E3A\u5047, \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$value);
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeTruthy = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = value ? true : false;
                var message = "\u671F\u671B " + Common.toDisplayString(value) + " " + (this.$asNot === false ? "" : "不") + "\u4E3A\u5047, \u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$value);
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeCloseTo = function (value, deviation) {
            if (deviation === void 0) { deviation = 0; }
            if (Global.debugMode & DebugMode.TEST) {
                var pass = Math.abs(this.$value - value) <= Math.abs(deviation);
                var message = "\u671F\u671B\u4E0E" + value + "\u7684\u8BEF\u5DEE" + (this.$asNot === true ? "" : "不") + "\u8D85\u8FC7" + deviation + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeGreaterThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value > value;
                var message = "\u671F\u671B" + (this.$asNot === true ? "" : "不") + "\u5927\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeGreaterOrEqualThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value >= value;
                var message = "\u671F\u671B" + (this.$asNot === true ? "" : "不") + "\u5927\u4E8E\u7B49\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeLessThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value < value;
                var message = "\u671F\u671B" + (this.$asNot === true ? "" : "不") + "\u5C0F\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toBeLessOrEqualThan = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = this.$value <= value;
                var message = "\u671F\u671B" + (this.$asNot === true ? "" : "不") + "\u5C0F\u4E8E\u7B49\u4E8E " + value + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + this.$value;
                this.test(pass, message);
            }
        };
        Expect.prototype.toEqual = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = Common.isEqual(this.$value, value, false);
                var message = "\u671F\u671B\u76F8\u7B49\uFF1A" + Common.toDisplayString(value) + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$value);
                this.test(pass, message);
            }
        };
        Expect.prototype.toStrictEqual = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                var pass = Common.isEqual(this.$value, value, true);
                var message = "\u671F\u671B\u76F8\u7B49\uFF1A" + Common.toDisplayString(value) + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(this.$value);
                this.test(pass, message);
            }
        };
        Object.defineProperty(Expect.prototype, "not", {
            get: function () {
                this.$asNot = true;
                return this;
            },
            enumerable: true,
            configurable: true
        });
        return Expect;
    }());
    suncom.Expect = Expect;
    var Handler = (function () {
        function Handler(caller, method, args) {
            this.$args = args;
            this.$caller = caller;
            this.$method = method;
        }
        Handler.prototype.run = function () {
            if (this.$args === void 0) {
                return this.$method.call(this.$caller);
            }
            return this.$method.apply(this.$caller, this.$args);
        };
        Handler.prototype.runWith = function (args) {
            if (this.$args === void 0) {
                if (args instanceof Array) {
                    return this.$method.apply(this.$caller, args);
                }
                return this.$method.call(this.$caller, args);
            }
            return this.$method.apply(this.$caller, this.$args.concat(args));
        };
        Object.defineProperty(Handler.prototype, "caller", {
            get: function () {
                return this.$caller;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Handler.prototype, "method", {
            get: function () {
                return this.$method;
            },
            enumerable: true,
            configurable: true
        });
        Handler.create = function (caller, method, args) {
            return new Handler(caller, method, args);
        };
        return Handler;
    }());
    suncom.Handler = Handler;
    var HashMap = (function () {
        function HashMap(primaryKey) {
            this.source = [];
            this.dataMap = {};
            if (typeof primaryKey !== "string") {
                throw Error("\u975E\u6CD5\u7684\u4E3B\u952E\u5B57\u6BB5\u540D\uFF1A" + primaryKey);
            }
            if (primaryKey.length === 0) {
                throw Error("\u65E0\u6548\u7684\u4E3B\u952E\u5B57\u6BB5\u540D\u5B57\u957F\u5EA6\uFF1A" + primaryKey.length);
            }
            this.$primaryKey = primaryKey;
        }
        HashMap.prototype.$removeByIndex = function (index) {
            var data = this.source[index];
            this.source.splice(index, 1);
            var value = data[this.$primaryKey];
            delete this.dataMap[value];
            return data;
        };
        HashMap.prototype.$getIndexByValue = function (key, value) {
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
        HashMap.prototype.put = function (data) {
            var value = data[this.$primaryKey];
            if (Common.isStringInvalidOrEmpty(value) === true) {
                throw Error("\u65E0\u6548\u7684\u4E3B\u952E\u7684\u503C\uFF0Ctype:" + typeof value + ", value:" + value);
            }
            if (this.getByPrimaryValue(value) === null) {
                this.source.push(data);
                this.dataMap[value] = data;
            }
            else {
                throw Error("\u91CD\u590D\u7684\u4E3B\u952E\u503C\uFF1A[" + this.$primaryKey + "]" + value);
            }
            return data;
        };
        HashMap.prototype.getByValue = function (key, value) {
            if (key === this.$primaryKey) {
                return this.getByPrimaryValue(value);
            }
            var index = this.$getIndexByValue(key, value);
            if (index === -1) {
                return null;
            }
            return this.source[index];
        };
        HashMap.prototype.getByPrimaryValue = function (value) {
            return this.dataMap[value.toString()] || null;
        };
        HashMap.prototype.remove = function (data) {
            var index = this.source.indexOf(data);
            if (index === -1) {
                return data;
            }
            return this.$removeByIndex(index);
        };
        HashMap.prototype.removeByValue = function (key, value) {
            if (key === this.$primaryKey) {
                return this.removeByPrimaryValue(value);
            }
            var index = this.$getIndexByValue(key, value);
            if (index === -1) {
                return null;
            }
            return this.$removeByIndex(index);
        };
        HashMap.prototype.removeByPrimaryValue = function (value) {
            var data = this.getByPrimaryValue(value);
            if (data === null) {
                return null;
            }
            return this.remove(data);
        };
        HashMap.prototype.forEach = function (method) {
            for (var i = 0; i < this.source.length; i++) {
                if (method(this.source[i]) === true) {
                    break;
                }
            }
        };
        return HashMap;
    }());
    suncom.HashMap = HashMap;
    var Common;
    (function (Common) {
        Common.PI = Math.PI;
        Common.PI2 = Math.PI * 2;
        Common.MAX_SAFE_INTEGER = 9007199254740991;
        Common.MIN_SAFE_INTEGER = -9007199254740991;
        var $hashId = 0;
        function createHashId() {
            $hashId++;
            return $hashId;
        }
        Common.createHashId = createHashId;
        function getClassName(cls) {
            var classString = cls.toString().trim();
            var index = classString.indexOf("(");
            return classString.substring(9, index);
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
            return Common.getClassName(prototype.constructor);
        }
        Common.getQualifiedClassName = getQualifiedClassName;
        function getMethodName(method, caller) {
            if (caller === void 0) { caller = null; }
            if (caller === null) {
                return Common.getClassName(method);
            }
            for (var key in caller) {
                if (caller[key] === method) {
                    return key;
                }
            }
            return null;
        }
        Common.getMethodName = getMethodName;
        function convertEnumToString(value, oEnum) {
            for (var key in oEnum) {
                if (oEnum[key] === value) {
                    return key;
                }
            }
            return null;
        }
        Common.convertEnumToString = convertEnumToString;
        function isNumber(str) {
            if (typeof str === "number") {
                return true;
            }
            if (typeof str === "string" && isNaN(Number(str)) === false) {
                return true;
            }
            return false;
        }
        Common.isNumber = isNumber;
        function isStringInvalidOrEmpty(str) {
            if (typeof str === "number") {
                return false;
            }
            if (typeof str === "string" && str !== "") {
                return false;
            }
            return true;
        }
        Common.isStringInvalidOrEmpty = isStringInvalidOrEmpty;
        function formatString(str, args) {
            var signs = ["%d", "%s"];
            var index = 0;
            while (args.length > 0) {
                var key = null;
                var indexOfReplace = -1;
                for (var i = 0; i < signs.length; i++) {
                    var sign = signs[i];
                    var indexOfSign = str.indexOf(sign, index);
                    if (indexOfSign === -1) {
                        continue;
                    }
                    if (indexOfReplace === -1 || indexOfSign < indexOfReplace) {
                        key = sign;
                        indexOfReplace = indexOfSign;
                    }
                }
                if (indexOfReplace === -1) {
                    Logger.warn(DebugMode.ANY, "\u5B57\u7B26\u4E32\u66FF\u6362\u672A\u5B8C\u6210 str:" + str);
                    break;
                }
                var suffix = str.substr(indexOfReplace + key.length);
                str = str.substr(0, indexOfReplace) + args.shift() + suffix;
                index = str.length - suffix.length;
            }
            return str;
        }
        Common.formatString = formatString;
        function formatString$(str, args) {
            var index = 0;
            while (args.length > 0) {
                var indexOfSign = str.indexOf("{$}", index);
                if (index === -1) {
                    Logger.warn(DebugMode.ANY, "\u5B57\u7B26\u4E32\u66FF\u6362\u672A\u5B8C\u6210 str:" + str);
                    break;
                }
                var suffix = str.substr(indexOfSign + 3);
                str = str.substr(0, indexOfSign) + args.shift() + suffix;
                index = str.length - suffix.length;
            }
            return str;
        }
        Common.formatString$ = formatString$;
        function d2r(d) {
            return d * Math.PI / 180;
        }
        Common.d2r = d2r;
        function r2d(a) {
            return a * 180 / Math.PI;
        }
        Common.r2d = r2d;
        function abs(a) {
            if (a < 0) {
                return -a;
            }
            else {
                return a;
            }
        }
        Common.abs = abs;
        function min(a, b) {
            if (a < b) {
                return a;
            }
            else {
                return b;
            }
        }
        Common.min = min;
        function max(a, b) {
            if (a > b) {
                return a;
            }
            else {
                return b;
            }
        }
        Common.max = max;
        function clamp(value, min, max) {
            if (value < min) {
                return min;
            }
            else if (value > max) {
                return max;
            }
            return value;
        }
        Common.clamp = clamp;
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
        Common.round = round;
        function $round(value, n) {
            if (n === void 0) { n = 0; }
            Logger.warn(DebugMode.ANY, "\u6B64\u63A5\u53E3\u5DF1\u5F03\u7528\uFF1Asuncom.Common.$round(value: number, n: number = 0);");
            var tmpValue = Math.floor(value * Math.pow(10, n + 2));
            var floatValue = tmpValue % 100;
            var intValue = (tmpValue - floatValue) / 100;
            if (floatValue < 0 && floatValue > 0) {
                intValue -= 1;
                floatValue += 100;
            }
            var a = floatValue % 10;
            var b = (floatValue - a) / 10;
            if (b > 5) {
                intValue += 1;
            }
            else if (b === 5) {
                var modValue = a % 2;
                if (modValue === 1 || modValue === -1) {
                    intValue += 1;
                }
            }
            return intValue / Math.pow(10, n);
        }
        Common.$round = $round;
        function random(min, max) {
            var value = Random.random() * (max - min);
            return Math.floor(value) + min;
        }
        Common.random = random;
        function convertToDate(date) {
            if (date instanceof Date) {
                return date;
            }
            if (Common.isNumber(date) === true) {
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
                    return new Date(Number(dates[0]), Number(dates[1]) - 1, Number(dates[2]), Number(times[0]), Number(times[1]), Number(times[2]));
                }
                return new Date(date);
            }
            throw Error("Convert Date Error:" + date);
        }
        Common.convertToDate = convertToDate;
        function dateAdd(datepart, increment, time) {
            var date = Common.convertToDate(time);
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
            var d1 = Common.convertToDate(date);
            var d2 = Common.convertToDate(date2);
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
            var date = Common.convertToDate(time);
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
        function md5(str) {
            throw Error("未实现的接口！！！");
        }
        Common.md5 = md5;
        function createHttpSign(params, key, sign) {
            if (sign === void 0) { sign = "sign"; }
            var array = [];
            for (var key_1 in params) {
                if (key_1 !== sign) {
                    array.push(key_1 + "=" + params[key_1]);
                }
            }
            array.push("key=" + key);
            return Common.md5(array.join("&"));
        }
        Common.createHttpSign = createHttpSign;
        function getFileName(path) {
            var index = path.lastIndexOf("/");
            if (index > -1) {
                path = path.substr(index + 1);
            }
            var suffix = Common.getFileExtension(path);
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
        function findFromArray(array, method, out) {
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
        Common.findFromArray = findFromArray;
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
                Common.removeItemFromArray(items[i], array);
            }
        }
        Common.removeItemsFromArray = removeItemsFromArray;
        function createPrefab(json) {
            var prefab = new Laya.Prefab();
            prefab.json = Laya.loader.getRes(json);
            return prefab.create();
        }
        Common.createPrefab = createPrefab;
        function copy(data, deep) {
            if (deep === void 0) { deep = false; }
            if (data instanceof Array) {
                if (deep === false) {
                    return data.slice(0);
                }
                else {
                    var array = [];
                    for (var i = 0; i < data.length; i++) {
                        array.push(Common.copy(data[i], deep));
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
                        newData[key] = Common.copy(data[key], deep);
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
                    throw Error("\u514B\u9686\u610F\u5916\u7684\u6570\u636E\u7C7B\u578B\uFF1A" + value);
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
                    if (Common.isEqual(oldData[i], newData[i], strict) === false) {
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
                    if (oldData.hasOwnProperty(key) === true && Common.isEqual(oldData[key], newData[key], strict) === false) {
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
                    array.push(Common.toDisplayString(data[i]));
                }
                return "[" + array.join(",") + "]";
            }
            else {
                try {
                    str = JSON.stringify(data);
                }
                catch (error) {
                    str = "[" + Common.getQualifiedClassName(data) + "]";
                }
            }
            return str;
        }
        Common.toDisplayString = toDisplayString;
        function compareVersion(ver) {
            if (typeof ver !== "string") {
                Logger.error(DebugMode.ANY, "\u53C2\u6570\u7248\u672C\u53F7\u65E0\u6548");
                return 0;
            }
            if (typeof Global.VERSION !== "string") {
                Logger.error(DebugMode.ANY, "\u7248\u672C\u53F7\u672A\u8BBE\u7F6E");
                return 0;
            }
            var array = ver.split(".");
            var array2 = Global.VERSION.split(".");
            var length = array.length > array2.length ? array.length : array2.length;
            while (array.length < length) {
                array.push("0");
            }
            while (array2.length < length) {
                array2.push("0");
            }
            var error = 0;
            for (var i = 0; i < length; i++) {
                var s0 = array[i];
                var s1 = array2[i];
                if (Common.isNumber(s0) === false) {
                    error |= 0x01;
                    array[i] = "0";
                }
                if (Common.isNumber(s1) === false) {
                    error |= 0x02;
                    array2[i] = "0";
                }
            }
            if (error & 0x1) {
                Logger.error(DebugMode.ANY, "\u53C2\u6570\u7248\u672C\u53F7\u65E0\u6548 ver:" + ver);
            }
            if (error & 0x2) {
                Logger.error(DebugMode.ANY, "\u5F53\u524D\u7248\u672C\u53F7\u65E0\u6548 ver:" + Global.VERSION);
            }
            if (error > 0) {
                return 0;
            }
            for (var i = 0; i < length; i++) {
                var reg0 = Number(array[i]);
                var reg1 = Number(array2[i]);
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
        DBService.$table = {};
        function get(name) {
            return DBService.$table[name.toString()];
        }
        DBService.get = get;
        function put(name, data) {
            if (name < 0) {
                $id++;
                DBService.$table["auto_" + $id] = data;
            }
            else {
                DBService.$table[name.toString()] = data;
            }
            return data;
        }
        DBService.put = put;
        function exist(name) {
            return DBService.$table[name.toString()] !== void 0;
        }
        DBService.exist = exist;
        function drop(name) {
            delete DBService.$table[name.toString()];
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
    })(Global = suncom.Global || (suncom.Global = {}));
    var Logger;
    (function (Logger) {
        Logger.NUM_OF_BLOCK = 200;
        Logger.LINES_OF_BLOCK = 200;
        var $messages = [];
        Logger.locked = false;
        function $addLine(line) {
            if (Logger.locked === false && $messages.length > Logger.NUM_OF_BLOCK) {
                $messages.shift();
            }
            var lines = null;
            var length = $messages.length;
            if (length > 0) {
                lines = $messages[length - 1];
                if (lines.length === Logger.LINES_OF_BLOCK) {
                    lines = null;
                }
            }
            if (lines === null) {
                lines = [];
                $messages.push(lines);
            }
            lines.push(line);
        }
        function getDebugString(index, length) {
            if (index < 0) {
                length += index;
                index = 0;
            }
            var lineIndex = index % Logger.LINES_OF_BLOCK;
            var groupIndex = (index - lineIndex) / Logger.LINES_OF_BLOCK;
            var lines = [];
            for (var i = 0; i < length; i++) {
                if (groupIndex < $messages.length) {
                    var array = $messages[groupIndex];
                    if (lineIndex < array.length) {
                        lines.push(array[lineIndex]);
                    }
                    lineIndex++;
                    if (lineIndex === array.length) {
                        lineIndex = 0;
                        groupIndex++;
                    }
                }
                else {
                    break;
                }
            }
            return lines;
        }
        Logger.getDebugString = getDebugString;
        function getNumOfLines() {
            var length = 0;
            for (var i = 0; i < $messages.length; i++) {
                length += $messages[i].length;
            }
            return length;
        }
        Logger.getNumOfLines = getNumOfLines;
        function log(mod) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                var str = args.join(" ");
                console.log(str);
                $addLine(str);
            }
        }
        Logger.log = log;
        function warn(mod) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                var str = args.join(" ");
                console.warn(str);
                $addLine(str);
            }
        }
        Logger.warn = warn;
        function error(mod) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                var str = args.join(" ");
                console.error(str);
                $addLine(str);
            }
        }
        Logger.error = error;
        function log2f(mod) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                var str = args.join(" ");
                console.info(str);
                $addLine(str);
            }
        }
        Logger.log2f = log2f;
        function trace(mod) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                var str = args.join(" ");
                console.trace(str);
            }
        }
        Logger.trace = trace;
    })(Logger = suncom.Logger || (suncom.Logger = {}));
    var Pool;
    (function (Pool) {
        var $pool = {};
        function getItem(sign) {
            var array = $pool[sign] || null;
            if (array === null || array.length === 0) {
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
                    item = Common.createPrefab(args);
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
                return;
            }
            item["__suncom__$__inPool__"] = true;
            var array = $pool[sign] || null;
            if (array === null) {
                $pool[sign] = [item];
            }
            else {
                array.push(item);
            }
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
                throw Error("随机种子不允许小于1");
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
                suncom.Test.expect(true).interpret("Test.notExpected \u671F\u671B\u4E4B\u5916\u7684").toBe(false);
            }
        }
        Test.notExpected = notExpected;
        function assertTrue(value, message) {
            if (Global.debugMode & DebugMode.TEST) {
                suncom.Test.expect(value).interpret(message || "Test.assertTrue error\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(value)).toBe(true);
            }
        }
        Test.assertTrue = assertTrue;
        function assertFalse(value, message) {
            if (Global.debugMode & DebugMode.TEST) {
                suncom.Test.expect(value).interpret(message || "Test.assertFalse error\uFF0C\u5B9E\u9645\u503C\uFF1A" + Common.toDisplayString(value)).toBe(false);
            }
        }
        Test.assertFalse = assertFalse;
    })(Test = suncom.Test || (suncom.Test = {}));
})(suncom || (suncom = {}));
