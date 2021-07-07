
declare module suncom {
    /**
     * 调试模式，主要用于日志打印的控制，也用于模块中调试代码的开启与关闭
     */
    enum DebugMode {
        /**
         * 错误日志
         */
        ERROR = 0x1,

        /**
         * 警告日志
         */
        WARN = 0x2,

        /**
         * 文件日志
         */
        LOG2F = 0x4,

        /**
         * 信息日志（框架）
         */
        INFO = 0x8,

        /**
         * 调试日志
         */
        DEBUG = 0x10,

        /**
         * 普通
         */
        NORMAL = 0x20
    }

    /**
     * 事件优先级
     */
    enum EventPriorityEnum {
        /**
         * 最低
         */
        LOWEST = 0,

        /**
         * 低
         */
        LOW,

        /**
         * 中（默认）
         */
        MID,

        /**
         * 高
         */
        HIGH,

        /**
         * 最高
         */
        HIGHEST,

        /**
         * 框架级别
         */
        FWL,

        /**
         * 引擎级别
         */
        EGL,

        /**
         * 系统级别
         */
        OSL
    }

    /**
     * 字典，通常用于作为一个大量数据的集合，用于快速获取数据集中的某条数据
     * 说明：
     * 1. 字典的主键值只允许为数字或字符串类型
     * 2. 仅允许存储 Object 类型的数据
     */
    interface IDictionary<T> {
        /**
         * 数据源（请勿直接操作其中的数据）
         */
        readonly source: T[];

        /**
         * 添加数据
         */
        put(data: T): T;

        /**
         * 根据键值返回数据
         */
        getByValue(key: NumberOrString, value: any): T;

        /**
         * 根据主键值快速返回数据
         */
        getByPrimaryValue(value: NumberOrString): T;

        /**
         * 移除数据
         */
        remove(data: T): T;

        /**
         * 根据键值移除数据
         */
        removeByValue(key: NumberOrString, value: any): T;

        /**
         * 根据主键值移除数据
         */
        removeByPrimaryValue(value: NumberOrString): T;

        /**
         * 清除所有数据
         */
        clear(): void;

        /**
         * 为每个数据执行方法
         * 说明：
         * 1. 若method返回true，则会中断遍历
         * 2. 请勿在此方法中新增或移除数据
         */
        forEach(method: (data: T) => any): void;
    }

    /**
     * 自定义事件系统
     */
    interface IEventSystem {

        /**
         * 事件注册
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 事件优先级，优先级高的先被执行，默认为：EventPriorityEnum.MID
         * @args[]: 回调参数列表，默认为: null
         * 说明：
         * 1. 若需覆盖参数，请先调用removeEventListener移除事件后再重新注册
         */
        addEventListener(type: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: EventPriorityEnum): void;

        /**
         * 移除事件
         */
        removeEventListener(type: string, method: Function, caller: Object): void;

        /**
         * 事件派发
         * @data: 参数对象，允许为任意类型的数据，传递多个参数时可指定其为数组，若需要传递的data本身就是数组，则需要传递[data]
         * @cancelable: 通知是否允许被取消，默认为: true
         */
        dispatchEvent(type: string, data?: any, cancelable?: boolean): void;

        /**
         * 取消当前正在派发的事件
         */
        dispatchCancel(): void;
    }

    /**
     * 期望异常测试类
     */
    interface IExpect {
        /**
         * 期望相反
         */
        readonly not: IExpect;

        /**
         * 指定期望值
         */
        expect(value: any): IExpect;

        /**
         * 解释异常
         */
        interpret(str: string): IExpect;

        /**
         * 测试执行接口，若测试未通过，则输出description
         */
        test(pass: boolean, message: string): void;

        /**
         * 期望为任意值，但不为null和undefined
         */
        anything(): void;

        /**
         * 期望数组中包含
         */
        arrayContaining<T>(array: T[]): void;

        /**
         * 期望字符串中含有value
         */
        stringContaining(value: string): void;

        /**
         * 期望字符串被包含
         */
        stringMatching(value: string): void;

        /**
         * 期望存在属性
         * @value: 若不为void 0，则同时校验值
         */
        toHaveProperty(key: string, value?: any): void;

        /**
         * 期望值为：value
         */
        toBe(value: any): void;

        /**
         * 期望值为：null
         */
        toBeNull(): void;

        /**
         * 期望值为：undefined
         */
        toBeUndefined(): void;

        /**
         * 期望为：布尔类型
         */
        toBeBoolean(): void;

        /**
         * 期望对象类型为：cls
         */
        toBeInstanceOf(cls: new () => any): void;

        /**
         * 期望在不关心类型的情况下，值在布尔上下文中为假
         */
        toBeFalsy(value: any): void;

        /**
         * 期望在不关心类型的情况下，值在布尔上下文中为真
         */
        toBeTruthy(value: any): void;

        /**
         * 期望两个数字是否相等
         * @deviation: 误差，默认为：0
         */
        toBeCloseTo(value: number, deviation?: number): void;

        /**
         * 期望数字大于
         */
        toBeGreaterThan(value: number): void;

        /**
         * 期望数字大于或等于
         */
        toBeGreaterOrEqualThan(value: number): void;

        /**
         * 期望数字小于
         */
        toBeLessThan(value: number): void;

        /**
         * 期望数字小于或等于
         */
        toBeLessOrEqualThan(value: number): void;

        /**
         * 深度相等
         */
        toEqual(value: any): void;

        /**
         * 深度相等且类型一致
         */
        toStrictEqual(value: any): void;
    }

    /**
     * 事件处理器
     */
    interface IHandler {
        /**
         * 回调对象
         */
        readonly caller: Object;

        /**
         * 回调方法
         */
        readonly method: Function;

        /**
         * 执行处理器
         */
        run(): any;

        /**
         * 执行处理器，携带额外的参数
         * @args: 参数列表，允许为任意类型的数据
         */
        runWith(args: any): any;

        /**
         * 回收到对象池
         */
        recover(): void;
    }

    /**
     * 哈希表，通常用于作为一个大量数据的集合
     * 说明：
     * 1. 哈希表的主键值允许为任意类型
     * 2. 允许被存储的值为 null 或 undefined
     */
    interface IHashMap<K, V> {

        /**
         * 返回字典中的条目数量
         */
        size(): number;

        /**
         * 是否存在从 key 到值的映射
         */
        exist(key: any): boolean;

        /**
         * 设置 key 所映射的值
         */
        set(key: K, value: V): V;

        /**
         * 获取 key 所映射的值
         */
        get(key: K): V;

        /**
         * 移除 key 及其所映射的值
         */
        remove(key: K): V;

        /**
         * 清除所有数据
         */
        clear(): void;

        /**
         * 为每个数据执行方法
         * 说明：
         * 1. 若method返回true，则会中断遍历
         * 2. 请勿在此方法中新增或移除数据
         */
        forEach(method: (value: V, key?: K) => any): void;
    }

    interface IPCMInt {

        arg0: number;
    }

    interface IPCMInt2 {

        arg0: number;

        arg1: number;
    }

    interface IPCMIntString {

        arg0: number;

        arg1: string;
    }

    interface IPCMString {

        arg0: string;
    }

    /**
     * 线性同余发生器接口
     */
    interface IRandom {
        /**
         * 随机种子
         */
        readonly r: number;

        /**
         * 指定随机种子（必须大于0）
         */
        seed(value: number): void;

        /**
         * 返回一个随机数
         */
        random(): number;

        /**
         * 返回 >= min 且 < max 的随机整数
         */
        randomInt(min: number, max: number): number;
    }

    class Dictionary<T> implements IDictionary<T> {

        readonly source: T[];

        /**
         * @primaryKey: 指定主键字段名，字典会使用主键值来作为数据索引，所以请确保主键值是恒值
         */
        constructor(primaryKey: NumberOrString);

        put(data: T): T;

        getByValue(key: NumberOrString, value: any): T;

        getByPrimaryValue(value: NumberOrString): T;

        remove(data: T): T;

        removeByValue(key: NumberOrString, value: any): T;

        removeByPrimaryValue(value: NumberOrString): T;

        clear(): void;

        forEach(method: (data: T) => any): void;
    }

    class EventSystem implements IEventSystem {

        addEventListener(type: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: EventPriorityEnum): void;

        removeEventListener(type: string, method: Function, caller: Object): void;

        dispatchEvent(type: string, data?: any, cancelable?: boolean): void;

        dispatchCancel(): void;
    }

    /**
     * 事件处理器
     */
    class Handler implements IHandler {

        run(): any;

        runWith(args: any): any;

        recover(): void;

        readonly caller: Object;

        readonly method: Function;

        /**
         * 创建Handler的简单工厂方法
         */
        static create(caller: Object, method: Function, args?: any[], once?: boolean): IHandler;
    }

    class HashMap<K, V> implements IHashMap<K, V> {

        size(): number;

        exist(key: any): boolean;

        set(key: K, value: V): V;

        get(key: K): V;

        remove(key: K): V;

        clear(): void;

        forEach(method: (value: V, key?: K) => any): void;
    }

    /**
     * 线性同余发生器
     */
    class Random implements IRandom {

        /**
         * @r：随机种子，默认为：1
         */
        constructor(r?: number);

        seed(value: number): void;

        random(): number;

        randomInt(min: number, max: number): number;

        readonly r: number;
    }

    /**
     * 常用库（纯JS方法）
     */
    namespace Common {

        /**
         * 获取全局唯一的哈希值
         */
        function createHashId(): number;

        /**
         * 判断属性是否为 null 或未定义
         */
        function isNullOrUndefined(value: any): boolean;

        /**
         * 获取类名
         * @cls: 指定类型
         */
        function getClassName(cls: any): string;

        /**
         * 返回对象的类名
         */
        function getQualifiedClassName(obj: any): string;

        /**
         * 返回某对象上的方法名
         * @caller: 默认为：null
         */
        function getMethodName(method: Function, caller?: Object): string;

        /**
         * 去除字符串的头尾空格
         * 说明：
         * 1. 当 str 为无效字符串时返回 null
         */
        function trim(str: string): string;

        /**
         * 判断字符串是否为空
         * 说明：
         * 1. 当 value 为数字且不为 NaN 时返回 true
         * 2. 当 value 为字符串且不为 "" 时返回 true
         * 3. 否则返回 false
         */
        function isStringNullOrEmpty(value: NumberOrString): boolean;

        /**
         * 格式化字符串
         */
        function formatString(str: string, args: any[]): string;

        /**
         * 将参数转化为 Date
         * @date: 任何格式的时间参数，可以为字符串或时间戳
         * 支持的格式说明：
         * 1. Date对象
         * 2. 时间戳
         * 3. hh:mm:ss
         * 4. yyyy-MM-dd hh:mm:ss
         */
        function convertToDate(date: NumberOrString | Date): Date;

        /**
         * 时间累加
         * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
         * @increment： 增量，可为负
         * @time: 时间参数
         * @return: 时间戳
         */
        function dateAdd(datepart: string, increment: number, time: NumberOrString | Date): number;

        /**
         * 计算时间差
         * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
         * @return: 时间戳
         */
        function dateDiff(datepart: string, date: NumberOrString | Date, date2: NumberOrString | Date): number;

        /**
         * 格式化时间，支持：yyyy-MM-dd hh:mm:ss.MS or yy-M-d h-m-s.ms
         */
        function formatDate(str: string, time: NumberOrString | Date): string;

        /**
         * 获取 Url 参数值
         */
        function getQueryString(name: string, param?: string): string;

        /**
         * 生成HTTP签名
         * @sign: 密钥
         * @signKey: 忽略签名字段，默认为："sign"
         */
        function createHttpSign(params: Object, sign: string, signKey?: string): string;

        /**
         * 获取文件名（不包括扩展名）
         */
        function getFileName(path: string): string;

        /**
         * 获取文件的扩展名
         */
        function getFileExtension(path: string): string;

        /**
         * 替换扩展名，并返回新的路径
         */
        function replacePathExtension(path: string, newExt: string): string;

        /**
         * 从数组中查找数据
         * @array: 数据源
         * @method: 查询规则，返回true表示与规则匹配
         * @out: 若不为null，则返回查询到的所有数据，默认为: null
         * @return: 若out为null，则只返回查询到的第一条数据，否则返回null
         */
        function findInArray<T>(array: T[], method: (data: T) => boolean, out?: T[]): T;

        /**
         * 将数据从数组中移除
         */
        function removeItemFromArray<T>(item: T, array: T[]): void;

        /**
         * 将数据从数组中移除
         */
        function removeItemsFromArray<T>(items: T[], array: T[]): void;

        /**
         * 复制数据对象
         * @deep: 默认为: false
         */
        function copy(data: any, deep?: boolean): any;

        /**
         * 判断深度相等
         */
        function isEqual(oldData: any, newData: any, strict: boolean): boolean;

        /**
         * 比较版本号
         * 若当前版本低于参数版本，返回 -1
         * 若当前版本高于参数版本，返回 1
         * 否则返回 0
         */
        function compareVersion(ver: string): number;
    }

    /**
     * 全局常量或变量
     */
    namespace Global {
        /**
         * 调试模式，默认为：0
         */
        let debugMode: DebugMode;

        /**
         * 设计分辨率宽，默认为：1280
         */
        const WIDTH: number;

        /**
         * 设计分辨率高，默认为：720
         */
        const HEIGHT: number;

        /**
         * 实际分辨率宽，默认为：Global.WIDTH
         */
        let width: number;

        /**
         * 实际分辨率高，默认为：Global.HEIGHT
         */
        let height: number;

        /**
         * 游戏版本，默认为：1.0.0
         */
        let VERSION: string;
    }

    /**
     * 日志接口
     */
    namespace Logger {

        /**
         * 普通日志
         */
        function log(str: string): void;

        /**
         * 调试日志
         */
        function debug(str: string): void;

        /**
         * 追踪日志
         */
        function trace(str: string, callback: (str: string) => void): void;

        /**
         * 信息日志（框架）
         */
        function info(str: string): void;

        /**
         * 文件日志
         */
        function log2f(str: string): void;

        /**
         * 警告日志
         */
        function warn(str: string): void;

        /**
         * 错误日志
         */
        function error(str: string): void;
    }

    /**
     * 常用数学函数
     */
    namespace Mathf {
        /**
         * PI
         */
        const PI: number;

        /**
         * 2PI
         */
        const PI2: number;

        /**
         * 整数的最大安全值
         */
        const MAX_SAFE_INTEGER: number;

        /**
         * 整数的最小安全值
         */
        const MIN_SAFE_INTEGER: number;

        /**
         * 角度换算为弧度
         */
        function d2r(d: number): number;

        /**
         * 弧度换算为角度
         */
        function r2d(a: number): number;

        /**
         * 将value限制于min和max之间
         */
        function clamp(value: number, min: number, max: number): number;

        /**
         * 返回近似值
         * @n: 需要保留小数位数，默认为0
         * 1. 因各个平台实现的版本可能不一致，故自定义了此方法
         */
        function round(value: number, n?: number): number;

        /**
         * 返回 >= min 且 < max 的随机整数
         */
        function random(min: number, max: number): number;

        /**
         * 判断是否为数字
         */
        function isNumber(str: NumberOrString): boolean;
    }

    /**
     * 对象池
     */
    namespace Pool {

        /**
         * 根据标识从池中获取对象，获取失败时返回null
         */
        function getItem(sign: string): any;

        /**
         * 根据标识从池中获取对象，获取失败时将创建新的对象
         * @cls: 对象类型，支持Laya.Prefab
         * @args: 构造函数参数列表，若cls为Laya.Prefab，则args应当为字符串
         */
        function getItemByClass(sign: string, cls: any, args?: any): any;

        /**
         * 根据标识回收对象
         * @return: 成功入池时返回: true, 否则返回: false
         */
        function recover(sign: string, item: any): boolean;

        /**
         * 清缓指定标识下的所有己缓存对象
         */
        function clear(sign: string): void;
    }

    /**
     * 测试类
     */
    namespace Test {
        /**
         * 断言是否失败，默认为：false
         */
        let ASSERT_FAILED: boolean;

        /**
         * 断言失败时是否自动断点，默认为：true
         */
        let ASSERT_BREAKPOINT: boolean;

        /**
         * 期望测试
         */
        function expect(value: any, description?: string): IExpect;

        /**
         * 期望之外的，执行此方法时直接触发ASSERT_FAILED
         */
        function notExpected(message?: string): void;

        /**
         * 测试表达式是否为true
         */
        function assertTrue(value: boolean, message?: string): void;

        /**
         * 测试表达式是否为false
         */
        function assertFalse(value: boolean, message?: string): void;
    }

    /**
     * 常用类型声明
     */
    type NumberOrString = number | string;

    type KVNumber2Number = { [key: number]: number };

    type KVNumber2String = { [key: number]: string };

    type KVNumber2Boolean = { [key: number]: boolean };

    type KVString2Number = { [key: string]: number };

    type KVString2String = { [key: string]: string };

    type KVString2Boolean = { [key: string]: boolean };

    type KVNumber2Object<T> = { [key: number]: T };

    type KVString2Object<T> = { [key: string]: T };
}