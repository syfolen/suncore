var suncom;
(function (suncom) {
    var DebugMode;
    (function (DebugMode) {
        DebugMode[DebugMode["ANY"] = 1] = "ANY";
        DebugMode[DebugMode["TEST"] = 2] = "TEST";
        DebugMode[DebugMode["DEBUG"] = 4] = "DEBUG";
        DebugMode[DebugMode["ENGINEER"] = 8] = "ENGINEER";
        DebugMode[DebugMode["ENGINE"] = 16] = "ENGINE";
        DebugMode[DebugMode["NATIVE"] = 32] = "NATIVE";
        DebugMode[DebugMode["NETWORK"] = 64] = "NETWORK";
        DebugMode[DebugMode["NETWORK_HEARTBEAT"] = 128] = "NETWORK_HEARTBEAT";
        DebugMode[DebugMode["NORMAL"] = 256] = "NORMAL";
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
    var LogTypeEnum;
    (function (LogTypeEnum) {
        LogTypeEnum[LogTypeEnum["VERBOSE"] = 0] = "VERBOSE";
        LogTypeEnum[LogTypeEnum["WARN"] = 1] = "WARN";
        LogTypeEnum[LogTypeEnum["ERROR"] = 2] = "ERROR";
        LogTypeEnum[LogTypeEnum["LOG2F"] = 3] = "LOG2F";
    })(LogTypeEnum = suncom.LogTypeEnum || (suncom.LogTypeEnum = {}));
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
            if (list === null || list.length === 1) {
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
                throw Error("移除无效事件！！！");
            }
            var list = this.$events[type] || null;
            if (list === null || list.length === 1) {
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
        function Expect() {
        }
        Expect.prototype.expect = function (value) {
            this.$value = value;
            return this;
        };
        Expect.prototype.toBe = function (value) {
            if (Global.debugMode & DebugMode.TEST) {
                if (this.$value !== value) {
                    Test.ASSERT_FAILED = true;
                    suncom.Logger.error(DebugMode.ANY, "\u671F\u671B\u503C\uFF1A" + Test.convertToDisplayString(value) + ", \u5F53\u524D\u503C\uFF1A" + Test.convertToDisplayString(this.$value));
                    if (Test.ASSERT_BREAKPOINT === true) {
                        debugger;
                    }
                }
            }
        };
        Expect.prototype.toBeNull = function () {
            this.toBe(null);
        };
        Expect.prototype.toBeNotNull = function () {
            if (Global.debugMode & DebugMode.TEST) {
                if (this.$value === null) {
                    Test.ASSERT_FAILED = true;
                    suncom.Logger.error(DebugMode.ANY, Test.convertToDisplayString(this.$value) + " \u5E94\u5F53\u4E3A\u4E0D\u4E3Anull");
                    if (Test.ASSERT_BREAKPOINT === true) {
                        debugger;
                    }
                }
            }
        };
        Expect.prototype.toBeUndefined = function () {
            this.toBe(void 0);
        };
        Expect.prototype.toBeInstanceOf = function (cls) {
            if (Global.debugMode & DebugMode.TEST) {
                if (this.$value instanceof cls === false) {
                    Test.ASSERT_FAILED = true;
                    suncom.Logger.error(DebugMode.ANY, Test.convertToDisplayString(this.$value) + " \u5E94\u5F53\u4E3A " + Common.getClassName(cls) + " \u7684\u5B50\u7C7B");
                    if (Test.ASSERT_BREAKPOINT === true) {
                        debugger;
                    }
                }
            }
        };
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
            else {
                return this.$method.apply(this.$caller, this.$args);
            }
        };
        Handler.prototype.runWith = function (args) {
            if (this.$args === void 0) {
                if (args instanceof Array) {
                    return this.$method.apply(this.$caller, args);
                }
                else {
                    return this.$method.call(this.$caller, args);
                }
            }
            else {
                return this.$method.apply(this.$caller, this.$args.concat(args));
            }
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
            if (typeof primaryKey === "number") {
                primaryKey = primaryKey.toString();
            }
            if (typeof primaryKey !== "string") {
                throw Error("\u975E\u6CD5\u7684\u4E3B\u952E\u5B57\u6BB5\u540D\uFF1A" + primaryKey);
            }
            if (primaryKey.length == 0) {
                throw Error("\u65E0\u6548\u7684\u4E3B\u952E\u5B57\u6BB5\u540D\u5B57\u957F\u5EA6\uFF1A" + primaryKey.length);
            }
            else {
                this.$primaryKey = primaryKey;
            }
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
            if (typeof value === "number") {
                value = value.toString();
            }
            if (typeof value !== "string") {
                throw Error("\u4E3B\u952E\u7684\u503C\u7C7B\u578B\u9519\u8BEF\uFF1A" + typeof value + "\uFF0C\u53EA\u5141\u8BB8\u4F7F\u7528Number\u6216String\u7C7B\u578B");
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
        HashMap.prototype.remove = function (data) {
            var index = this.source.indexOf(data);
            if (index === -1) {
                return data;
            }
            else {
                return this.$removeByIndex(index);
            }
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
            return this.dataMap[value] || null;
        };
        HashMap.prototype.removeByValue = function (key, value) {
            var index = this.$getIndexByValue(key, value);
            if (index === -1) {
                return null;
            }
            else {
                return this.$removeByIndex(index);
            }
        };
        HashMap.prototype.removeByPrimaryValue = function (value) {
            var data = this.getByPrimaryValue(value);
            if (data === null) {
                return null;
            }
            return this.remove(data);
        };
        HashMap.prototype.forEach = function (method) {
            var source = this.source.slice(0);
            for (var i = 0; i < source.length; i++) {
                if (method(source[i]) === true) {
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
            var keys = Object.keys(oEnum);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
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
                    throw Error("\u5B57\u7B26\u4E32\u66FF\u6362\u672A\u5B8C\u6210 str:" + str);
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
                    throw Error("\u5B57\u7B26\u4E32\u66FF\u6362\u672A\u5B8C\u6210 str:" + str);
                }
                var suffix = str.substr(indexOfSign + 3);
                str = str.substr(0, indexOfSign) + args.shift() + suffix;
                index = str.length - suffix.length;
            }
            return str;
        }
        Common.formatString$ = formatString$;
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
                        var a = new Date();
                        dates[0] = a.getFullYear().toString();
                        dates[1] = (a.getMonth() + 1).toString();
                        dates[2] = a.getDate().toString();
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
            else {
                return path.substr(index + 1).toLowerCase();
            }
        }
        Common.getFileExtension = getFileExtension;
        function replacePathExtension(path, newExt) {
            var index = path.lastIndexOf(".");
            if (index === -1) {
                return path;
            }
            else {
                return path.substr(0, index + 1) + newExt;
            }
        }
        Common.replacePathExtension = replacePathExtension;
        function createHttpSign(params, key, sign) {
            if (sign === void 0) { sign = "sign"; }
            var keys = Object.keys(params).sort();
            var array = [];
            for (var i = 0; i < keys.length; i++) {
                var key_1 = keys[i];
                if (key_1 !== sign) {
                    array.push(key_1 + "=" + params[key_1]);
                }
            }
            array.push("key=" + key);
            return Common.md5(array.join("&"));
        }
        Common.createHttpSign = createHttpSign;
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
            return out;
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
            return DBService.$table[name];
        }
        DBService.get = get;
        function put(name, data) {
            if (name > -1) {
                DBService.$table[name.toString()] = data;
            }
            else {
                $id++;
                DBService.$table["auto_" + $id] = data;
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
        Global.envMode = EnvMode.DEVELOP;
        Global.debugMode = DebugMode.TEST;
        Global.WIDTH = 1280;
        Global.HEIGHT = 720;
        Global.width = 1280;
        Global.height = 720;
        Global.VERSION = "1.0.0";
    })(Global = suncom.Global || (suncom.Global = {}));
    var Logger;
    (function (Logger) {
        function log(mod) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Global.debugMode > 0 && (mod === DebugMode.ANY || (Global.debugMode & mod) === mod)) {
                var str = args.join(" ");
                console.log(str);
                if (Global.debugMode === DebugMode.DEBUG) {
                    puremvc.Facade.getInstance().sendNotification(NotifyKey.DEBUG_PRINT, [LogTypeEnum.VERBOSE, str]);
                }
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
                if (Global.debugMode === DebugMode.DEBUG) {
                    puremvc.Facade.getInstance().sendNotification(NotifyKey.DEBUG_PRINT, [LogTypeEnum.WARN, str]);
                }
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
                if (Global.debugMode === DebugMode.DEBUG) {
                    puremvc.Facade.getInstance().sendNotification(NotifyKey.DEBUG_PRINT, [LogTypeEnum.ERROR, str]);
                }
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
                if (Global.debugMode === DebugMode.DEBUG) {
                    puremvc.Facade.getInstance().sendNotification(NotifyKey.DEBUG_PRINT, [LogTypeEnum.LOG2F, str]);
                }
            }
        }
        Logger.log2f = log2f;
    })(Logger = suncom.Logger || (suncom.Logger = {}));
    var NotifyKey;
    (function (NotifyKey) {
        NotifyKey.DEBUG_PRINT = "suncom.NotifyKey.DEBUG_PRINT";
    })(NotifyKey = suncom.NotifyKey || (suncom.NotifyKey = {}));
    var Pool;
    (function (Pool) {
        var $pool = {};
        function getItem(sign) {
            var array = $pool[sign] || null;
            if (array !== null && array.length > 0) {
                var item = array.pop();
                delete item["__suncom__$__inPool__"];
                return item;
            }
            return null;
        }
        Pool.getItem = getItem;
        function getItemByClass(sign, cls, args) {
            var item = Pool.getItem(sign);
            if (item === null) {
                if (Laya.Prefab !== void 0 && cls === Laya.Prefab) {
                    var prefab = new Laya.Prefab();
                    prefab.json = Laya.Loader.getRes(args[0]);
                    item = prefab.create();
                }
                else {
                    item = {};
                    item.__proto__ = cls.prototype;
                    if (args === void 0) {
                        cls.call(item);
                    }
                    else if (args instanceof Array === false) {
                        cls.call(item, args);
                    }
                    else {
                        cls.apply(item, args);
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
        function expect(value) {
            return new Expect().expect(value);
        }
        Test.expect = expect;
        function assertTrue(value, msg) {
            if (msg === void 0) { msg = null; }
            if (Global.debugMode & DebugMode.TEST) {
                if (value !== true) {
                    Test.ASSERT_FAILED = true;
                    suncom.Logger.error(DebugMode.ANY, "Test.assertTrue \u6267\u884C\u5931\u8D25\uFF0C\u5F53\u524D\u503C\uFF1A" + Test.convertToDisplayString(value));
                    msg !== null && suncom.Logger.error(DebugMode.ANY, msg);
                    if (Test.ASSERT_BREAKPOINT === true) {
                        debugger;
                    }
                }
            }
        }
        Test.assertTrue = assertTrue;
        function assertFalse(value, msg) {
            if (msg === void 0) { msg = null; }
            if (Global.debugMode & DebugMode.TEST) {
                if (value !== false) {
                    Test.ASSERT_FAILED = true;
                    suncom.Logger.error(DebugMode.ANY, "Test.assertFalse \u6267\u884C\u5931\u8D25\uFF0C\u5F53\u524D\u503C\uFF1A" + Test.convertToDisplayString(value));
                    msg !== null && suncom.Logger.error(DebugMode.ANY, msg);
                    if (Test.ASSERT_BREAKPOINT === true) {
                        debugger;
                    }
                }
            }
        }
        Test.assertFalse = assertFalse;
        function assertEquals(a, b, msg) {
            if (msg === void 0) { msg = null; }
            if (Global.debugMode & DebugMode.TEST) {
                if (a instanceof Array && b instanceof Array) {
                    a = a.slice(0);
                    b = b.slice(0);
                    a.sort();
                    b.sort();
                    if (a.length === b.length) {
                        for (var i = 0; i < a.length; i++) {
                            if (a[i] === b[i]) {
                                continue;
                            }
                            Test.ASSERT_FAILED = true;
                        }
                    }
                    else {
                        Test.ASSERT_FAILED = true;
                    }
                }
                else if (a instanceof Array || b instanceof Array) {
                    Test.ASSERT_FAILED = true;
                }
                else if (a !== b) {
                    Test.ASSERT_FAILED = true;
                }
                if (Test.ASSERT_FAILED === true) {
                    suncom.Logger.error(DebugMode.ANY, "Test.assertEquals \u671F\u671B\u503C\uFF1A" + Test.convertToDisplayString(a) + "\uFF0C\u5B9E\u9645\u503C\uFF1A" + Test.convertToDisplayString(b));
                    msg !== null && suncom.Logger.error(DebugMode.ANY, msg);
                    if (Test.ASSERT_BREAKPOINT === true) {
                        debugger;
                    }
                }
            }
        }
        Test.assertEquals = assertEquals;
        function convertToDisplayString(data) {
            if (data === void 0 || data === null) {
                return data;
            }
            var str;
            if (data instanceof Array) {
                str = "[" + data.join(",") + "]";
            }
            else {
                try {
                    str = JSON.stringify(data);
                }
                catch (error) {
                    str = data.toString();
                }
            }
            return str;
        }
        Test.convertToDisplayString = convertToDisplayString;
    })(Test = suncom.Test || (suncom.Test = {}));
})(suncom || (suncom = {}));