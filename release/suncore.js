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
 * @license suncore.js (c) 2019 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/suncore
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @license suncore.js (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the Apache License, Version 2.0
 * https://github.com/syfolen/suncore
 * https://blog.csdn.net/syfolen
 */
var suncore;
(function (suncore) {
    /**
     * 消息优先级
     */
    var MessagePriorityEnum;
    (function (MessagePriorityEnum) {
        /**
         * 枚举开始
         */
        MessagePriorityEnum[MessagePriorityEnum["MIN"] = 0] = "MIN";
        /**
         * 始终立即响应
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_0"] = 0] = "PRIORITY_0";
        /**
         * 每帧至多响应十次消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_HIGH"] = 1] = "PRIORITY_HIGH";
        /**
         * 每帧至多响应三次的消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_NOR"] = 2] = "PRIORITY_NOR";
        /**
         * 每帧至多响应一次的消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LOW"] = 3] = "PRIORITY_LOW";
        /**
         * 惰性消息
         * 说明：
         * 1. 当前帧若没有处理过任何消息，则会处理此类型的消息
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_LAZY"] = 4] = "PRIORITY_LAZY";
        /**
         * 触发器消息
         * 说明：
         * 1. 触发器在指定时刻必定会被触发
         * 2. 为了简化系统，同一个触发器只能被触发一次
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TRIGGER"] = 5] = "PRIORITY_TRIGGER";
        /**
         * 任务消息
         * 说明：
         * 1. 任务消息会反复执行，直至任务完成
         * 2. 新的任务只会在下一帧被开始执行
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_TASK"] = 6] = "PRIORITY_TASK";
        /**
         * 网络消息
         * 说明：
         * 1. 网络消息每帧只会被派发一个
         * 2. 为了防止网络消息被清除，网络消息始终会被添加到系统消息队列中
         * 3. 当系统被暂停时，网络消息不会被广播
         */
        MessagePriorityEnum[MessagePriorityEnum["PRIORITY_SOCKET"] = 7] = "PRIORITY_SOCKET";
        /**
         * 枚举结束
         */
        MessagePriorityEnum[MessagePriorityEnum["MAX"] = 8] = "MAX";
    })(MessagePriorityEnum = suncore.MessagePriorityEnum || (suncore.MessagePriorityEnum = {}));
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
    var ModuleEnum;
    (function (ModuleEnum) {
        /**
         * 枚举开始
         */
        ModuleEnum[ModuleEnum["MIN"] = 0] = "MIN";
        /**
         * 系统模块
         * 此模块为常驻模块，该模块下的消息永远不会被清理
         */
        ModuleEnum[ModuleEnum["SYSTEM"] = 0] = "SYSTEM";
        /**
         * 通用模块
         * 此模块下的消息会在当前场景退出的同时被清理
         */
        ModuleEnum[ModuleEnum["CUSTOM"] = 1] = "CUSTOM";
        /**
         * 时间轴模块
         * 此模块下的消息会在时间轴被销毁的同时被清理
         */
        ModuleEnum[ModuleEnum["TIMELINE"] = 2] = "TIMELINE";
        /**
         * 枚举结束
         */
        ModuleEnum[ModuleEnum["MAX"] = 3] = "MAX";
    })(ModuleEnum = suncore.ModuleEnum || (suncore.ModuleEnum = {}));
    /**
     * 任务抽象类
     */
    var AbstractTask = /** @class */ (function (_super) {
        __extends(AbstractTask, _super);
        function AbstractTask() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 外部会访问此变量来判断任务是否己经完成
             */
            _this.$done = false;
            return _this;
        }
        Object.defineProperty(AbstractTask.prototype, "done", {
            /**
             * 任务是否己经完成
             */
            get: function () {
                return this.$done;
            },
            set: function (yes) {
                this.$done = yes;
            },
            enumerable: true,
            configurable: true
        });
        return AbstractTask;
    }(puremvc.Notifier));
    suncore.AbstractTask = AbstractTask;
    /**
     * 创建游戏时间轴
     */
    var CreateTimelineCommand = /** @class */ (function (_super) {
        __extends(CreateTimelineCommand, _super);
        function CreateTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreateTimelineCommand.prototype.execute = function () {
            System.engine = new Engine();
            System.timeline = new Timeline(false);
            System.timeStamp = new TimeStamp();
        };
        return CreateTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.CreateTimelineCommand = CreateTimelineCommand;
    /**
     * 核心类
     */
    var Engine = /** @class */ (function () {
        function Engine() {
            /**
             * 运行时间
             */
            this.$runTime = 0;
            /**
             * 帧时间间隔（毫秒）
             */
            this.$delta = 0;
            /**
             * 本地时间
             */
            this.$localTime = new Date().valueOf();
            // 注册帧事件
            Laya.timer.frameLoop(1, this, this.$onFrameLoop);
        }
        /**
         * 销毁对象
         */
        Engine.prototype.destroy = function () {
            Laya.timer.clear(this, this.$onFrameLoop);
        };
        /**
         * 帧事件
         */
        Engine.prototype.$onFrameLoop = function () {
            // 本地历史时间
            var oldTime = this.$localTime;
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
        };
        /**
         * 获取系统运行时间（毫秒）
         */
        Engine.prototype.getTime = function () {
            return this.$runTime;
        };
        /**
         * 获取帧时间间隔（毫秒）
         */
        Engine.prototype.getDelta = function () {
            return this.$delta;
        };
        return Engine;
    }());
    suncore.Engine = Engine;
    /**
     * 系统消息结构
     */
    var Message = /** @class */ (function () {
        function Message() {
        }
        return Message;
    }());
    suncore.Message = Message;
    /**
     * 消息管理器
     */
    var MessageManager = /** @class */ (function () {
        function MessageManager() {
            /**
             * 消息队列列表
             */
            this.$queues = [];
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$queues[mod] = new MessageQueue(mod);
            }
        }
        /**
         * 添加消息
         */
        MessageManager.prototype.putMessage = function (message) {
            this.$queues[message.mod].putMessage(message);
        };
        /**
         * 处理消息
         */
        MessageManager.prototype.dealMessage = function () {
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) == false) {
                    this.$queues[mod].dealMessage();
                }
            }
        };
        /**
         * 将临时消息按优先级分类
         */
        MessageManager.prototype.classifyMessages0 = function () {
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                if (System.isModulePaused(mod) == false) {
                    this.$queues[mod].classifyMessages0();
                }
            }
        };
        /**
         * 清除所有消息
         */
        MessageManager.prototype.clearMessages = function (mod) {
            this.$queues[mod].clearMessages();
        };
        return MessageManager;
    }());
    suncore.MessageManager = MessageManager;
    /**
     * 消息队列
     */
    var MessageQueue = /** @class */ (function () {
        function MessageQueue(mod) {
            /**
             * 队列节点列表
             */
            this.$queues = [];
            /**
             * 临时消息队列
             * 说明：
             * 1. 因为消息可能产生消息，所以当前帧中所有新消息都会被放置在临时队列中，在帧结束之前统一整理至消息队列
             */
            this.$messages0 = [];
            // 所属模块
            this.$mod = mod;
            // 初始化消息队列
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority] = [];
            }
        }
        /**
         * 添加消息
         */
        MessageQueue.prototype.putMessage = function (message) {
            this.$messages0.push(message);
        };
        /**
         * 处理消息
         */
        MessageQueue.prototype.dealMessage = function () {
            // 总处理条数统计
            var dealCount = 0;
            // 剩余消息条数
            var remainCount = 0;
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                var queue = this.$queues[priority];
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
                    var count = 0;
                    // 忽略统计
                    var ignoreCount = 0;
                    // 消息总条数
                    var totalCount = this.$getDealCountByPriority(priority);
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
                        ignoreCount && console.log("MessageQueue=> mod:" + this.$mod + ", priority:" + priority + ", count:" + count + ", ignoreCount:" + ignoreCount);
                    }
                }
            }
            // 若只剩下惰性消息，则处理惰性消息
            if (remainCount == 0 && this.$messages0.length == 0) {
                var queue = this.$queues[MessagePriorityEnum.PRIORITY_LAZY];
                if (queue.length > 0) {
                    this.$dealCustomMessage(queue.shift());
                    dealCount++;
                }
            }
            return dealCount;
        };
        /**
         * 任务消息处理逻辑
         */
        MessageQueue.prototype.$dealTaskMessage = function (message) {
            var task = message.task;
            // 若任务没有被开启，则开启任务
            if (message.active == false) {
                message.active = true;
                if (task.run() == true) {
                    task.done = true;
                }
            }
            return task.done == true;
        };
        /**
         * 网络消息处理逻辑
         */
        MessageQueue.prototype.$dealSocketMessage = function (message) {
            var data = message.data;
            // NetConnectionNotifier.notify(data.cmd, data.socData);
        };
        /**
         * 触发器消息处理逻辑
         */
        MessageQueue.prototype.$dealTriggerMessage = function (message) {
            // 触发条件未达成
            if (message.timeout > System.getModuleTimestamp(this.$mod)) {
                return false;
            }
            message.handler.run();
            return true;
        };
        /**
         * 其它类型消息处理逻辑
         */
        MessageQueue.prototype.$dealCustomMessage = function (message) {
            var res = message.handler.run();
            if (res === false) {
                return false;
            }
            return true;
        };
        /**
         * 根据优先级返回每帧允许处理的消息条数
         */
        MessageQueue.prototype.$getDealCountByPriority = function (priority) {
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
        };
        /**
         * 将临时消息按优先级分类
         */
        MessageQueue.prototype.classifyMessages0 = function () {
            while (this.$messages0.length) {
                var message = this.$messages0.shift();
                if (message.priority == MessagePriorityEnum.PRIORITY_TRIGGER) {
                    this.$addTriggerMessage(message);
                }
                else {
                    this.$queues[message.priority].push(message);
                }
            }
        };
        /**
         * 添加触发器消息
         */
        MessageQueue.prototype.$addTriggerMessage = function (message) {
            var queue = this.$queues[MessagePriorityEnum.PRIORITY_TRIGGER];
            var min = 0;
            var mid = 0;
            var max = queue.length - 1;
            var index = -1;
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
            for (var i = min; i <= max; i++) {
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
        };
        /**
         * 清除指定模块下的所有消息
         */
        MessageQueue.prototype.clearMessages = function () {
            this.$messages0.length = 0;
            for (var priority = MessagePriorityEnum.MIN; priority < MessagePriorityEnum.MAX; priority++) {
                this.$queues[priority].length = 0;
            }
        };
        /**
         * 取消任务
         * @message: 目前只有task才需要被取消
         */
        MessageQueue.prototype.$cancelMessage = function (message) {
            message.task && message.task.cancel();
        };
        return MessageQueue;
    }());
    suncore.MessageQueue = MessageQueue;
    /**
     * 命令枚举
     */
    var NotifyKey = /** @class */ (function () {
        function NotifyKey() {
        }
        // 系统命令
        NotifyKey.STARTUP = "suncore.NotifyKey.STARTUP";
        NotifyKey.SHUTDOWN = "suncore.NotifyKey.SHUTDOWN";
        NotifyKey.ENTER_FRAME = "suncore.NotifyKey.ENTER_FRAME";
        // 时间轴命令
        NotifyKey.CREATE_TIMELINE = "suncore.NotifyKey.CREATE_TIMELINE";
        NotifyKey.REMOVE_TIMELINE = "suncore.NotifyKey.REMOVE_TIMELINE";
        NotifyKey.TIMELINE_STOPPED = "suncore.NotifyKey.TIMELINE_STOPPED";
        NotifyKey.TIMESTAMP_STOPPED = "suncore.NotifyKey.TIMESTAMP_STOPPED";
        return NotifyKey;
    }());
    suncore.NotifyKey = NotifyKey;
    /**
     * 移除游戏时间轴
     */
    var RemoveTimelineCommand = /** @class */ (function (_super) {
        __extends(RemoveTimelineCommand, _super);
        function RemoveTimelineCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RemoveTimelineCommand.prototype.execute = function () {
            System.engine.destroy();
        };
        return RemoveTimelineCommand;
    }(puremvc.SimpleCommand));
    suncore.RemoveTimelineCommand = RemoveTimelineCommand;
    /**
     * Socket数据对象
     */
    var SocketData = /** @class */ (function () {
        function SocketData() {
        }
        return SocketData;
    }());
    suncore.SocketData = SocketData;
    var System = /** @class */ (function () {
        function System() {
        }
        /**
         * 判断指定模块是否己暂停
         */
        System.isModulePaused = function (mod) {
            if (mod == ModuleEnum.CUSTOM) {
                return System.timeStamp.paused;
            }
            else if (mod == ModuleEnum.TIMELINE) {
                return System.timeline.paused;
            }
            return false;
        };
        /**
         * 获取指定模块的时间戳
         */
        System.getModuleTimestamp = function (mod) {
            if (mod == ModuleEnum.CUSTOM) {
                return System.timeStamp.getTime();
            }
            else if (mod == ModuleEnum.TIMELINE) {
                return System.timeline.getTime();
            }
            return System.engine.getTime();
        };
        /**
         * 添加任务
         */
        System.addTask = function (mod, task) {
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn("System=> add task failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.task = task;
            message.active = false;
            message.priority = MessagePriorityEnum.PRIORITY_TASK;
            System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加触发器
         */
        System.addTrigger = function (mod, delay, handler) {
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn("System=> add trigger failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return;
            }
            // 获取模块依赖的时间轴的时间戳
            var message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.timeout = System.getModuleTimestamp(mod) + delay;
            message.priority = MessagePriorityEnum.PRIORITY_TRIGGER;
            System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加网络消息
         * @cmd: 值为 SOCKET_STATE_CHANGE 表示掉线重连消息
         * @TODO: 不确定网络消息在切换场景的时候是否会被清理掉
         */
        System.addSocketMessage = function (cmd, socData) {
            var data = new SocketData();
            data.cmd = cmd;
            data.socData = socData;
            var message = new Message();
            message.mod = ModuleEnum.SYSTEM;
            message.data = data;
            message.priority = MessagePriorityEnum.PRIORITY_SOCKET;
            return System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加消息
         */
        System.addMessage = function (mod, priority, handler) {
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn("System=> add message failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return;
            }
            var message = new Message();
            message.mod = mod;
            message.handler = handler;
            message.priority = priority;
            System.timeStamp.messageManager.putMessage(message);
        };
        /**
         * 添加自定义定时器
         * @mod: 所属模块
         * @delay: 响应延时
         * @method: 回调函数
         * @caller: 回调对象
         * @loops: 响应次数
         */
        System.addTimer = function (mod, delay, method, caller, loops, real) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (System.isModulePaused(mod) == true) {
                if (System.DEBUG == true) {
                    console.warn("System=> add timer failed, cos module " + suncom.Common.convertEnumToString(mod, ModuleEnum) + " is paused.");
                }
                return 0;
            }
            return System.timeStamp.timerManager.addTimer(mod, delay, method, caller, loops, real);
        };
        /**
         * 移除定时器
         */
        System.removeTimer = function (timerId) {
            return System.timeStamp.timerManager.removeTimer(timerId);
        };
        /**
         * 是否开启打印
         */
        System.DEBUG = false;
        return System;
    }());
    suncore.System = System;
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
    var Timeline = /** @class */ (function () {
        /**
         * @lockStep: 是否开启帧同步
         * 说明：
         * 1. 时间轴模块下的消息和定时器只有在时间轴被激活的情况下才会被处理。
         */
        function Timeline(lockStep) {
            /**
             * 是否己暂停
             */
            this.$paused = true;
            /**
             * 是否己停止
             */
            this.$stopped = true;
            /**
             * 运行时间
             */
            this.$runTime = 0;
            /**
             * 帧时间间隔（毫秒）
             */
            this.$delta = 0;
            // 是否开启帧同步
            this.$lockStep = lockStep;
        }
        /**
         * 时间流逝
         * @delta: 每帧的时间流逝值，单位为毫秒
         */
        Timeline.prototype.lapse = function (delta) {
            this.$delta = delta;
            // 运行时间累加
            this.$runTime += delta;
        };
        /**
         * 暂停时间轴
         * 1. 时间轴暂停时，对应的模块允许被添加任务
         */
        Timeline.prototype.pause = function () {
            this.$paused = true;
        };
        /**
         * 继续时间轴
         * @paused: 是否暂停时间轴，默认false
         */
        Timeline.prototype.resume = function (paused) {
            if (paused === void 0) { paused = false; }
            this.$paused = paused;
            this.$stopped = false;
        };
        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        Timeline.prototype.stop = function () {
            this.$stopped = true;
            // 清除定时器
            System.timeStamp.timerManager.clearTimer(ModuleEnum.TIMELINE);
            // 清除任务消息
            System.timeStamp.messageManager.clearMessages(ModuleEnum.TIMELINE);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMELINE_STOPPED);
        };
        /**
         * 获取系统时间戳（毫秒）
         */
        Timeline.prototype.getTime = function () {
            return this.$runTime;
        };
        /**
         * 获取帧时间间隔（毫秒）
         */
        Timeline.prototype.getDelta = function () {
            return this.$delta;
        };
        Object.defineProperty(Timeline.prototype, "paused", {
            /**
             * 时间轴是否己暂停
             */
            get: function () {
                return this.$paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timeline.prototype, "stopped", {
            /**
             * 时间轴是否己停止
             */
            get: function () {
                return this.$stopped;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timeline.prototype, "lockStep", {
            /**
             * 帧同步是否己开启
             */
            get: function () {
                return this.$lockStep;
            },
            enumerable: true,
            configurable: true
        });
        return Timeline;
    }());
    suncore.Timeline = Timeline;
    /**
     * 自定义定时器
     */
    var Timer = /** @class */ (function () {
        function Timer() {
        }
        return Timer;
    }());
    suncore.Timer = Timer;
    /**
     * 定时器管理器
     */
    var TimerManager = /** @class */ (function () {
        function TimerManager() {
            /**
             * 定时器种子
             */
            this.$seedId = 0;
            /**
             * 定时器列表
             */
            this.$timers = [];
            /**
             * 定时器集合
             */
            this.$timerMap = {};
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                this.$timers[mod] = [];
            }
        }
        /**
         * 生成新的定时器索引
         */
        TimerManager.prototype.$createNewTimerId = function () {
            this.$seedId++;
            return this.$seedId;
        };
        /**
         * 响应定时器
         */
        TimerManager.prototype.executeTimer = function () {
            // 遍历所有模块中的所有定时器
            for (var mod = ModuleEnum.MIN; mod < ModuleEnum.MAX; mod++) {
                // 获取模块中的所有定时器
                var timers = this.$timers[mod];
                // 获取当前时间戳
                var timestamp = System.getModuleTimestamp(mod);
                // 当前模块未暂停
                if (System.isModulePaused(mod) == false) {
                    // 对模块中的所有定时器进行遍历
                    while (timers.length) {
                        var timer = timers[0];
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
        };
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
        TimerManager.prototype.addTimer = function (mod, delay, method, caller, loops, real, timerId, timestamp, timeout, repeat) {
            if (loops === void 0) { loops = 1; }
            if (real === void 0) { real = false; }
            if (timerId === void 0) { timerId = 0; }
            if (timestamp === void 0) { timestamp = -1; }
            if (timeout === void 0) { timeout = -1; }
            if (repeat === void 0) { repeat = 0; }
            var timer = new Timer();
            var currentTimestamp = System.getModuleTimestamp(mod);
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
            var dev = 0;
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
            var timers = this.$timers[mod];
            var index = -1;
            var min = 0;
            var mid = 0;
            var max = timers.length - 1;
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
            for (var i = min; i <= max; i++) {
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
        };
        /**
         * 移除定时器
         * NOTE: 固定返回 0 ，方便外部用返回值清空 timerId
         */
        TimerManager.prototype.removeTimer = function (timerId) {
            if (timerId && this.$timerMap[timerId]) {
                this.$timerMap[timerId].active = false;
            }
            return 0;
        };
        /**
         * 清除指定模块下的所有定时器
         */
        TimerManager.prototype.clearTimer = function (mod) {
            var timers = this.$timers[mod];
            while (timers.length) {
                var timer = timers.pop();
                delete this.$timerMap[timer.timerId];
            }
        };
        return TimerManager;
    }());
    suncore.TimerManager = TimerManager;
    /**
     * 简单任务对象
     */
    var SimpleTask = /** @class */ (function (_super) {
        __extends(SimpleTask, _super);
        function SimpleTask(handler) {
            var _this = _super.call(this) || this;
            _this.$handler = handler;
            return _this;
        }
        /**
         * 执行函数
         */
        SimpleTask.prototype.run = function () {
            // 执行任务
            this.$handler.run();
            return true;
        };
        return SimpleTask;
    }(AbstractTask));
    suncore.SimpleTask = SimpleTask;
    /**
     * 系统时间戳
     *
     * 此类实现了整个客户端的核心机制，包括：
     * 1. 系统时间戳实现
     * 2. 游戏时间轴调度
     * 3. 自定义定时器调度
     * 4. 不同类型游戏消息的派发
     */
    var TimeStamp = /** @class */ (function (_super) {
        __extends(TimeStamp, _super);
        function TimeStamp() {
            var _this = _super.call(this, false) || this;
            /**
             * 定时器管理器
             */
            _this.$timerManager = new TimerManager();
            /**
             * 消息管理器
             */
            _this.$messageManager = new MessageManager();
            return _this;
        }
        /**
         * 帧事件
         */
        TimeStamp.prototype.lapse = function (delta) {
            // 游戏未暂停
            if (this.paused == false) {
                _super.prototype.lapse.call(this, delta);
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
        };
        /**
         * 停止时间轴
         * 1. 时间轴停止时，对应的模块无法被添加任务
         * 2. 时间轴上所有的任务都会在时间轴被停止时清空
         */
        TimeStamp.prototype.stop = function () {
            this.$stopped = true;
            // 清除定时器
            System.timeStamp.timerManager.clearTimer(ModuleEnum.CUSTOM);
            // 清除任务消息
            System.timeStamp.messageManager.clearMessages(ModuleEnum.CUSTOM);
            // 派发时间轴停止通知
            puremvc.Facade.getInstance().sendNotification(NotifyKey.TIMESTAMP_STOPPED);
        };
        Object.defineProperty(TimeStamp.prototype, "timerManager", {
            /**
             * 获取自定义定时器管理器
             */
            get: function () {
                return this.$timerManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeStamp.prototype, "messageManager", {
            /**
             * 获取消息管理器
             */
            get: function () {
                return this.$messageManager;
            },
            enumerable: true,
            configurable: true
        });
        return TimeStamp;
    }(Timeline));
    suncore.TimeStamp = TimeStamp;
})(suncore || (suncore = {}));
