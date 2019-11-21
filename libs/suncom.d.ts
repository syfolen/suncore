/**
 * 常用库
 */
declare module suncom {
    /**
     * 调试模式
     */
    enum DebugMode {
        /**
         * 调试信息
         */
        DEBUG,

        /**
         * 工程模式
         */
        ENGINEER,

        /**
         * 框架
         */
        ENGINE,

        /**
         * 原生
         */
        NATIVE,

        /**
         * 网络
         */
        NETWORK,

        /**
         * 网络心跳
         */
        NETWORK_HEARTBEAT,

        /**
         * 普通
         */
        NORMAL
    }

    /**
     * 环境模式
     */
    enum EnvMode {
        /**
         * 模拟器
         */
        SIMULATOR
    }

    /**
     * 字典接口
     */
    interface IDictionary<T> {
        /**
         * 数据源（请勿直接操作其中的数据）
         */
        source: Array<T>;

        /**
         * 添加数据
         */
        put(data: T): T;

        /**
         * 移除数据
         */
        remove(data: T): T;

        /**
         * 根据键值返回数据
         */
        getByValue(key: string, value: any): T;

        /**
         * 根据主键值快速返回数据
         */
        getByPrimaryValue(value: number | string): T;

        /**
         * 根据键值移除数据
         */
        removeByValue(key: string, value: any): T;

        /**
         * 根据主键值移除数据
         */
        removeByPrimaryValue(value: number | string): T;

        /**
         * 为每个数据执行方法（谨慎在此方法中新增或移除数据）
         * 若method返回true，则会中断遍历
         */
        forEach(method: (data: T) => any): void;
    }

    /**
     * 自定义事件接口
     */
    interface IEventSystem {

        /**
         * 取消当前正在派发的事件
         */
        dispatchCancel(): void;

        /**
         * 事件派发
         * @args[]: 参数列表，允许为任意类型的数据
         * @cancelable: 事件是否允许被中断，默认为false
         */
        dispatchEvent(type: string, args?: any, cancelable?: boolean): void;

        /**
         * 事件注册
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 事件优先级，优先级高的先被执行，默认为 1
         */
        addEventListener(type: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): void;

        /**
         * 移除事件
         */
        removeEventListener(type: string, method: Function, caller: Object): void;
    }

    /**
     * 事件处理器接口
     */
    interface IHandler {

        /**
         * 执行处理器
         */
        run(): any;

        /**
         * 执行处理器，携带额外的参数
         * @param args 参数列表，允许为任意类型的数据
         */
        runWith(args: any): any;
    }

    /**
     * 纯 js 公共方法类
     */
    abstract class Common {

        /**
         * 获取 Hash ID
         */
        static readonly hashId: number;

        /**
         * 获取类名
         * @cls: 指定类型
         */
        static getClassName(cls:any): string;

        /**
         * 返回对象的类名
         */
        static getQualifiedClassName(obj:any): string;

        /**
         * 将枚举转化成字符串
         */
        static convertEnumToString(value:number, oEnum:any): string;

        /**
         * 将枚举转化成字符串
         */
        static addEnumString(key:string, oEnum:{ NAME, MODULE }, concat?:boolean): void;

        /**
         * =================================================
         * 字符串相关
         * 判断是否为数字
         */
        static isNumber(str:string | number): boolean;

        /**
         * 判断字符串是否为空
         */
        static isStringInvalidOrEmpty(str:string | number): boolean;

        /**
         * 格式化字符串
         */
        static formatString(str:string, args:Array<any>): string;

        /**
         * =================================================
         * 数学相关
         * 返回绝对值
         */
        static abs(a:number): number;

        /**
         * 返回a与b中的较小值
         */
        static min(a:number, b:number): number;

        /**
         * 返回a与b中的较大值
         */
        static max(a:number, b:number): number;

        /**
         * 将 value 限制制于 min 和 max 之间
         */
        static clamp(value:number, min:number, max:number): number;

        /**
         * 返回四舍五入后的结果
         * 因各个平台实现的版本可能不一致，故自定义了此方法
         * @n: 保留小数位数，默认为0
         */
        static round(value:number, n?:number): number;

        /**
         * 返回 >= min 且 < max 的随机整数
         */
        static random(min:number, max:number): number;

        /**
         * =================================================
         * 时间相关
         * 将参数转化为 Date
         * @date: 任何格式的时间参数，可以为字符串或时间戳
         * 支持的格式说明：
         * 1. Date对象
         * 2. 时间戳
         * 3. hh:mm:ss
         * 4. yyyy-MM-dd hh:mm:ss
         */
        static convertToDate(date:string | number | Date): Date;

        /**
         * 时间累加
         * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
         * @increment： 增量，可为负
         * @arg2: 时间参数
         */
        static dateAdd(datepart:string, increment:number, time:string | number | Date): number;

        /**
         * 计算时间差
         * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
         */
        static dateDiff(datepart:string, date:string | number | Date, date2:string | number | Date): number;

        /**
         * 格式化时间，支持：yy-MM-dd hh:mm:ss ms
         */
        static formatDate(str:string, time:string | number | Date): string;

        /**
         * =================================================
         * 其它
         * 返回 MD5 加密后的串
         */
        static md5(str:string): string;

        /**
         * 生成 HTTP 签名
         */
        static createSign(params:Object): string;
    }

    /**
     * 字典
     */
    class Dictionary<T> implements IDictionary<T> {
        /**
         * 数据源（请勿直接操作其中的数据）
         */
        source: Array<T>;

        /**
         * @primaryKey: 指定主键字段名，字典会使用主键值来建立数据源与哈希表之间的映射关系，所以请确保主键值是恒值
         */
        constructor(primaryKey:number | string);

        /**
         * 根据数据在数据源中的索引来移除数据
         */
        private $removeByIndex(index:number): T;

        /**
         * 获取数据在数据源中的索引
         */
        private $getIndexByValue(key:string, value:any): number;

        /**
         * 添加数据
         */
        put(data:T): T;

        /**
         * 移除数据
         */
        remove(data:T): T;

        /**
         * 根据键值返回数据
         */
        getByValue(key:string, value:any): T;

        /**
         * 根据主键值快速返回数据
         */
        getByPrimaryValue(value:number | string): T;

        /**
         * 根据键值移除数据
         */
        removeByValue(key:string, value:any): T;

        /**
         * 根据主键值移除数据
         */
        removeByPrimaryValue(value:number | string): T;

        /**
         * 为每个数据执行方法（谨慎在此方法中新增或移除数据）
         * 若method返回true，则会中断遍历
         */
        forEach(method:(data: T) => any): void;
    }

    /**
     * EventSystem 自定义事件系统
     * 为避免注册与注销对正在派发的事件列表产生干扰：
     * NOTE: 每个列表首个元素为布尔类型，默认为 false
     * NOTE: 若该列表的事件类型正在派发，则其值为 true
     */
    class EventSystem implements IEventSystem {

        /**
         * 取消当前正在派发的事件
         */
        dispatchCancel(): void;

        /**
         * 事件派发
         * @args[]: 参数列表，允许为任意类型的数据
         * @cancelable: 事件是否允许被中断，默认为false
         */
        dispatchEvent(type:string, args?:any, cancelable?:boolean): void;

        /**
         * 事件注册
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 事件优先级，优先级高的先被执行，默认为 1
         */
        addEventListener(type:string, method:Function, caller:Object, receiveOnce?:boolean, priority?:number): void;

        /**
         * 移除事件
         */
        removeEventListener(type:string, method:Function, caller:Object): void;
    }

    /**
     * 全局常量或变量
     */
    abstract class Global {
        /**
         * 运行环境
         */
        static readonly envMode: EnvMode;

        /**
         * 调试模式
         */
        static readonly debugMode: DebugMode;

        /**
         * 设计分辨率
         */
        static readonly WIDTH: number;

        /**
         * 设计分辨率
         */
        static readonly HEIGHT: number;

        /**
         * 实际分辨率
         */
        static width: number;

        /**
         * 实际分辨率
         */
        static height: number;

        /**
         * 游戏版本
         */
        static readonly VERSION: string;
    }

    /**
     * 事件处理器
     */
    class Handler implements IHandler {

        constructor(caller:Object, method:Function, args?:any, once?:boolean);

        /**
         * 执行处理器
         */
        run(): any;

        /**
         * 执行处理器，携带额外的参数
         * @param args 参数列表，允许为任意类型的数据
         */
        runWith(args:any): any;

        /**
         * 创建Handler的简单工厂方法
         * @once: 己弃用
         */
        static create(caller:Object, method:Function, args?:Array<any>, once?:boolean): IHandler;
    }

    /**
     * 对象池
     */
    abstract class Pool {

        /**
         * 根据标识从池中获取对象，获取失败时返回null
         */
        static getItem<T>(sign:string): T;

        /**
         * 根据标识从池中获取对象，获取失败时将创建新的对象
         */
        static getItemByClass<T>(sign:string, cls:any, args?:any): T;

        /**
         * 根据标识回收对象
         */
        static recover(sign:string, item:any): void;

        /**
         * 清缓指定标识下的所有己缓存对象
         */
        static clear(sign:string): void;
    }
}