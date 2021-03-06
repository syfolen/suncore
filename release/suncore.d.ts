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
     * 1. 所有的Message消息都是异步执行的
     * 2. 使用消息机制的意义主要在于解决游戏表现层的流畅性问题
     * 3. 由于消息机制中并没有提供由使用者主动取消消息的功能，所以消息机制并不适用于作线性逻辑方面的构建
     * 4. 消息机制被用于实现场景跳转只是一个意外，因为场景跳转的逻辑是不可回滚的
     */
    enum MessagePriorityEnum {
        /**
         * 始终立即响应
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         */
        PRIORITY_0 = 0,

        /**
         * 每帧至多响应十次消息
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         */
        PRIORITY_HIGH,

        /**
         * 每帧至多响应三次消息
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         */
        PRIORITY_NOR,

        /**
         * 每帧至多响应一次消息
         * 说明：
         * 1. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
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
         * 3. 请谨慎定义此消息的回调执行器的返回值，详见 LAZY 消息说明
         * 4. 此类型的消息存在的唯一原因是惰性消息的机制无法感知定时器的存在
         */
        PRIORITY_TRIGGER,

        /**
         * 任务消息
         * 说明：
         * 1. 任务消息在执行时，会阻塞整个消息队列，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         */
        PRIORITY_TASK,

        /**
         * 承诺消息
         * 说明：
         * 1. 此消息是取代原生js的Promise机制用的
         * 2. 与任务消息类似，承诺也是阻塞式执行的
         * 3. 影响承诺执行优先级的除了承诺的被添加顺序之外，还有承诺的批次
         * 4. 当你在承诺执行的过程中添加新的承诺时，这些承诺将被视为新的批次
         * 5. 新批次的承诺拥有更高的执行优先级，它们将在当前承诺执行完毕之后开始执行
         * 6. 当当前批次中的所有承诺全部执行完毕之后，上一批承诺将会继续执行，直至整个消息队列为空
         */
        PRIORITY_PROMISE
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

        /**
         * 枚举结束
         */
        MAX
    }

    /**
     * 服务（主要用于逻辑层架构）
     * 说明：
     * 1. 每个服务均有独立的生命周期。
     * 2. 服务被设计用来处理与表现层无关的有状态业务。
     */
    interface IService extends puremvc.INotifier {
        /**
         * 服务是否正在运行
         */
        readonly running: boolean;

        /**
         * 服务启动入口
         */
        run(): void;

        /**
         * 服务停止接口
         */
        stop(): void;
    }

    /**
     * 任务抽象类
     * 说明：
     * 1. Task必定为MMI层对象，这是不可更改的
     * 2. Task一旦开始则不允许取消，可直接设置done为true来强制结束
     * 3. Task对象有自己的生命周期管理机制，故不建议在外部持有
     */
    interface ITask extends puremvc.INotifier {
        /**
         * 是否己完成
         * 说明：
         * 1. 请勿重写此getter和setter函数，否则可能会出问题
         */
        done: boolean;

        /**
         * 是否正在运行
         */
        running: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         */
        run(): boolean;

        /**
         * 任务被取消
         * 说明：
         * 1. 当消息因时间轴停止而被清理时，此方法会被自动执行，用于清理Task内部的数据
         * 2. 当done被设置为true时，此方法亦会被执行，请知悉
         */
        cancel(): void;
    }

    abstract class AbstractTask extends puremvc.Notifier implements ITask {

        running: boolean;

        done: boolean;

        abstract run(): boolean;

        cancel(): void;
    }

    abstract class BaseService extends puremvc.Notifier implements IService {

        run(): void;

        stop(): void;

        /**
         * 启动回调
         */
        protected abstract $onRun(): void;

        /**
         * 停止回调
         */
        protected abstract $onStop(): void;

        readonly running: boolean;
    }

    /**
     * 暂停时间轴
     */
    class PauseTimelineCommand extends puremvc.SimpleCommand {

        /**
         * @mod: 时间轴模块
         * @stop: 若为true，时间轴将被停止而非暂停
         */
        execute(mod: ModuleEnum, stop: boolean): void;
    }

    /**
     * 简单任务对象
     */
    class SimpleTask extends AbstractTask {

        constructor(caller: Object, method: Function, args?: any[]);

        /**
         * 执行函数，只能返回: true
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
         */
        execute(mod: ModuleEnum, pause: boolean): void;
    }

    /**
     * 缓动类
     * 说明：
     * 1. 缓动类内置了对象池，当缓动结束或被取消后没有立即被指定动作，则会在下一帧自动回收
     * 2. 由于缓动对象只有在被回收后才会自动释放资源，故不建议在外部持有不工作的缓动对象
     * 3. 若你的需求必须这么做，则可以这么来防止Tween被回收：Tween.get(target).usePool(false);
     * 4. 当外部持有的Tween被弃用时，请记得及时回收
     */
    class Tween extends puremvc.Notifier {

        /**
         * 取消缓动
         */
        cancel(): Tween;

        /**
         * 回收缓动对象
         * 说明：
         * 1. 你无需调用此方法，除非创建缓动的时候你没有使用对象池
         */
        recover(): void;

        /**
         * 从当前属性缓动至props属性
         * @props: 变化的属性集合，其中update属性的类型只能指定为suncom.Handler，可用其来观察缓动数值的变化
         * @duration: 缓动时长
         * @ease: 缓动函数，默认为: null
         * @complete: 缓动结束时的回调，默认为: null
         */
        to(props: any, duration: number, ease?: Function, complete?: suncom.IHandler): Tween;

        /**
         * 从props属性缓动至当前属性
         * @参数详细说明请参考Tween.to
         */
        from(props: any, duration: number, ease?: Function, complete?: suncom.IHandler): Tween;

        /**
         * 以props属性的幅度进行缓动
         * @参数详细说明请参考Tween.to
         */
        by(props: any, duration: number, ease?: Function, complete?: suncom.IHandler): Tween;

        /**
         * 等待指定时间
         */
        wait(delay: number, complete?: suncom.IHandler): Tween;

        /**
         * 是否使用对象池
         * 说明：
         * 1. 若使用了对象池，且缓动结束或被取消后没有重新指定动作，则在下一帧自动回收
         */
        usePool(value: boolean): Tween;

        /**
         * 校正缓动开始的时间戳
         */
        correctTimestamp(timestamp: number): Tween;

        /**
         * @target: 执行缓动的对象
         * @mod: 执行缓动的模块，默认为：CUSTOM
         */
        static get(target: any, mod?: ModuleEnum): Tween;

        /**
         * 取消对象身上的所有缓动
         */
        static clearAll(target: any): any;
    }

    /**
     * 命令枚举
     */
    namespace NotifyKey {
        /**
         * 启动命令
         */
        const STARTUP: string;

        /**
         * 停止命令
         */
        const SHUTDOWN: string;

        /**
         * 启用时间轴 { mod: ModuleEnum, pause: boolean }
         * @mod: 时间轴模块
         * @pause: 若为true，时间轴开始后将处于暂停模式
         * 说明：
         * 1. 参数pause并不会对SYSTEM模块的时间轴生效
         */
        const START_TIMELINE: string;

        /**
         * 暂停时间轴 { mod: ModuleEnum, stop: boolean }
         * @mod: 时间轴模块
         * @stop: 若为true，时间轴将被停止而非暂停
         * 说明：
         * 1. 时间轴停止后，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        const PAUSE_TIMELINE: string;

        /**
         * 物理帧事件（后于物理预处理事件执行）
         * 说明：
         * 1. 此事件在物理计算之后派发，故物理世界中的数据应当在此事件中被读取
         * 2. 物理计算优先于定时器事件
         * 比如：
         * 1. 你应当在此事件中获取对象的物理数据来计算，以确保你的所使用的都是物理计算完成之后的数据
         */
        const PHYSICS_FRAME: string;

        /**
         * 物理预处理事件（先于物理帧事件执行）
         * 说明：
         * 1. 此事件在物理计算之前派发，故外部的数据应当在此事件中传入物理引擎
         * 比如：
         * 1. 你可以在此事件中直接更改物理对象的位置，引擎会使用你传入的位置来参与碰撞
         */
        const PHYSICS_PREPARE: string;

        /**
         * 帧事件（进入事件）
         * 说明：
         * 1. 该事件优先于Message消息机制执行
         */
        const ENTER_FRAME: string;

        /**
         * 帧事件（晚于事件）
         * 说明：
         * 1. 该事件次后于Message消息机制执行
         */
        const LATER_FRAME: string;
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
         * @groupId: 不同编组并行执行，若为-1，则自动给预一个groupId，默认为: 0
         * @return: 返回任务的groupId，若为-1，则说明任务添加失败
         * 说明：
         * 1. 自定义的groupId的值不允许超过1000
         */
        function addTask(mod: ModuleEnum, task: ITask, groupId?: number): number;

        /**
         * 取消任务
         */
        function cancelTaskByGroupId(mod: ModuleEnum, groupId: number): void;

        /**
         * 添加触发器
         */
        function addTrigger(mod: ModuleEnum, delay: number, caller: Object, method: Function, args?: any[]): void;

        /**
         * 添加承诺
         * @method: 此方法被调用时，第一个参数必然是resolve方法，你应当在method方法执行完毕时调用resolve方法，否则该promise将永远不会结束
         */
        function addPromise(mod: ModuleEnum, caller: Object, method: Function, args?: any[]): void;

        /**
         * 添加消息
         */
        function addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, caller: Object, method: Function, args?: any[]): void;

        /**
         * 添加自定义消息
         * @message: 消息日志
         * 说明：
         * 1. 通过此接口注册的 MessageId 会无条件限制 MessagePriorityEnum.PRIORITY_LAZY 的执行，直到 MessageId 被移除
         * 2. 有时候你没法借助 System 的其它接口来限制 MessagePriorityEnum.PRIORITY_LAZY 的执行，此接口会帮助动你
         */
        function addCustomMessageId(mod: ModuleEnum, messageId: number, message?: string): void;

        /**
         * 移除自定义消息
         * @message: 消息日志
         * 说明
         * 1. 当所有 MessageId 均被移除时，对 MessagePriorityEnum.PRIORITY_LAZY 的执行限制将被解除
         */
        function removeCustomMessageId(mod: ModuleEnum, messageId: number): void;

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应间隔，若为数组，则第二个参数表示首次响应延时，且默认为：0，若首次响应延时为0，则定时器会立即执行一次
         * @method: 回调函数，默认参数：{ count: number, loops: number }
         * @caller: 回调对象
         * @args[]: 参数列表
         * @loops: 响应次数，默认为1
         * @real: 是否计算真实次数，默认为false
         */
        function addTimer(mod: ModuleEnum, delay: number | number[], method: Function, caller: Object, args?: any[], loops?: number, real?: boolean): number;

        /**
         * 移除定时器
         */
        function removeTimer(timerId: number): number;
    }

    /**
     * 运行服务
     */
    function runService(name: string, service: IService): void;

    /**
     * 停止服务
     */
    function stopService(name: string): void;
}