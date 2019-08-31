/**
 *    Copyright 2019 Binfeng Sun<christon.sun@qq.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
/**
 * @license suncore.ts (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://github.com/syfolen/suncore
 * https://blog.csdn.net/syfolen
 */
module suncore {

    /**
     * 消息优先级
     */
    export enum MessagePriorityEnum {
        /**
         * 枚举开始
         */
        MIN = 0,

        /**
         * 始终立即响应
         */
        PRIORITY_0 = MIN,

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
         */
        PRIORITY_LAZY,

        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         */
        PRIORITY_TRIGGER,

        /**
         * 任务消息
         * 说明：
         * 1. 任务消息会反复执行，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         */
        PRIORITY_TASK,

        /**
         * 网络消息
         * 说明：
         * 1. 网络消息每帧只会被派发一个
         * 2. 为了防止网络消息被清除，网络消息始终会被添加到系统消息队列中
         * 3. 当系统被暂停时，网络消息不会被广播
         */
        PRIORITY_SOCKET,

        /**
         * 枚举结束
         */
        MAX
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
    export enum ModuleEnum {
        /**
         * 枚举开始
         */
        MIN = 0,

        /**
         * 系统模块
         * 此模块为常驻模块，该模块下的消息永远不会被清理
         */
        SYSTEM = MIN,

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
     * 框架引擎接口
     */
    export interface IEngine {

        /**
         * 销毁对象
         */
        destroy(): void;

        /**
         * 获取系统运行时间（毫秒）
         */
        getTime(): number;

        /**
         * 获取帧间隔时间（毫秒）
         */
        getDelta(): number;
    }

    /**
     * 消息管理器接口
     */
    export interface IMessageManager {

        /**
         * 添加消息
         */
        putMessage(message: Message): void;

        /**
         * 处理消息
         */
        dealMessage(): void;

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void;

        /**
         * 清除所有消息
         */
        clearMessages(mod: ModuleEnum): void;
    }

    /**
     * 消息队列接口
     */
    export interface IMessageQueue {

        /**
         * 添加消息
         */
        putMessage(message: Message): void;

        /**
         * 处理消息
         */
        dealMessage(): number;

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void;

        /**
         * 清除指定模块下的所有消息
         */
        clearMessages(): void;
    }

    /**
     * Socket数据对象接口
     */
    export interface ISocketData {
        /**
         * 协议
         */
        cmd: number;

        /**
         * 挂载数据
         */
        socData: any;
    }

    /**
     * 任务接口
     */
    export interface ITask {
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
        cancel?(): void;
    }

    /**
     * 游戏时间轴接口
     */
    export interface ITimeline {

        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        lapse(delta: number): void;

        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        pause(): void;

        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认false
         */
        resume(paused?: boolean): void;

        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        stop(): void;

        /**
         * 获取系统时间戳（毫秒）
         */
        getTime(): number;

        /**
         * 获取帧时间间隔（毫秒）
         */
        getDelta(): number;

        /**
         * 时间轴是否己暂停
         */
        readonly paused: boolean;

        /**
         * 时间轴是否己停止
         */
        readonly stopped: boolean;

        /**
         * 帧同步是否己开启
         */
        readonly lockStep: boolean;
    }
    /**
     * 定时器管理器接口
     */
    export interface ITimerManager {

        /**
         * 响应定时器
         */
        executeTimer(): void;

        /**
         * 添加游戏定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 循环设定次数
         * @real: 是否计算真实次数
         * @timerId: 定时器编号，请勿擅自传入此参数，防止定时器工作出错
         * @timestamp: 定时器的创建时间，请勿擅自传入此参数，防止定时器工作出错
         * @timeout: 定时器上次响应时间，请勿擅自传入此参数，防止定时器工作出错
         * @repeat: 当前重复次数
         */
        addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops?: number, real?: boolean, timerId?: number, timestamp?: number, timeout?: number, repeat?: number): number;

        /**
         * 移除定时器
         * NOTE: 固定返回 0 ，方便外部用返回值清空 timerId
         */
        removeTimer(timerId: number): number;

        /**
         * 清除指定模块下的所有定时器
         */
        clearTimer(mod: ModuleEnum): void;
    }

    /**
     * 系统时间戳接口
     */
    export interface ITimeStamp extends ITimeline {

        /**
         * 定时器管理器
         */
        readonly timerManager: ITimerManager;

        /**
         * 消息管理器
         */
        readonly messageManager: IMessageManager;
    }

    /**
     * 任务抽象类
     */
    export abstract class AbstractTask extends puremvc.Notifier implements ITask {

        /**
         * 外部会访问此变量来判断任务是否己经完成
         */
        private $done: boolean = false;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         */
        abstract run(): boolean;

        /**
         * 任务是否己经完成
         */
        get done(): boolean {
            return this.$done;
        }
        set done(yes: boolean) {
            this.$done = yes;
        }
    }

    /**
     * 创建游戏时间轴
     */
    export class CreateTimelineCommand extends puremvc.SimpleCommand {

        execute(): void {
            System.engine = new Engine();
            System.timeline = new Timeline(false);
            System.timeStamp = new TimeStamp();
        }
    }

    /**
     * 核心类
     */
    export class Engine implements IEngine {
        /**
         * 运行时间
         */
        private $runTime: number = 0;

        /**
         * 帧时间间隔（毫秒）
         */
        private $delta: number = 0;

        /**
         * 本地时间
         */
        private $localTime: number = new Date().valueOf();

        constructor() {
            // 注册帧事件
            Laya.timer.frameLoop(1, this, this.$onFrameLoop);
        }

        /**
         * 销毁对象
         */
        destroy(): void {
            Laya.timer.clear(this, this.$onFrameLoop);
        }

        /**
         * 帧事件
         */
        private $onFrameLoop(): void {
            // 本地历史时间
            const oldTime: number = this.$localTime;
            // 本地当前时间
            this.$localTime = new Date().valueOf();

            // 帧间隔时间
            this.$delta = this.$localTime - oldTime;

            // 若帧间隔时间大于 0 ，则驱动系统运行
            if (this.$delta > 0) {
                // 运行时间累加
                this.$runTime += this.$delta;
                // 时间流逝逻辑
                System.timeStamp.lapse(this.$delta);
            }
        }

        /**
         * 获取系统运行时间（毫秒）
         */
        getTime(): number {
            return this.$runTime;
        }

        /**
         * 获取帧时间间隔（毫秒）
         */
        getDelta(): number {
            return this.$delta;
        }
    }

    /**
     * 系统消息结构
     */
    export class Message {

        /**
         * 模块
         */
        mod: ModuleEnum;

        /**
         * 优先权
         */
        priority: MessagePriorityEnum;

        /**
         * 是否己激活
         */
        active: boolean;

        /**
         * 挂载的数据对象
         */
        data: ISocketData;

        /**
         * 挂载的任务
         */
        task: ITask;

        /**
         * 回调函数
         */
        handler: suncom.IHandler;

        /**
         * 超时时间
         */
        timeout: number;
    }

    /**
     * 消息管理器
     */
    export class MessageManager implements IMessageManager {

        /**
         * 消息队列列表
         */
        private $queues: Array<IMessageQueue> = [];

        constructor() {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$queues[mod] = new MessageQueue(mod);
            }
        }

        /**
         * 添加消息
         */
        putMessage(message: Message): void {
            this.$queues[message.mod].putMessage(message);
        }

        /**
         * 处理消息
         */
        dealMessage(): void {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) == false) {
                    this.$queues[mod].dealMessage();
                }
            }
        }

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) == false) {
                    this.$queues[mod].classifyMessages0();
                }
            }
        }

        /**
         * 清除所有消息
         */
        clearMessages(mod: ModuleEnum): void {
            this.$queues[mod].clearMessages();
        }
    }

    /**
     * 消息队列
     */
    export class MessageQueue implements IMessageQueue {
        /**
         * 所属模块
         */
        private $mod: ModuleEnum;

        /**
         * 队列节点列表
         */
        private $queues: Array<Array<Message>> = [];

        /**
         * 临时消息队列
         * 说明：
         * 1. 因为消息可能产生消息，所以当前帧中所有新消息都会被放置在临时队列中，在帧结束之前统一整理至消息队列
         */
        private $messages0: Array<Message> = [];

        constructor(mod: ModuleEnum) {
            // 所属模块
            this.$mod = mod;
            // 初始化消息队列
            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority] = [];
            }
        }

        /**
         * 添加消息
         */
        putMessage(message: Message): void {
            this.$messages0.push(message);
        }

        /**
         * 处理消息
         */
        dealMessage(): number {
            // 总处理条数统计
            let dealCount: number = 0;
            // 剩余消息条数
            let remainCount: number = 0;

            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                const queue: Array<Message> = this.$queues[priority];

                // 跳过惰性消息
                if (priority == MessagePriorityEnum.PRIORITY_LAZY) {
                    continue;
                }
                // 若系统被暂停，则忽略网络消息
                if (priority == MessagePriorityEnum.PRIORITY_SOCKET && System.timeStamp.paused) {
                    continue;
                }
                // 剩余消息条数累计
                remainCount += queue.length;

                // 任务消息
                if (priority == MessagePriorityEnum.PRIORITY_TASK) {
                    // 任务消息在返回 true 表示任务己完成
                    if (queue.length > 0) {
                        if (this.$dealTaskMessage(queue[0]) == true) {
                            // 此时应当移除任务
                            queue.shift();
                        }
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 网络消息
                else if (priority == MessagePriorityEnum.PRIORITY_SOCKET) {
                    // 消息队列不为空
                    if (queue.length > 0) {
                        // 处理消息
                        this.$dealSocketMessage(queue.shift());
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 触发器消息
                else if (priority == MessagePriorityEnum.PRIORITY_TRIGGER) {
                    // 任务消息在返回 true 表示任务己完成
                    while (queue.length && this.$dealTriggerMessage(queue[0]) == true) {
                        // 此时应当移除任务
                        queue.shift();
                        // 总处理条数累加
                        dealCount++;
                    }
                }
                // 其它类型消息
                else if (queue.length) {
                    // 处理统计
                    let count: number = 0;
                    // 忽略统计
                    let ignoreCount: number = 0;
                    // 消息总条数
                    const totalCount: number = this.$getDealCountByPriority(priority);

                    // 若 totalCount 为 0 ，则表示处理所有消息
                    for (; queue.length && (totalCount == 0 || count < totalCount); count++) {
                        if (this.$dealCustomMessage(queue.shift()) == false) {
                            count--;
                            ignoreCount++;
                        }
                    }

                    // 总处理条数累加
                    dealCount += count;
                    if (System.DEBUG == true) {
                        ignoreCount && console.log(`MessageQueue=> mod:${this.$mod}, priority:${priority}, count:${count}, ignoreCount:${ignoreCount}`);
                    }
                }
            }

            // 若只剩下惰性消息，则处理惰性消息
            if (remainCount == 0 && this.$messages0.length == 0) {
                const queue: Array<Message> = this.$queues[MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    this.$dealCustomMessage(queue.shift());
                    dealCount++;
                }
            }

            return dealCount;
        }

        /**
         * 任务消息处理逻辑
         */
        private $dealTaskMessage(message: Message): boolean {
            const task: ITask = message.task;

            // 若任务没有被开启，则开启任务
            if (message.active == false) {
                message.active = true;
                if (task.run() == true) {
                    task.done = true;
                }
            }

            return task.done == true;
        }

        /**
         * 网络消息处理逻辑
         */
        private $dealSocketMessage(message: Message): void {
            const data: ISocketData = message.data;
            // NetConnectionNotifier.notify(data.cmd, data.socData);
        }

        /**
         * 触发器消息处理逻辑
         */
        private $dealTriggerMessage(message: Message): boolean {
            // 触发条件未达成
            if (message.timeout > System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            message.handler.run();

            return true;
        }

        /**
         * 其它类型消息处理逻辑
         */
        private $dealCustomMessage(message: Message): boolean {
            const res: boolean = message.handler.run();
            if (res === false) {
                return false;
            }
            return true;
        }

        /**
         * 根据优先级返回每帧允许处理的消息条数
         */
        private $getDealCountByPriority(priority: MessagePriorityEnum): number {
            if (priority == MessagePriorityEnum.PRIORITY_0) {
                return 0;
            }
            if (priority == MessagePriorityEnum.PRIORITY_HIGH) {
                return 7;
            }
            if (priority == MessagePriorityEnum.PRIORITY_NOR) {
                return 2;
            }
            if (priority == MessagePriorityEnum.PRIORITY_LOW) {
                return 1;
            }
            throw Error("错误的消息优先级");
        }

        /**
         * 将临时消息按优先级分类
         */
        classifyMessages0(): void {
            while (this.$messages0.length) {
                const message: Message = this.$messages0.shift();
                if (message.priority == MessagePriorityEnum.PRIORITY_TRIGGER) {
                    this.$addTriggerMessage(message);
                }
                else {
                    this.$queues[message.priority].push(message);
                }
            }
        }

        /**
         * 添加触发器消息
         */
        private $addTriggerMessage(message: Message): void {
            const queue: Array<Message> = this.$queues[MessagePriorityEnum.PRIORITY_TRIGGER];

            let min: number = 0;
            let mid: number = 0;
            let max: number = queue.length - 1;

            let index: number = -1;

            while (max - min > 1) {
                mid = Math.floor((min + max) * 0.5);
                if (queue[mid].timeout <= message.timeout) {
                    min = mid;
                }
                else if (queue[mid].timeout > message.timeout) {
                    max = mid;
                }
                else {
                    break;
                }
            }

            for (let i: number = min; i <= max; i++) {
                if (queue[i].timeout > message.timeout) {
                    index = i;
                    break;
                }
            }

            if (index < 0) {
                queue.push(message);
            }
            else {
                queue.splice(index, 0, message);
            }
        }

        /**
         * 清除指定模块下的所有消息
         */
        clearMessages(): void {
            this.$messages0.length = 0;
            for (let priority: MessagePriorityEnum = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority].length = 0;
            }
        }

        /**
         * 取消任务
         * @message: 目前只有task才需要被取消
         */
        private $cancelMessage(message: Message): void {
            message.task && message.task.cancel();
        }
    }

    /**
     * 命令枚举
     */
    export abstract class NotifyKey {
        // 系统命令
        static readonly STARTUP: string = "suncore.NotifyKey.STARTUP";
        static readonly SHUTDOWN: string = "suncore.NotifyKey.SHUTDOWN";
        static readonly ENTER_FRAME: string = "suncore.NotifyKey.ENTER_FRAME";

        // 时间轴命令
        static readonly CREATE_TIMELINE: string = "suncore.NotifyKey.CREATE_TIMELINE";
        static readonly REMOVE_TIMELINE: string = "suncore.NotifyKey.REMOVE_TIMELINE";
        static readonly TIMELINE_STOPPED: string = "suncore.NotifyKey.TIMELINE_STOPPED";
        static readonly TIMESTAMP_STOPPED: string = "suncore.NotifyKey.TIMESTAMP_STOPPED";
    }

    /**
     * 移除游戏时间轴
     */
    export class RemoveTimelineCommand extends puremvc.SimpleCommand {

        execute(): void {
            System.engine.destroy();
        }
    }
    /**
     * Socket数据对象
     */
    export class SocketData implements ISocketData {
        /**
         * 协议
         */
        cmd: number;

        /**
         * 挂载数据
         */
        socData: any;
    }

    export abstract class System {
        /**
         * 是否开启打印
         */
        static DEBUG: boolean = false;

        /**
         * 核心类
         */
        static engine: IEngine;

        /**
         * 游戏时间轴
         */
        static timeline: ITimeline;

        /**
         * 场景时间轴
         */
        static timeStamp: ITimeStamp;

        /**
         * 判断指定模块是否己暂停
         */
        static isModulePaused(mod: ModuleEnum): boolean {
            if (mod == ModuleEnum.CUSTOM) {
                return System.timeStamp.paused;
            }
            else if (mod == ModuleEnum.TIMELINE) {
                return System.timeline.paused;
            }
            return false;
        }

        /**
         * 获取指定模块的时间戳
         */
        static getModuleTimestamp(mod: ModuleEnum): number {
            if (mod == ModuleEnum.CUSTOM) {
                return System.timeStamp.getTime();
            }
            else if (mod == ModuleEnum.TIMELINE) {
                return System.timeline.getTime();
            }
            return System.engine.getTime();
        }

        /**
         * 添加任务
         */
        static addTask(mod: ModuleEnum, task: ITask): void {
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn(`System=> add task failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return;
            }
            const message: Message = new Message();
            message.mod = mod;
            message.task = task;
            message.active = false;
            message.priority = MessagePriorityEnum.PRIORITY_TASK;
            System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加触发器
         */
        static addTrigger(mod: ModuleEnum, delay: number, handler: suncom.IHandler): void {
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn(`System=> add trigger failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return;
            }
            // 获取模块依赖的时间轴的时间戳
            const message: Message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.timeout = System.getModuleTimestamp(mod) + delay;
            message.priority = MessagePriorityEnum.PRIORITY_TRIGGER;
            System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加网络消息
         * @cmd: 值为 SOCKET_STATE_CHANGE 表示掉线重连消息
         * @TODO: 不确定网络消息在切换场景的时候是否会被清理掉
         */
        static addSocketMessage(cmd: number, socData: any): void {
            const data: ISocketData = new SocketData();
            data.cmd = cmd;
            data.socData = socData;
            const message: Message = new Message();
            message.mod = ModuleEnum.SYSTEM;
            message.data = data;
            message.priority = MessagePriorityEnum.PRIORITY_SOCKET;
            return System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加消息
         */
        static addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, handler: suncom.IHandler): void {
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn(`System=> add message failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return;
            }
            const message: Message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.priority = priority;
            System.timeStamp.messageManager.putMessage(message);
        }

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数
         */
        static addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops: number = 1, real: boolean = false): number {
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn(`System=> add timer failed, cos module ${suncom.Common.convertEnumToString(mod, ModuleEnum)} is paused.`);
                }
                return 0;
            }
            return System.timeStamp.timerManager.addTimer(mod, delay, method, caller, loops, real);
        }

        /**
         * 移除定时器
         */
        static removeTimer(timerId: number): number {
            return System.timeStamp.timerManager.removeTimer(timerId);
        }
    }

    /**
     * 时间轴类
     * 
     * 说明：
     * 1. 游戏时间轴实现
     * 1. 游戏时间轴中并没有关于计算游戏时间的真正的实现
     * 2. 若游戏是基于帧同步的，则游戏时间以服务端时间为准
     * 3. 若游戏是基于状态同步的，则游戏时间以框架时间为准
     * 
     * 注意：
     * 1. 由于此类为系统类，故请勿擅自对此类进行实例化
     */
    export class Timeline implements ITimeline {

        /**
         * 是否己暂停
         */
        protected $paused: boolean = true;

        /**
         * 是否己停止
         */
        protected $stopped: boolean = true;

        /**
         * 运行时间
         */
        private $runTime: number = 0;

        /**
         * 帧时间间隔（毫秒）
         */
        private $delta: number = 0;

        /**
         * 是否开启帧同步
         */
        private $lockStep: boolean;

        /**
         * @lockStep: 是否开启帧同步
         * 说明：
         * 1. 时间轴模块下的消息和定时器只有在时间轴被激活的情况下才会被处理。
         */
        constructor(lockStep: boolean) {
            // 是否开启帧同步
            this.$lockStep = lockStep;
        }

        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        lapse(delta: number): void {
            this.$delta = delta;
            // 运行时间累加
            this.$runTime += delta;
        }

        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        pause(): void {
            this.$paused = true;
        }

        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认false
         */
        resume(paused: boolean = false): void {
            this.$paused = paused;
            this.$stopped = false;
        }

        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        stop(): void {
            this.$stopped = true;
            // 清除定时器
            System.timeStamp.timerManager.clearTimer(ModuleEnum.TIMELINE);
            // 清除任务消息
            System.timeStamp.messageManager.clearMessages(ModuleEnum.TIMELINE);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMELINE_STOPPED);
        }

        /**
         * 获取系统时间戳（毫秒）
         */
        getTime(): number {
            return this.$runTime;
        }

        /**
         * 获取帧时间间隔（毫秒）
         */
        getDelta(): number {
            return this.$delta;
        }

        /**
         * 时间轴是否己暂停
         */
        get paused(): boolean {
            return this.$paused;
        }

        /**
         * 时间轴是否己停止
         */
        get stopped(): boolean {
            return this.$stopped;
        }

        /**
         * 帧同步是否己开启
         */
        get lockStep(): boolean {
            return this.$lockStep;
        }
    }

    /**
     * 自定义定时器
     */
    export class Timer {
        /**
         * 模块
         */
        mod: ModuleEnum;

        /**
         * 是否己激活
         */
        active: boolean;

        /**
         * 响应延时
         */
        delay: number;

        /**
         * 回调函数
         */
        method: Function;

        /**
         * 回调对象
         */
        caller: Object;

        /**
         * 统计真实响应次数
         * 说明：
         * 1. 为 false 时，定时器实际响应次数可能不足设定次数
         * 2. 在侧重于次数精准统计的应用中，建议此参数为 true
         * 3. 在侧重于时间精准统计的应用中，建议此参数为 false
         */
        real: boolean;

        /**
         * 循环设定次数
         */
        loops: number;

        /**
         * 当前重复次数
         */
        repeat: number;

        /**
         * 定时器编号
         */
        timerId: number;

        /**
         * 创建时间
         */
        timestamp: number;

        /**
         * 超时时间，当系统时间大于或等于超时时间时，定时器会被响应
         */
        timeout: number;
    }

    /**
     * 定时器管理器
     */
    export class TimerManager implements ITimerManager {
        /**
         * 定时器种子
         */
        private $seedId: number = 0;

        /**
         * 定时器列表
         */
        private $timers: Array<Array<Timer>> = [];

        /**
         * 定时器集合
         */
        private $timerMap: { [id: number]: Timer } = {};

        constructor() {
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$timers[mod] = [];
            }
        }

        /**
         * 生成新的定时器索引
         */
        private $createNewTimerId(): number {
            this.$seedId++;
            return this.$seedId;
        }

        /**
         * 响应定时器
         */
        executeTimer(): void {
            // 遍历所有模块中的所有定时器
            for (let mod: ModuleEnum = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                // 获取模块中的所有定时器
                const timers: Array<Timer> = this.$timers[mod];
                // 获取当前时间戳
                const timestamp: number = System.getModuleTimestamp(mod);
                // 当前模块未暂停
                if (System.isModulePaused(mod) == false) {
                    // 对模块中的所有定时器进行遍历
                    while (timers.length) {
                        const timer: Timer = timers[0];

                        // 若定时器有效
                        if (timer.active) {
                            // 若定时器未到响应时间，则跳出
                            if (timer.timeout > timestamp) {
                                break;
                            }
                            // 若 real 为 true ，则对执行次数进行真实递增
                            if (timer.real == true) {
                                timer.repeat++;
                            }
                            // 否则计算当前理论上的响应次数
                            else {
                                timer.repeat = Math.floor((timestamp - timer.timestamp) / timer.delay);
                            }
                        }

                        // 移除无效定时器
                        if (timer.active == false || (timer.loops > 0 && timer.repeat >= timer.loops)) {
                            delete this.$timerMap[timer.timerId];
                        }
                        else {
                            this.addTimer(timer.mod, timer.delay, timer.method, timer.caller, timer.loops, timer.real, timer.timerId, timer.timestamp, timer.timeout, timer.repeat);
                        }
                        timers.shift();

                        if (timer.active) {
                            timer.method.call(timer.caller, timer.repeat, timer.loops);
                        }
                    }
                }
            }
        }

        /**
         * 添加游戏定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 循环设定次数
         * @real: 是否计算真实次数
         * @timerId: 定时器编号，请勿擅自传入此参数，防止定时器工作出错
         * @timestamp: 定时器的创建时间，请勿擅自传入此参数，防止定时器工作出错
         * @timeout: 定时器上次响应时间，请勿擅自传入此参数，防止定时器工作出错
         * @repeat: 当前重复次数
         */
        addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops: number = 1, real: boolean = false, timerId: number = 0, timestamp: number = -1, timeout: number = -1, repeat: number = 0): number {
            const timer: Timer = new Timer();
            const currentTimestamp: number = System.getModuleTimestamp(mod);

            // 若编号未指定，则生成新的定时器
            if (timerId == 0) {
                timerId = this.$createNewTimerId();
            }
            // 若创建时间未指定，则默认为系统时间
            if (timestamp == -1) {
                timestamp = currentTimestamp;
            }
            // 若上次响应时间未指定，则默认为系统时间
            if (timeout == -1) {
                timeout = currentTimestamp;
            }

            // 定时器执行间隔不得小于 1 毫秒
            if (delay < 1) {
                throw Error("非法的定时器执行间隔");
            }

            // 响应时间偏差值
            let dev: number = 0;

            // 根据定时器的特性来修正下次响应时间
            if (real == true) {
                /**
                 * 若定时器侧重于真实响应次数统计
                 * 为了确保定时器的两次响应之间的时间间隔完全一致
                 * 定时器的响应时间偏差值应当根据上次定时器的响应时间来计算
                 */
                dev = (currentTimestamp - timeout) % delay;
            }
            else {
                /**
                 * 若定时器侧重于精准的时间统计
                 * 为了确保定时器开启与结束时的时间差与定时器的设定相符
                 * 定时器的响应时间偏差值应当根据定时器的创建时间来计算
                 */
                // 避免定时器响应时间不精确
                dev = (currentTimestamp - timestamp) % delay;
            }

            // 修正超时时间
            timeout = currentTimestamp + delay - dev;

            // 对定时器进行实例化
            timer.mod = mod;
            timer.active = true;
            timer.delay = delay;
            timer.method = method;
            timer.caller = caller;
            timer.real = real;
            timer.loops = loops;
            timer.repeat = repeat;
            timer.timerId = timerId;
            timer.timestamp = timestamp;
            timer.timeout = timeout;

            // 获取对应模块的定时器列表
            const timers: Array<Timer> = this.$timers[mod];

            let index: number = -1;

            let min: number = 0;
            let mid: number = 0;
            let max: number = timers.length - 1;

            while (max - min > 1) {
                mid = Math.floor((min + max) * 0.5);
                if (timers[mid].timeout <= timeout) {
                    min = mid;
                }
                else if (timers[mid].timeout > timeout) {
                    max = mid;
                }
                else {
                    break;
                }
            }

            for (let i: number = min; i <= max; i++) {
                if (timers[i].timeout > timeout) {
                    index = i;
                    break;
                }
            }

            if (index < 0) {
                timers.push(timer);
            }
            else {
                timers.splice(index, 0, timer);
            }
            this.$timerMap[timerId] = timer;

            return timerId;
        }

        /**
         * 移除定时器
         * NOTE: 固定返回 0 ，方便外部用返回值清空 timerId
         */
        removeTimer(timerId: number): number {
            if (timerId && this.$timerMap[timerId]) {
                this.$timerMap[timerId].active = false;
            }
            return 0;
        }

        /**
         * 清除指定模块下的所有定时器
         */
        clearTimer(mod: ModuleEnum): void {
            const timers: Array<Timer> = this.$timers[mod];
            while (timers.length) {
                const timer: Timer = timers.pop();
                delete this.$timerMap[timer.timerId];
            }
        }
    }

    /**
     * 简单任务对象
     */
    export class SimpleTask extends AbstractTask {
        /**
         * 任务逻辑Handler
         */
        private $handler: suncom.IHandler;

        constructor(handler: suncom.IHandler) {
            super();
            this.$handler = handler;
        }

        /**
         * 执行函数
         */
        run(): boolean {
            // 执行任务
            this.$handler.run();

            return true;
        }
    }

    /**
     * 系统时间戳
     * 
     * 此类实现了整个客户端的核心机制，包括：
     * 1. 系统时间戳实现
     * 2. 游戏时间轴调度
     * 3. 自定义定时器调度
     * 4. 不同类型游戏消息的派发
     */
    export class TimeStamp extends Timeline implements ITimeStamp {

        /**
         * 定时器管理器
         */
        private $timerManager: ITimerManager = new TimerManager();

        /**
         * 消息管理器
         */
        private $messageManager: IMessageManager = new MessageManager();

        constructor() {
            super(false);
        }

        /**
         * 帧事件
         */
        lapse(delta: number): void {
            // 游戏未暂停
            if (this.paused == false) {
                super.lapse(delta);

                // 时间轴未暂停
                if (System.timeline.paused == false) {
                    // 若游戏时间轴未开启帧同步，则直接对游戏时间进行同步
                    if (System.timeline.lockStep == false) {
                        System.timeline.lapse(delta);
                    }
                }
            }

            // 响应定时器
            this.$timerManager.executeTimer();

            // 处理消息
            this.$messageManager.dealMessage();
            // 处理临时消息
            this.$messageManager.classifyMessages0();

            // 始终派发帧事件
            puremvc.Facade.getInstance().sendNotification(NotifyKey.ENTER_FRAME);
        }

        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        stop(): void {
            this.$stopped = true;
            // 清除定时器
            System.timeStamp.timerManager.clearTimer(ModuleEnum.CUSTOM);
            // 清除任务消息
            System.timeStamp.messageManager.clearMessages(ModuleEnum.CUSTOM);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMESTAMP_STOPPED);
        }

        /**
         * 获取自定义定时器管理器
         */
        get timerManager(): ITimerManager {
            return this.$timerManager;
        }

        /**
         * 获取消息管理器
         */
        get messageManager(): IMessageManager {
            return this.$messageManager;
        }
    }

}
