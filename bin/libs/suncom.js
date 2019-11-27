var suncom;
(function (suncom) {
    var DebugMode;
    (function (DebugMode) {
        DebugMode[DebugMode["DEBUG"] = 1] = "DEBUG";
        DebugMode[DebugMode["ENGINEER"] = 2] = "ENGINEER";
        DebugMode[DebugMode["ENGINE"] = 4] = "ENGINE";
        DebugMode[DebugMode["NATIVE"] = 8] = "NATIVE";
        DebugMode[DebugMode["NETWORK"] = 16] = "NETWORK";
        DebugMode[DebugMode["NETWORK_HEARTBEAT"] = 32] = "NETWORK_HEARTBEAT";
        DebugMode[DebugMode["NORMAL"] = 64] = "NORMAL";
    })(DebugMode = suncom.DebugMode || (suncom.DebugMode = {}));
    var EnvMode;
    (function (EnvMode) {
        EnvMode[EnvMode["SIMULATOR"] = 0] = "SIMULATOR";
    })(EnvMode = suncom.EnvMode || (suncom.EnvMode = {}));
    var Dictionary = (function () {
        function Dictionary(primaryKey) {
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
        Dictionary.prototype.$removeByIndex = function (index) {
            var data = this.source[index];
            this.source.splice(index, 1);
            var value = data[this.$primaryKey];
            delete this.dataMap[value];
            return data;
        };
        Dictionary.prototype.$getIndexByValue = function (key, value) {
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
        Dictionary.prototype.remove = function (data) {
            var index = this.source.indexOf(data);
            if (index === -1) {
                return data;
            }
            else {
                return this.$removeByIndex(index);
            }
        };
        Dictionary.prototype.getByValue = function (key, value) {
            if (key === this.$primaryKey) {
                return this.getByPrimaryValue(value);
            }
            var index = this.$getIndexByValue(key, value);
            if (index === -1) {
                return null;
            }
            return this.source[index];
        };
        Dictionary.prototype.getByPrimaryValue = function (value) {
            return this.dataMap[value] || null;
        };
        Dictionary.prototype.removeByValue = function (key, value) {
            var index = this.$getIndexByValue(key, value);
            if (index === -1) {
                return null;
            }
            else {
                return this.$removeByIndex(index);
            }
        };
        Dictionary.prototype.removeByPrimaryValue = function (value) {
            var data = this.getByPrimaryValue(value);
            if (data === null) {
                return null;
            }
            return this.remove(data);
        };
        Dictionary.prototype.forEach = function (method) {
            var source = this.source.slice(0);
            for (var i = 0; i < source.length; i++) {
                if (method(source[i]) === true) {
                    break;
                }
            }
        };
        return Dictionary;
    }());
    suncom.Dictionary = Dictionary;
    var EventInfo = (function () {
        function EventInfo() {
        }
        return EventInfo;
    }());
    suncom.EventInfo = EventInfo;
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
            if (list.length === 1) {
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
            while (this.$onceList.length) {
                var event_2 = this.$onceList.pop();
                this.removeEventListener(event_2.type, event_2.method, event_2.caller);
            }
        };
        EventSystem.prototype.addEventListener = function (type, method, caller, receiveOnce, priority) {
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = 1; }
            if (Common.isStringInvalidOrEmpty(type) === true) {
                throw Error("注册无效事件！！！");
            }
            var list = this.$events[type] || null;
            if (list === null) {
                list = this.$events[type] = [false];
            }
            else if (list[0] === true) {
                list = this.$events[type] = list.concat();
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
            var event = new EventInfo();
            event.type = type;
            event.method = method;
            event.caller = caller;
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
            if (Common.isStringInvalidOrEmpty(type) === true) {
                throw Error("移除无效事件！！！");
            }
            var list = this.$events[type] || null;
            if (list === null) {
                return;
            }
            if (list.length === 1) {
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
    var Global = (function () {
        function Global() {
        }
        Global.envMode = EnvMode.SIMULATOR;
        Global.debugMode = DebugMode.NORMAL | DebugMode.NATIVE | DebugMode.NETWORK | DebugMode.NETWORK_HEARTBEAT | DebugMode.ENGINE | DebugMode.ENGINEER | DebugMode.DEBUG;
        Global.WIDTH = 1280;
        Global.HEIGHT = 720;
        Global.width = 1280;
        Global.height = 720;
        Global.VERSION = "1.0.0";
        return Global;
    }());
    suncom.Global = Global;
    var Handler = (function () {
        function Handler(caller, method, args, once) {
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
        Handler.create = function (caller, method, args, once) {
            return new Handler(caller, method, args, once);
        };
        return Handler;
    }());
    suncom.Handler = Handler;
    var Logger = (function () {
        function Logger() {
        }
        Logger.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(args.join(" "));
        };
        Logger.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.warn(args.join(" "));
        };
        Logger.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.error(args.join(" "));
        };
        return Logger;
    }());
    suncom.Logger = Logger;
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
        function addEnumString(key, oEnum, concat) {
            if (concat === void 0) { concat = true; }
            if (oEnum.NAME === void 0) {
                throw Error("Common=> Invalid Enum Object");
            }
            else {
                if (oEnum[key] === void 0) {
                    if (concat === false) {
                        oEnum[key] = key;
                    }
                    else {
                        oEnum[key] = oEnum.NAME + "." + oEnum.MODULE + "." + key;
                    }
                }
                else {
                    throw Error("Common=> Duplicate Enum String " + oEnum.NAME + "[" + key + "]");
                }
            }
        }
        Common.addEnumString = addEnumString;
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
            while (args.length > 0) {
                var key = null;
                var index = -1;
                for (var i = 0; i < signs.length; i++) {
                    var sign = signs[i];
                    var indexOfSign = str.indexOf(sign);
                    if (indexOfSign === -1) {
                        continue;
                    }
                    if (index === -1 || indexOfSign < index) {
                        key = sign;
                        index = indexOfSign;
                    }
                }
                if (index === -1) {
                    throw Error("\u5B57\u7B26\u4E32\u66FF\u6362\u672A\u5B8C\u6210 str:" + str);
                }
                str = str.replace(key, args.shift());
            }
            return str;
        }
        Common.formatString = formatString;
        function formatString$(str, args) {
            while (args.length > 0) {
                if (str.indexOf("{$}") === -1) {
                    throw Error("\u5B57\u7B26\u4E32\u66FF\u6362\u672A\u5B8C\u6210 str:" + str);
                }
                else {
                    str = str.replace("{$}", args.shift());
                }
            }
            return str;
        }
        Common.formatString$ = formatString$;
        function abs(a) {
            if (a < 0) {
                return -a;
            }
            return a;
        }
        Common.abs = abs;
        function min(a, b) {
            if (b < a) {
                return b;
            }
            return a;
        }
        Common.min = min;
        function max(a, b) {
            if (a < b) {
                return b;
            }
            return a;
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
            var reg0 = str.indexOf(".");
            if (reg0 === -1) {
                return value;
            }
            var reg1 = reg0 + 1;
            if (str.length - reg1 <= n) {
                return value;
            }
            var s0 = str.substr(0, reg0);
            var s1 = str.substr(reg1, n);
            var s2 = str.substr(reg1 + n, 2);
            var a = s2.length === 1 ? s2 : s2.charAt(0);
            var b = s2.length === 1 ? "0" : s2.charAt(1);
            var intValue = parseInt(s0 + s1);
            var floatValue = parseInt(a + b);
            if (intValue < 0 && floatValue > 0) {
                intValue--;
                floatValue = 100 - floatValue;
            }
            var s3 = floatValue.toString();
            var reg2 = parseInt(s3.charAt(0));
            var reg3 = parseInt(s3.charAt(1));
            if (reg2 > 5) {
                intValue += 1;
            }
            else if (reg2 === 5) {
                if (reg3 > 0) {
                    intValue++;
                }
                else {
                    var modValue = intValue % 2;
                    if (modValue === 1 || modValue === -1) {
                        intValue += 1;
                    }
                }
            }
            var s4 = intValue.toString();
            var reg4 = s4.length - n;
            var s5 = s4.substr(0, reg4) + "." + s4.substr(reg4);
            var reg5 = parseFloat(s5);
            return reg5;
        }
        Common.round = round;
        function $round(value, n) {
            if (n === void 0) { n = 0; }
            var multiples = Math.pow(10, n + 1);
            var tmpValue = Math.floor(value * multiples);
            var floatValue = tmpValue % 10;
            var intValue = (tmpValue - floatValue) / 10;
            if (floatValue < 0) {
                intValue -= 1;
                floatValue += 10;
            }
            if (floatValue > 5) {
                intValue += 1;
            }
            else if (floatValue === 5) {
                var modValue = intValue % 2;
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
                    date.setMonth(month - 11);
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
            var time = d1.valueOf();
            var time2 = d2.valueOf();
            if (datepart === "ms") {
                return time2 - time;
            }
            time = Math.floor(time / 1000);
            time2 = Math.floor(time2 / 1000);
            if (datepart === "ss") {
                return time2 - time;
            }
            time = Math.floor(time / 60);
            time2 = Math.floor(time2 / 60);
            if (datepart === "mm") {
                return time2 - time;
            }
            time = Math.floor(time / 60);
            time2 = Math.floor(time2 / 60);
            if (datepart === "hh") {
                return time2 - time;
            }
            time = Math.floor(time / 24);
            time2 = Math.floor(time2 / 24);
            if (datepart === "dd") {
                return time2 - time;
            }
            if (datepart === "ww") {
                return Math.floor(((time2 - 4) - (time - 4)) / 7);
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
            throw Error("Not supported!!!");
        }
        Common.md5 = md5;
        function createHttpSign(params) {
            var keys = Object.keys(params).sort();
            var array = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key !== "sign") {
                    array.push(key + "=" + params[key]);
                }
            }
            array.push("key=123456789012345678");
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
    })(Common = suncom.Common || (suncom.Common = {}));
    var DBService;
    (function (DBService) {
        var $table = {};
        function get(name) {
            return $table[name];
        }
        DBService.get = get;
        function put(name, data) {
            $table[name] = data;
        }
        DBService.put = put;
        function drop(name) {
            delete $table[name];
        }
        DBService.drop = drop;
    })(DBService = suncom.DBService || (suncom.DBService = {}));
    var EventManager;
    (function (EventManager) {
        var $system = new EventSystem();
        function dispatchCancel() {
            $system.dispatchCancel();
        }
        EventManager.dispatchCancel = dispatchCancel;
        function dispatchEvent(type, args, cancelable) {
            $system.dispatchEvent(type, args, cancelable);
        }
        EventManager.dispatchEvent = dispatchEvent;
        function addEventListener(type, method, caller, receiveOnce, priority) {
            $system.addEventListener(type, method, caller, receiveOnce, priority);
        }
        EventManager.addEventListener = addEventListener;
        function removeEventListener(type, method, caller) {
            $system.removeEventListener(type, method, caller);
        }
        EventManager.removeEventListener = removeEventListener;
    })(EventManager = suncom.EventManager || (suncom.EventManager = {}));
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
})(suncom || (suncom = {}));
