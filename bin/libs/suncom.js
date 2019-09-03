var suncom;
(function (suncom) {
    /**
     * 调试模式
     */
    var DebugMode;
    (function (DebugMode) {
        /**
         * 调试信息
         */
        DebugMode[DebugMode["DEBUG"] = 1] = "DEBUG";
        /**
         * 工程模式
         */
        DebugMode[DebugMode["ENGINEER"] = 2] = "ENGINEER";
        /**
         * 框架
         */
        DebugMode[DebugMode["ENGINE"] = 4] = "ENGINE";
        /**
         * 原生
         */
        DebugMode[DebugMode["NATIVE"] = 8] = "NATIVE";
        /**
         * 网络
         */
        DebugMode[DebugMode["NETWORK"] = 16] = "NETWORK";
        /**
         * 网络心跳
         */
        DebugMode[DebugMode["NETWORK_HEARTBEAT"] = 32] = "NETWORK_HEARTBEAT";
        /**
         * 普通
         */
        DebugMode[DebugMode["NORMAL"] = 64] = "NORMAL";
    })(DebugMode = suncom.DebugMode || (suncom.DebugMode = {}));
    /**
     * 环境模式
     */
    var EnvMode;
    (function (EnvMode) {
        /**
         * 模拟器
         */
        EnvMode[EnvMode["SIMULATOR"] = 0] = "SIMULATOR";
    })(EnvMode = suncom.EnvMode || (suncom.EnvMode = {}));
    /**
      * 纯 js 公共方法类
      */
    var Common = /** @class */ (function () {
        function Common() {
        }
        Object.defineProperty(Common, "hashId", {
            /**
              * 获取 Hash ID
              */
            get: function () {
                Common.$hashId++;
                return Common.$hashId;
            },
            enumerable: true,
            configurable: true
        });
        /**
          * 获取类名
          * @cls: 指定类型
          */
        Common.getClassName = function (cls) {
            var classString = cls.toString().trim();
            var index = classString.indexOf("(");
            return classString.substring(9, index);
        };
        /**
          * 将枚举转化成字符串
          */
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
        /**
          * 添加枚举值
          * @concat: 是否用key和NAME和MODULE拼接作为key的值，默认true
          */
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
        //=================================================
        // 字符串相关
        /**
          * 判断是否为数字
          */
        Common.isNumber = function (str) {
            if (typeof str === "number") {
                return true;
            }
            if (typeof str === "string" && isNaN(parseFloat(str)) === false) {
                return true;
            }
            return false;
        };
        /**
          * 判断字符串是否为空
          */
        Common.isStringInvalidOrEmpty = function (str) {
            if (typeof str === "number") {
                return false;
            }
            if (typeof str === "string" && str !== "") {
                return false;
            }
            return true;
        };
        /**
          * 格式化字符串
          */
        Common.formatString = function (str, args) {
            for (var i = 0; i < args.length; i++) {
                str = str.replace("{$}", args[i]);
            }
            return str;
        };
        //=================================================
        // 数学相关
        /**
         * 返回绝对值
         */
        Common.abs = function (a) {
            if (a < 0) {
                return -a;
            }
            return a;
        };
        /**
         * 返回a与b中的较小值
         */
        Common.min = function (a, b) {
            if (b < a) {
                return b;
            }
            return a;
        };
        /**
         * 返回a与b中的较大值
         */
        Common.max = function (a, b) {
            if (a < b) {
                return b;
            }
            return a;
        };
        /**
          * 将 value 限制制于 min 和 max 之间
          */
        Common.clamp = function (value, min, max) {
            if (value < min) {
                return min;
            }
            else if (value > max) {
                return max;
            }
            return value;
        };
        /**
          * 返回四舍五入后的结果
          * 因各个平台实现的版本可能不一致，故自定义了此方法
          * @n: 保留小数位数，默认为0
          */
        Common.round = function (value, n) {
            if (n === void 0) { n = 0; }
            // 多保留一位小数点
            var multiples = Math.pow(10, n + 1);
            // 临时值（去小数点）
            var tmpValue = Math.floor(value * multiples);
            // 浮点值
            var floatValue = tmpValue % 10;
            // 整数值
            var intValue = (tmpValue - floatValue) / 10;
            // 若浮点值小于 0 ，则进行修正
            if (floatValue < 0) {
                intValue -= 1;
                floatValue += 10;
            }
            // 四舍六入五成双
            if (floatValue > 5) {
                intValue += 1;
            }
            else if (floatValue === 5) {
                var modValue = intValue % 2;
                if (modValue === 1 || modValue === -1) {
                    intValue += 1;
                }
            }
            // 还原小数点，并返回
            return intValue / Math.pow(10, n);
        };
        /**
          * 返回 >= min 且 < max 的随机整数
          */
        Common.random = function (min, max) {
            var value = Random.random() * (max - min);
            return Math.floor(value) + min;
        };
        //=================================================
        // 时间相关
        /**
          * 将参数转化为 Date
          * @date: 任何格式的时间参数，可以为字符串或时间戳
          * 支持的格式说明：
          * 1. Date对象
          * 2. 时间戳
          * 3. hh:mm:ss
          * 4. yyyy-MM-dd hh:mm:ss
          */
        Common.convertToDate = function (date) {
            if (date instanceof Date) {
                return date;
            }
            // 时间戳或字符串形式的时间戳
            if (Common.isNumber(date) === true) {
                return new Date(date.toString());
            }
            // 自定义格式
            if (typeof date === "string") {
                // 自定义时间格式 yyyy-MM-dd hh:mm:ss 或 hh:mm:ss
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
        /**
          * 时间累加
          * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
          * @increment： 增量，可为负
          * @arg2: 时间参数
          */
        Common.dateAdd = function (datepart, increment, time) {
            var date = Common.convertToDate(time);
            //计算增量毫秒数
            if (datepart === "yy") {
                date.setFullYear(date.getFullYear() + increment);
            }
            else if (datepart === "MM") {
                var rem = increment % 12;
                var mul = (increment - rem) / 12;
                // 增加倍数的年份
                date.setFullYear(date.getFullYear() + mul);
                // 增加余数的年份
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
        /**
          * 计算时间差
          * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
          */
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
                //1970/1/1是星期四，故应当减去4天
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
        /**
          * 格式化时间，支持：yy-MM-dd hh:mm:ss
          */
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
        //=================================================
        // 其它
        /**
          * 返回 MD5 加密后的串
          */
        Common.md5 = function (str) {
            // return new md5().hex_md5(str);
            throw Error("Not supported!!!");
        };
        /**
          * 生成 HTTP 签名
          */
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
        /**
         * Hash Id
         */
        Common.$hashId = 0;
        return Common;
    }());
    suncom.Common = Common;
    /**
     * 字典
     */
    var Dictionary = /** @class */ (function () {
        function Dictionary() {
            /**
             * 数据源
             */
            this.$map = {};
        }
        /**
         * 返回字典中指定key所映射的值
         * @defaultValue: 默认值
         */
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
        /**
         * 将指定值映射到字典中的指定key
         */
        Dictionary.prototype.put = function (key, value) {
            if (typeof key === "string" && key.length > 0) {
                this.$map[key] = value;
            }
            else {
                throw Error("Invalid Key:" + key);
            }
        };
        /**
         * 将指定key从字典中移除
         */
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
    var EventInfo = /** @class */ (function () {
        function EventInfo() {
        }
        return EventInfo;
    }());
    suncom.EventInfo = EventInfo;
    /**
     * EventSystem 自定义事件系统
     * 为避免注册与注销对正在派发的事件列表产生干扰：
     * NOTE: 每个列表首个元素为布尔类型，默认为 false
     * NOTE: 若该列表的事件类型正在派发，则其值为 true
     */
    var EventSystem = /** @class */ (function () {
        function EventSystem() {
            /**
             * 事件对象集合
             */
            this.$events = {};
            /**
             * 己执行的一次性事件对象列表
             */
            this.$onceList = [];
            /**
             * 事件是否己取消
             */
            this.$isCanceled = false;
        }
        /**
         * 取消当前正在派发的事件
         */
        EventSystem.prototype.dispatchCancel = function () {
            this.$isCanceled = true;
        };
        /**
         * 事件派发
         * @args[]: 参数列表，允许为任意类型的数据
         * @cancelable: 事件是否允许被中断，默认为false
         */
        EventSystem.prototype.dispatchEvent = function (type, args, cancelable) {
            if (cancelable === void 0) { cancelable = false; }
            if (type === void 0 || type === null) {
                throw Error("Invalid Event Type!!!");
            }
            var list = this.$events[type] || null;
            // 无此类事件
            if (list === null) {
                return;
            }
            // 无回调函数被注册
            if (list.length === 1) {
                return;
            }
            // 标记禁止直接更新
            list[0] = true;
            // 记录历史事件状态
            var isCanceled = this.$isCanceled;
            // 标记当前事件未取消
            this.$isCanceled = false;
            // 响应回调
            for (var i = 1; i < list.length; i++) {
                var event_1 = list[i];
                // 一次性事件入栈
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
                // 事件允许被取消，且事件被取消
                if (cancelable === true && this.$isCanceled) {
                    break;
                }
            }
            // 回归历史事件状态
            this.$isCanceled = isCanceled;
            // 标记允许直接更新
            list[0] = false;
            // 注销一次性事件
            while (this.$onceList.length) {
                var event_2 = this.$onceList.pop();
                this.removeEventListener(event_2.type, event_2.method, event_2.caller);
            }
        };
        /**
         * 事件注册
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 事件优先级，优先级高的先被执行，默认为 1
         */
        EventSystem.prototype.addEventListener = function (type, method, caller, receiveOnce, priority) {
            if (receiveOnce === void 0) { receiveOnce = false; }
            if (priority === void 0) { priority = 1; }
            if (type === void 0 || type === null) {
                throw Error("Register Invalid Event Type!!!");
            }
            var list = this.$events[type] || null;
            // 若事件列表不存在，则新建
            if (list === null) {
                list = this.$events[type] = [false];
            }
            // 若当前禁止直接更新，则复制列表
            else if (list[0] === true) {
                list = this.$events[type] = list.concat();
                // 新生成的列表允许被更新
                list[0] = false;
            }
            // 插入索引
            var index = -1;
            for (var i = 1; i < list.length; i++) {
                var item = list[i];
                // 事件不允许重复注册
                if (item.method === method && item.caller === caller) {
                    return;
                }
                // 优先级高的事件先执行
                if (index === -1 && item.priority < priority) {
                    index = i;
                }
            }
            // 生成事件对象
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
        /**
         * 移除事件
         */
        EventSystem.prototype.removeEventListener = function (type, method, caller) {
            if (type === void 0 || type === null) {
                throw Error("Remove Invalid Event Type!!!");
            }
            var list = this.$events[type] || null;
            // 无此类事件
            if (list === null) {
                return;
            }
            // 无回调函数被注册
            if (list.length === 1) {
                return;
            }
            // 若当前禁止直接更新，则复制列表
            if (list[0] === true) {
                list = this.$events[type] = list.slice(0);
                // 新生成的列表允许被更新
                list[0] = false;
            }
            for (var i = 0; i < list.length; i++) {
                var event_3 = list[i];
                if (event_3.method === method && event_3.caller === caller) {
                    list.splice(i, 1);
                    break;
                }
            }
            // 移除空列表
            if (list.length === 1) {
                delete this.$events[type];
            }
        };
        return EventSystem;
    }());
    suncom.EventSystem = EventSystem;
    /**
     * 全局常量或变量
     */
    var Global = /** @class */ (function () {
        function Global() {
        }
        /**
         * 运行环境
         */
        Global.envMode = EnvMode.SIMULATOR;
        /**
         * 调试模式
         */
        Global.debugMode = DebugMode.NORMAL | DebugMode.NATIVE | DebugMode.NETWORK | DebugMode.NETWORK_HEARTBEAT | DebugMode.ENGINE | DebugMode.ENGINEER | DebugMode.DEBUG;
        /**
         * 设计分辨率
         */
        Global.WIDTH = 1280;
        Global.HEIGHT = 720;
        /**
         * 实际分辨率
         */
        Global.width = 1280;
        Global.height = 720;
        /**
         * 服务端地址
         */
        Global.TCP_IP = "127.0.0.1";
        /**
         * 服务端端口
         */
        Global.TCP_PORT = 0;
        /**
         * 游戏版本
         */
        Global.VERSION = "1.0.0";
        return Global;
    }());
    suncom.Global = Global;
    /**
      * 事件处理器
      */
    var Handler = /** @class */ (function () {
        function Handler(caller, method, args, once) {
            this.$args = args;
            this.$caller = caller;
            this.$method = method;
        }
        /**
         * 执行处理器
         */
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
        /**
         * 执行处理器，携带额外的参数
         * @param args 参数列表，允许为任意类型的数据
         */
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
        /**
         * 创建Handler的简单工厂方法
         * @once: 己弃用
         */
        Handler.create = function (caller, method, args, once) {
            return new Handler(caller, method, args, once);
        };
        return Handler;
    }());
    suncom.Handler = Handler;
    /**
     * 日志接口
     */
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        /**
         * 普通日志
         */
        Logger.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(args.join(" "));
        };
        /**
         * 警告日志
         */
        Logger.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.warn(args.join(" "));
        };
        /**
         * 错误日志
         */
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
    /**
      * 对象池
      */
    var Pool = /** @class */ (function () {
        function Pool() {
        }
        /**
         * 根据标识从池中获取对象，获取失败时返回null
         */
        Pool.getItem = function (sign) {
            var array = Pool.$pool[sign] || null;
            if (array !== null && array.length > 0) {
                var item = array.pop();
                item["suncore$__inPool__"] = false;
                return item;
            }
            return null;
        };
        /**
         * 根据标识从池中获取对象，获取失败时将创建新的对象
         */
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
        /**
         * 根据标识回收对象
         */
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
        /**
         * 清缓指定标识下的所有己缓存对象
         */
        Pool.clear = function (sign) {
            if (Pool.$pool[sign] !== void 0) {
                delete Pool.$pool[sign];
            }
        };
        /**
         * 对象集合
         */
        Pool.$pool = {};
        return Pool;
    }());
    suncom.Pool = Pool;
    /**
     * 线性同余发生器
     */
    var Random = /** @class */ (function () {
        function Random() {
        }
        /**
         * 指定随机种子
         */
        Random.seed = function (value) {
            Random.$r = value;
        };
        /**
         * 返回一个随机数
         */
        Random.random = function () {
            var r = dcodeIO.Long.fromNumber(Random.$r);
            var A = dcodeIO.Long.fromNumber(Random.$A);
            var C = dcodeIO.Long.fromNumber(Random.$C);
            Random.$r = Math.floor(r.mul(A).add(C).low / Random.$M);
            return (Random.$r % Random.$M + Random.$M) / (Random.$M * 2);
        };
        /**
         * 随机种子
         */
        Random.$r = 1;
        /**
         * 随机数参数
         */
        Random.$A = 1103515245;
        Random.$C = 12345;
        Random.$M = 32767;
        return Random;
    }());
    suncom.Random = Random;
})(suncom || (suncom = {}));
