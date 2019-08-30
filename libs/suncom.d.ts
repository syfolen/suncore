
declare module suncom {

  /**
   * 调试模式
   */
  export enum DebugMode {
    /**
     * 调试信息
     */
    DEBUG = 0x1,

    /**
     * 工程模式
     */
    ENGINEER = 0x02,

    /**
     * 框架
     */
    ENGINE = 0x4,

    /**
     * 原生
     */
    NATIVE = 0x8,

    /**
     * 网络
     */
    NETWORK = 0x10,

    /**
     * 网络心跳
     */
    NETWORK_HEATBEAT = 0x20,

    /**
     * H5游戏盒子
     */
    H5BOX = 0x40,

    /**
     * 普通
     */
    NORMAL = 0x80
  }

  /**
   * 字典接口
   */
  export interface IDictionary {
    /**
     * 返回字典中指定key所映射的值
     * @defaultValue: 默认值
     */
    get(key: string, defaultValue?: any): any;

    /**
     * 将指定值映射到字典中的指定key
     */
    put(key: string, value: any): void;

    /**
     * 将指定key从字典中移除
     */
    remove(key: string): void;
  }

  /**
   * 事件处理器接口
   */
  export interface IHandler {
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
  export abstract class Common {
    /**
     * Hash Id
     */
    private static $hashId: number;

    /**
    * 获取 Hash ID
    */
    static readonly hashId: number;

    /**
    * 获取类名
    * @cls: 指定类型
    */
    static getClassName(cls: new () => any): string;

    /**
    * 将枚举转化成字符串 
    */
    static convertEnumToString(value: number, oEnum: any): string;

    /**
    * 添加枚举值
    * @concat: 是否用key和NAME和MODULE拼接作为key的值，默认true
    */
    static addEnumString(key: string, oEnum: { NAME, MODULE }, concat?: boolean): void;

    //=================================================
    // 字符串相关

    /**
    * 判断是否为数字
    */
    static isNumber(str: string | number): boolean;

    /**
    * 判断这符串是否为空
    */
    static isStringInvalidOrEmpty(str: string | number): boolean;

    /**
    * 格式化字符串
    */
    static formatString(str: string, args: Array<string>): string;

    //=================================================
    // 数学相关

    /**
     * 返回绝对值
     */
    static abs(a: number): number;

    /**
     * 返回a与b中的较小值
     */
    static min(a: number, b: number): number;

    /**
     * 返回a与b中的较大值
     */
    static max(a: number, b: number): number;

    /**
    * 将 value 限制制于 min 和 max 之间
    */
    static clamp(value: number, min: number, max: number): number;

    /**
    * 返回四舍五入后的结果
    * 因各个平台实现的版本可能不一致，故自定义了此方法
    * @n: 保留小数位数，默认为0
    */
    static round(value: number, n?: number): number;

    /**
    * 返回 >= min 且 < max 的随机整数
    */
    static random(min: number, max: number): number;

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
    static convertToDate(date: string | number | Date): Date;

    /**
    * 时间累加
    * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
    * @increment： 增量，可为负
    * @arg2: 时间参数
    */
    static dateAdd(datepart: string, increment: number, time: string | number | Date): number;

    /**
    * 计算时间差
    * @datepart: yy, MM, ww, dd, hh, mm, ss, ms
    */
    static dateDiff(datepart: string, date: string | number | Date, date2: string | number | Date): number;

    /**
    * 格式化时间，支持：yy-MM-dd hh:mm:ss
    */
    static formatDate(str: string, time: string | number | Date): string;

    //=================================================
    // 其它

    /**
    * 返回 MD5 加密后的串
    */
    static md5(str: string): string;

    /**
    * 生成 HTTP 签名
    */
    static createSign(params: Object): string;
  }

  /**
   * 字典
   */
  export class Dictionary implements IDictionary {
    /**
     * 数据源
     */
    private $map: { [key: string]: any };

    /**
     * 返回字典中指定key所映射的值
     * @defaultValue: 默认值
     */
    get(key: string, defaultValue?: any): any;

    /**
     * 将指定值映射到字典中的指定key
     */
    put(key: string, value: any): void;

    /**
     * 将指定key从字典中移除
     */
    remove(key: string): void;
  }

  /**
  * 事件处理器
  */
  export class Handler implements IHandler {
    /**
     * 参数列表
     */
    private $args: any;

    /**
     * 回调对象
     */
    private $caller: Object;

    /**
     * 回调方法
     */
    private $method: Function;

    constructor(caller: Object, method: Function, args?: any, once?: boolean);

    /**
     * 执行处理器
     */
    run(): any;

    /**
     * 执行处理器，携带额外的参数
     * @param args 参数列表，允许为任意类型的数据
     */
    runWith(args: any): any;

    /**
     * 创建Handler的简单工厂方法
     * @once: 己弃用
     */
    static create(caller: Object, method: Function, args?: Array<any>, once?: boolean): IHandler;
  }

  /**
  * 对象池
  */
  export abstract class Pool {
    /**
     * 对象集合
     */
    private static $pool: { [sign: string]: Array<any> };

    /**
     * 根据标识从池中获取对象，获取失败时返回null
     */
    static getItem(sign: string): any;

    /**
     * 根据标识从池中获取对象，获取失败时将创建新的对象
     */
    static getItemByClass(sign: string, cls: any, args?: any): any;

    /**
     * 根据标识回收对象
     */
    static recover(sign: string, item: any): void;

    /**
     * 清缓指定标识下的所有己缓存对象
     */
    static clear(sign: string): void;
  }

  /**
   * 线性同余发生器
   */
  export class Random {
    /**
     * 随机种子
     */
    private static $r: number;

    /**
     * 随机数参数
     */
    private static $A: number;
    private static $C: number;
    private static $M: number;

    /**
     * 指定随机种子
     */
    static seed(value: number): void;

    /**
     * 返回一个随机数
     */
    static random(): number;
  }
}