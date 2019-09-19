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
    var Common = (function () {
        function Common() {
        }
        Object.defineProperty(Common, "hashId", {
            get: function () {
                Common.$hashId++;
                return Common.$hashId;
            },
            enumerable: true,
            configurable: true
        });
        Common.getClassName = function (cls) {
            var classString = cls.toString().trim();
            var index = classString.indexOf("(");
            return classString.substring(9, index);
        };
        Common.convertEnumToString = function (value, oEnum) {
            if (value === void 0) {
                return null;
            }
            var keys = Object.keys(oEnum);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (oEnum[key] === value) {
                    return key;
                }
            }
            return null;
        };
        Common.addEnumString = function (key, oEnum, concat) {
            if (concat === void 0) { concat = true; }
            if (oEnum.NAME !== void 0) {
                if (oEnum[key] !== void 0) {
                    throw Error("Common=> Duplicate Enum String " + oEnum.NAME + "[" + key + "]");
                }
                else if (concat === false) {
                    oEnum[key] = key;
                }
                else {
                    oEnum[key] = oEnum.NAME + "." + oEnum.MODULE + "." + key;
                }
            }
            else {
                throw Error("Common=> Invalid Enum Object");
            }
        };
        Common.isNumber = function (str) {
            if (typeof str === "number") {
                return true;
            }
            if (typeof str === "string" && isNaN(parseFloat(str)) === false) {
                return true;
            }
            return false;
        };
        Common.isStringInvalidOrEmpty = function (str) {
            if (typeof str === "number") {
                return false;
            }
            if (typeof str === "string" && str !== "") {
                return false;
            }
            return true;
        };
        Common.formatString = function (str, args) {
            for (var i = 0; i < args.length; i++) {
                str = str.replace("{$}", args[i]);
            }
            return str;
        };
        Common.abs = function (a) {
            if (a < 0) {
                return -a;
            }
            return a;
        };
        Common.min = function (a, b) {
            if (b < a) {
                return b;
            }
            return a;
        };
        Common.max = function (a, b) {
            if (a < b) {
                return b;
            }
            return a;
        };
        Common.clamp = function (value, min, max) {
            if (value < min) {
                return min;
            }
            else if (value > max) {
                return max;
            }
            return value;
        };
        Common.round = function (value, n) {
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
        };
        Common.random = function (min, max) {
            var value = Random.random() * (max - min);
            return Math.floor(value) + min;
        };
        Common.convertToDate = function (date) {
            if (date instanceof Date) {
                return date;
            }
            if (Common.isNumber(date) === true) {
                return new Date(date.toString());
            }
            if (typeof date === "string") {
                var array = date.split(" ");
                var dates = array.length === 1 ? [] : array.shift().split("-");
                var times = array[1].split(":");
                if (dates.length === 3 && times.length === 3) {
                    return new Date(Number(dates[0]), Number(dates[1]) - 1, Number(dates[2]), Number(times[0]), Number(times[1]), Number(times[2]));
                }
                return new Date(date);
            }
            throw Error("Convert Date Error:" + date);
        };
        Common.dateAdd = function (datepart, increment, time) {
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
        };
        Common.dateDiff = function (datepart, date, date2) {
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
        };
        Common.formatDate = function (str, time) {
            var date = Common.convertToDate(time);
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
        };
        Common.md5 = function (str) {
            throw Error("Not supported!!!");
        };
        Common.createSign = function (params) {
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
        };
        Common.$hashId = 0;
        return Common;
    }());
    suncom.Common = Common;
    var Dictionary = (function () {
        function Dictionary() {
            this.$map = {};
        }
        Dictionary.prototype.get = function (key, defaultValue) {
            if (typeof key === "string" && key.length > 0) {
                if (this.$map[key] === void 0) {
                    return defaultValue;
                }
                return this.$map[key];
            }
            else {
                throw Error("Invalid Key:" + key);
            }
        };
        Dictionary.prototype.put = function (key, value) {
            if (typeof key === "string" && key.length > 0) {
                this.$map[key] = value;
            }
            else {
                throw Error("Invalid Key:" + key);
            }
        };
        Dictionary.prototype.remove = function (key) {
            if (typeof key === "string" && key.length > 0) {
                delete this.$map[key];
            }
            else {
                throw Error("Invalid Key:" + key);
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
            if (type === void 0 || type === null) {
                throw Error("Invalid Event Type!!!");
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
            if (type === void 0 || type === null) {
                throw Error("Register Invalid Event Type!!!");
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
            if (type === void 0 || type === null) {
                throw Error("Remove Invalid Event Type!!!");
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
        Global.TCP_IP = "127.0.0.1";
        Global.TCP_PORT = 0;
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
            else if (this.$args instanceof Array) {
                return this.$method.apply(this.$caller, this.$args);
            }
            else {
                return this.$method.call(this.$caller, this.$args);
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
    var Pool = (function () {
        function Pool() {
        }
        Pool.getItem = function (sign) {
            var array = Pool.$pool[sign] || null;
            if (array !== null && array.length > 0) {
                var item = array.pop();
                item["suncore$__inPool__"] = false;
                return item;
            }
            return null;
        };
        Pool.getItemByClass = function (sign, cls, args) {
            var item = Pool.getItem(sign);
            if (item === null) {
                if (Laya["Prefab"] !== void 0 && args === Laya["Prefab"]) {
                    item = cls.create();
                }
                else {
                    item = {};
                    item.__proto__ = cls.prototype;
                    if (args === void 0) {
                        cls.call(item);
                    }
                    else if (args instanceof Array) {
                        cls.apply(item, args);
                    }
                    else {
                        cls.call(item, args);
                    }
                }
            }
            return item;
        };
        Pool.recover = function (sign, item) {
            if (item["suncore$__inPool__"] === true) {
                return;
            }
            item["suncore$__inPool__"] = true;
            var array = Pool.$pool[sign] || null;
            if (array === null) {
                Pool.$pool[sign] = [item];
            }
            else {
                array.push(item);
            }
        };
        Pool.clear = function (sign) {
            if (Pool.$pool[sign] !== void 0) {
                delete Pool.$pool[sign];
            }
        };
        Pool.$pool = {};
        return Pool;
    }());
    suncom.Pool = Pool;
    var Random = (function () {
        function Random() {
        }
        Random.seed = function (value) {
            Random.$r = value;
        };
        Random.random = function () {
            var r = dcodeIO.Long.fromNumber(Random.$r);
            var A = dcodeIO.Long.fromNumber(Random.$A);
            var C = dcodeIO.Long.fromNumber(Random.$C);
            Random.$r = Math.floor(r.mul(A).add(C).low / Random.$M);
            return (Random.$r % Random.$M + Random.$M) / (Random.$M * 2);
        };
        Random.$r = 1;
        Random.$A = 1103515245;
        Random.$C = 12345;
        Random.$M = 32767;
        return Random;
    }());
    suncom.Random = Random;
})(suncom || (suncom = {}));
