/**
 * @license suncore (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/suncore
 */
declare module suncore {
    /**
     * 消息优先级
     * 设计说明：
     * 1. 使用消息机制的意义主要在于解决游戏表现层的流畅性问题
     * 2. 由于消息机制中并没有提供由使用者主动取消消息的功能，所以消息机制并不适用于作线性逻辑方面的构建
     * 3. 消息机制被用于实现场景跳转只是一个意外，因为场景跳转的逻辑是不可回滚的
     */
    enum MessagePriorityEnum {
        /**
         * 始终立即响应
         */
        PRIORITY_0,

        /**
         * 每帧至多响应十次消息
         */
        PRIORITY_HIGH,

        /**
         * 每帧至多响应三次的消息
         */
        PRIORITY_NOR,

        /**
         * 每帧至多响应一次的消息
         */
        PRIORITY_LOW,

        /**
         * 惰性消息
         * 说明：
         * 1. 当前帧若没有处理过任何消息，则会处理此类型的消息
         * 2. 当消息优先级为 [0, HIGH, NOR, LOW] 的消息回调执行后的返回值为false，则该次执行将会被LAZY忽略
         */
        PRIORITY_LAZY,

        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         * 3. 此类型的消息存在的唯一原因是消息机制不能感知定时器的存在
         */
        PRIORITY_TRIGGER,

        /**
         * 任务消息
         * 说明：
         * 1. 任务消息在执行时，会阻塞整个消息队列，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         */
        PRIORITY_TASK,
    }

    /**
     * 模块枚举
     * 
     * 说明：
     * 由于游戏中的消息和定时器都是以队列的方式实现响应，所以在场景切换的过程中，就会涉及到未响应的元素的清理问题
     * 故设计了模块系统，队列将以模块来划分，当一个模块退出时，对应的列表将会被清理。
     * 
     * 注意：
     * 尽量不要添加新的模块，因为模块越多，消息响应的调度算法就会越复杂
     */
    enum ModuleEnum {
        /**
         * 系统模块
         * 此模块为常驻模块，该模块下的消息永远不会被清理
         */
        SYSTEM = 0,

        /**
         * 通用模块
         * 此模块下的消息会在当前场景退出的同时被清理
         */
        CUSTOM,

        /**
         * 时间轴模块
         * 此模块下的消息会在时间轴被销毁的同时被清理
         */
        TIMELINE,
    }

    /**
     * MsgQId枚举
     */
    enum MsgQIdEnum {
        /**
         * 网络层消息枚举
         */
        NET_MSG_ID_BEGIN = 1,

        NET_MSG_ID_END = 10,

        /**
         * CUI消息枚举
         */
        CUI_MSG_ID_BEGIN = NET_MSG_ID_END,

        CUI_MSG_ID_END = 100,

        /**
         * GUI消息枚举
         */
        GUI_MSG_ID_BEGIN = CUI_MSG_ID_END,

        GUI_MSG_ID_END = 200,

        /**
         * 逻辑层消息枚举
         */
        OSL_MSG_ID_BEGIN = GUI_MSG_ID_END,

        OSL_MSG_ID_END = 300
    }

    /**
     * MsgQ的模块枚举
     */
    enum MsgQModEnum {
        /**
         * 通用界面
         */
        CUI = 1,

        /**
         * 游戏界面
         */
        GUI,

        /**
         * 逻辑层
         */
        OSL,

        /**
         * 网络层
         */
        NET
    }

    /**
     * MsgQ的消息对象
     */
    interface IMsgQMsg {
        /**
         * 发送消息的模块
         */
        src: MsgQModEnum;

        /**
         * 接收消息的模块
         */
        dest: MsgQModEnum;

        /**
         * 消息编号
         */
        id: number;

        /**
         * 消息挂载的数据
         */
        data: any;
    }

    /**
     * 任务接口
     */
    interface ITask {
        /**
         * 任务是否己经完成
         */
        done: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成
         */
        run(): boolean;

        /**
         * 取消任务
         */
        cancel(): void;
    }

    /**
     * 任务抽象类
     */
    abstract class AbstractTask extends puremvc.Notifier implements ITask {
        /**
         * 外部会访问此变量来判断任务是否己经完成
         */
        protected $done: boolean;

        /**
         * 任务是否己经完成
         */
        done: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         */
        abstract run(): boolean;

        /**
         * 任务取消
         * 说明：
         * 1. 当消息因时间轴停止而被清理时，此方法会被自动执行
         */
        cancel(): void;
    }

    /**
     * 服务（主要用于逻辑层架构）
     * 说明：
     * 1. 每个服务均有独立的生命周期。
     * 2. 服务被设计用来处理与表现层无关的有状态的业务。
     */
    abstract class BaseService extends puremvc.Notifier {

        /**
         * 服务启动入口
         */
        run(): void;

        /**
         * 服务停止接口
         */
        stop(): void;

        /**
         * 启动回调
         */
        protected abstract $onRun(): void;

        /**
         * 停止回调
         */
        protected abstract $onStop(): void;

        /**
         * 服务是否正在运行
         */
        readonly running: boolean;
    }

    /**
     * MsgQ服务类（主要用于模块间的解偶）
     * 说明：
     * 1. 理论上每个MsgQ模块都必须实现一个MsgQService对象，否则此模块的消息不能被处理
     */
    abstract class MsgQService extends BaseService {

        /**
         * 启动回调
         */
        protected $onRun(): void;

        /**
         * 停止回调
         */
        protected $onStop(): void;

        /**
         * 处理MsgQ消息
         */
        protected abstract $dealMsgQMsg(msg:IMsgQMsg): void;
    }

    /**
     * 命令枚举
     */
    abstract class NotifyKey {

        static readonly STARTUP: string;

        static readonly SHUTDOWN: string;

        static readonly START_TIMELINE: string;

        static readonly PAUSE_TIMELINE: string;

        static readonly PHYSICS_FRAME: string;

        static readonly PHYSICS_PREPARE: string;

        static readonly ENTER_FRAME: string;

        static readonly LATER_FRAME: string;
    }

    /**
     * 暂停时间轴
     */
    class PauseTimelineCommand extends puremvc.SimpleCommand {

        /**
         * @mod: 时间轴模块
         * @stop: 是否停止时间轴，默认为true
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        execute(mod:ModuleEnum, stop?:boolean): void;
    }

    /**
     * 简单任务对象
     */
    class SimpleTask extends AbstractTask {

        constructor(handler:suncom.IHandler);

        /**
         * 执行函数
         */
        run(): boolean;
    }

    /**
     * 开始时间轴，若时间轴不存在，则会自动创建
     */
    class StartTimelineCommand extends puremvc.SimpleCommand {

        /**
         * @mod: 时间轴模块
         * @pause: 时间轴在开启时是否处于暂停状态
         * 说明：
         * 1. 参数pause并不会对SYSTEM模块的时间轴生效
         */
        execute(mod:ModuleEnum, pause?:boolean): void;
    }

    /**
     * MsgQ接口类
     * 设计说明：
     * 1. 设计MsgQ的主要目的是为了对不同的模块进行彻底的解耦
     * 2. 考虑到在实际环境中，网络可能存在波动，而UI层可能会涉及到资源的动态加载与释放管理，故MsgQ中的消息是以异步的形式进行派发的
     * 3. 由于MsgQ的异步机制，故每条消息的处理都必须考虑并避免因模块间的数据可能的不同步而带来的报错问题
     */
    namespace MsgQ {

        /**
         * 发送消息（异步）
         */
        function send(src: MsgQModEnum, dest: MsgQModEnum, id: number, data: any): void;
    }

    /**
     * 互斥体，用于实现模块之间的互斥
     */
    namespace Mutex {
        /**
         * 激活互斥体的MsgQ模块
         * 说明：
         * 1. 当此变量的值为-1时，允许激活互斥体
         * 2. 首次引用互斥体视为激活互斥体
         * 3. 激活互斥体的模块将被记录在此变量中
         * 4. 若激活消息的模块为MMI模块，则此记录值允许被替换成其它MMI模块的消息，仅第一次生效
         * 5. 此变量会在互斥引用为0时重新置为-1
         */
        let actMsgQMod: MsgQModEnum;

        /**
         * 是否校验消息前缀，默认为false
         */
        let checkPrefix: boolean;

        /**
         * 表现层模块集
         */
        const mmiMsgQMap: { [prefix: string]: MsgQModEnum };

        /**
         * 表现层前缀集
         */
        const mmiMsgQCmd: { [msgQMod: number]: string };

        /**
         * 激活互斥体
         */
        function active(msgQMod: MsgQModEnum): void;

        /**
         * 关闭互斥体
         */
        function deactive(): void;

        /**
         * 锁定互斥体
         */
        function lock(name: string): void;

        /**
         * 释放互斥体
         */
        function unlock(name: string): void;

        /**
         * 判断是否允许执行MMI的行为
         */
        function enableMMIAction(): boolean;

        /**
         * 为对象初始化一个互斥量
         */
        function create(name: string, target: Object): void;

        /**
         * 释放互斥量
         */
        function release(name: string, target: Object): void;
    }

    /**
     * 系统接口
     */
    namespace System {

        /**
         * 判断指定模块是否己停止
         */
        function isModuleStopped(mod: ModuleEnum): boolean;

        /**
         * 判断指定模块是否己暂停
         */
        function isModulePaused(mod: ModuleEnum): boolean;

        /**
         * 获取时间间隔（所有模块共享）
         */
        function getDelta(): number;

        /**
         * 获取指定模块的时间戳
         */
        function getModuleTimestamp(mod: ModuleEnum): number;

        /**
         * 添加任务
         */
        function addTask(mod: ModuleEnum, task: ITask): void;

        /**
         * 添加触发器
         */
        function addTrigger(mod: ModuleEnum, delay: number, handler: suncom.IHandler): void;

        /**
         * 添加消息
         */
        function addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, handler: suncom.IHandler): void;

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数，默认为1
         * @real: 是否计算真实次数，默认为false
         */
        function addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops?: number, real?: boolean): number;

        /**
         * 移除定时器
         */
        function removeTimer(timerId: number): number;
    }
}