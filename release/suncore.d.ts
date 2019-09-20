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
 * @license suncore.d.ts (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/suncore
 */
declare module suncore {

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
    export interface ITimeline {

        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        pause(): void;

        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认为false
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
     * 系统时间戳
     * 
     * 此类实现了整个客户端的核心机制，包括：
     * 1. 系统时间戳实现
     * 2. 游戏时间轴调度
     * 3. 自定义定时器调度
     * 4. 不同类型游戏消息的派发
     */
    export interface ITimeStamp extends ITimeline {
        
    }

    /**
     * 任务抽象类
     */
    export abstract class AbstractTask extends puremvc.Notifier implements ITask {

        /**
         * 外部会访问此变量来判断任务是否己经完成
         */
        private $done: boolean;

        /**
         * 执行函数
         * @return: 为true时表示任务立刻完成，若返回false，则需要在其它函数中将done置为true，否则任务永远无法结束
         */
        abstract run(): boolean;

        /**
         * 任务是否己经完成
         */
        done: boolean;
    }

    /**
     * 创建游戏时间轴
     */
    export class CreateTimelineCommand extends puremvc.SimpleCommand {

        execute(): void;
    }

    /**
     * 命令枚举
     */
    export abstract class NotifyKey {
        // 系统命令
        static readonly STARTUP: string;
        static readonly SHUTDOWN: string;
        static readonly FRAME_ENTER: string;
        static readonly FRAME_LATER: string;

        // 时间轴命令
        static readonly CREATE_TIMELINE: string;
        static readonly REMOVE_TIMELINE: string;
        static readonly TIMELINE_STOPPED: string;
        static readonly TIMESTAMP_STOPPED: string;
    }

    /**
     * 移除游戏时间轴
     */
    export class RemoveTimelineCommand extends puremvc.SimpleCommand {

        execute(): void;
    }

    export abstract class System {

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
        static isModulePaused(mod: ModuleEnum): boolean;

        /**
         * 获取指定模块的时间戳
         */
        static getModuleTimestamp(mod: ModuleEnum): number;

        /**
         * 添加任务
         */
        static addTask(mod: ModuleEnum, task: ITask): void;

        /**
         * 添加触发器
         */
        static addTrigger(mod: ModuleEnum, delay: number, handler: suncom.IHandler): void;

        /**
         * 添加网络消息
         * @cmd: 值为 SOCKET_STATE_CHANGE 表示掉线重连消息
         * @TODO: 不确定网络消息在切换场景的时候是否会被清理掉
         */
        static addSocketMessage(cmd: number, socData: any): void;

        /**
         * 添加消息
         */
        static addMessage(mod: ModuleEnum, priority: MessagePriorityEnum, handler: suncom.IHandler): void;

        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数，默认1
         * @real:是否按设定的次数真实执行，默认为fase
         */
        static addTimer(mod: ModuleEnum, delay: number, method: Function, caller: Object, loops?: number, real?: boolean): number;

        /**
         * 移除定时器
         */
        static removeTimer(timerId: number): number;
    }

    /**
     * 网络消息派发器
     */
    export abstract class MessageNotifier {

        /**
         * 通知网络消息
         */
        static notify(cmd: number, data: any): void;

        /**
         * 注册网络消息监听
         */
        static register(cmd: number, method: Function, caller: Object): void;

        /**
         * 移除网络消息监听
         */
        static unregister(cmd: number, method: Function, caller: Object): void;
    }

    /**
     * 简单任务对象
     */
    export class SimpleTask extends AbstractTask {
        /**
         * 任务逻辑Handler
         */
        private $handler: suncom.IHandler;

        constructor(handler: suncom.IHandler);

        /**
         * 执行函数
         */
        run(): boolean;
    }
}