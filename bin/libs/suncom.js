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
        DebugMode[DebugMode["NETWORK_HEATBEAT"] = 32] = "NETWORK_HEATBEAT";
        /**
         * H5游戏盒子
         */
        DebugMode[DebugMode["H5BOX"] = 64] = "H5BOX";
        /**
         * 普通
         */
        DebugMode[DebugMode["NORMAL"] = 128] = "NORMAL";
    })(DebugMode = suncom.DebugMode || (suncom.DebugMode = {}));
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
            if (oEnum.NAME) {
                if (oEnum[key]) {
                    throw Error("Common=> Duplicate Enum String " + oEnum.NAME + "[" + key + "]");
                }
                else if (concat == false) {
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
            if (typeof str == "number") {
                return true;
            }
            if (isNaN(parseInt(str)) == false) {
                return true;
            }
            return false;
        };
        /**
          * 判断这符串是否为空
          */
        Common.isStringInvalidOrEmpty = function (str) {
            if (typeof str == "number") {
                return false;
            }
            if (typeof str == "string" && str != "") {
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
            else if (floatValue == 5) {
                var modValue = intValue % 2;
                if (modValue == 1 || modValue == -1) {
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
          * 1. 时间戳
          * 2. hh:mm:ss
          * 3. yyyy-MM-dd hh:mm:ss
          */
        Common.convertToDate = function (date) {
            if (date instanceof Date) {
                return date;
            }
            // 时间戳或字符串形式的时间戳
            if (Common.isNumber(date) == true) {
                return new Date(date.toString());
            }
            // 自定义格式
            if (typeof date == "string") {
                // 自定义时间格式 yyyy-MM-dd hh:mm:ss 或 hh:mm:ss
                var array = date.split(" ");
                var dates = array[0].split("-");
                var times = array[1].split(":");
                if (dates.length == 3 && times.length == 3) {
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
            if (datepart == "yy") {
                date.setFullYear(date.getFullYear() + increment);
            }
            else if (datepart == "MM") {
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
            if (datepart == "ww") {
                timestamp += increment * 7 * 24 * 3600 * 1000;
            }
            else if (datepart == "dd") {
                timestamp += increment * 24 * 3600 * 1000;
            }
            else if (datepart == "hh") {
                timestamp += increment * 3600 * 1000;
            }
            else if (datepart == "mm") {
                timestamp += increment * 60 * 1000;
            }
            else if (datepart == "ss") {
                timestamp += increment * 1000;
            }
            else if (datepart == "ms") {
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
            if (datepart == "ms") {
                return time2 - time;
            }
            time = Math.floor(time / 1000);
            time2 = Math.floor(time2 / 1000);
            if (datepart == "ss") {
                return time2 - time;
            }
            time = Math.floor(time / 60);
            time2 = Math.floor(time2 / 60);
            if (datepart == "mm") {
                return time2 - time;
            }
            time = Math.floor(time / 60);
            time2 = Math.floor(time2 / 60);
            if (datepart == "hh") {
                return time2 - time;
            }
            time = Math.floor(time / 24);
            time2 = Math.floor(time2 / 24);
            if (datepart == "dd") {
                return time2 - time;
            }
            if (datepart == "ww") {
                //1970/1/1是星期四，故应当减去4天
                return Math.floor(((time2 - 4) - (time - 4)) / 7);
            }
            if (datepart == "MM") {
                return d2.getMonth() - d1.getMonth() + (d2.getFullYear() - d1.getFullYear()) * 12;
            }
            if (datepart == "yy") {
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
            throw Error("暂未实现");
        };
        /**
          * 生成 HTTP 签名
          */
        Common.createSign = function (params) {
            var keys = Object.keys(params).sort();
            var array = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key != "sign") {
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
            if (typeof key == "string" && key.length > 0) {
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
            if (typeof key == "string" && key.length > 0) {
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
            if (typeof key == "string" && key.length > 0) {
                delete this.$map[key];
            }
            else {
                throw Error("Invalid Key:" + key);
            }
        };
        return Dictionary;
    }());
    suncom.Dictionary = Dictionary;
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
            if (array != null && array.length > 0) {
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
            if (item == null) {
                if (Laya["Prefab"] && args === Laya["Prefab"]) {
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
            if (item["suncore$__inPool__"]) {
                return;
            }
            item["suncore$__inPool__"] = true;
            var array = Pool.$pool[sign] || null;
            if (array == null) {
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
            if (Pool.$pool[sign]) {
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
