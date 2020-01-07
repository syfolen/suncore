/**
 * PureMVC Standard Framework for TypeScript - Copyright © 2012 Frederic Saunier
 * PureMVC Framework - Copyright © 2006-2012 Futurescale, Inc.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Futurescale, Inc., PureMVC.org, nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
declare module puremvc {

    interface IController {
    }

    interface IFacade {

        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): IObserver;

        removeObserver(name: string, method: Function, caller: Object): void;

        hasObserver(name: string, method: Function, caller: Object): boolean;

        registerCommand(name: string, cls: new () => ICommand): void;

        removeCommand(name: string): void;

        hasCommand(name: string): boolean;

        registerProxy(proxy: IProxy): void;

        removeProxy(name: string): void;

        retrieveProxy(name: string): IProxy;

        hasProxy(name: string): boolean;

        registerMediator(mediator: IMediator): void;

        removeMediator(name: string): void;

        retrieveMediator(name: string): IMediator;

        hasMediator(name: string): boolean;

        sendNotification(name: string, args?: any, cancelable?: boolean): void;

        notifyCancel(): void;
    }

    interface INotifier {
    }

    interface IObserver {
    }

    interface IProxy extends INotifier {

        onRegister(): void;

        onRemove(): void;
    }

    interface IView {
    }

    interface ICommand extends INotifier {

        execute(...args: Array<any>): void;
    }

    interface IMediator extends INotifier {

        listNotificationInterests(): void;

        handleNotification(name: string, method: Function): void;

        onRegister(): void;

        onRemove(): void;
    }

    class Controller implements IController {

        static inst: IController;
    }

    class Facade implements IFacade {

        static inst: IFacade;

        static getInstance(): IFacade;

        protected $initMsgQ(): void;

        protected $initializeModel(): void;

        protected $initializeView(): void;

        protected $initializeController(): void;

        /**
         * 为MMI层模块注册命令前缀
         * 说明：
         * 1. 只有通过此方法注册过的MsgQ模块才允许使用模型或视图接口
         */
        protected $regMMICmd(msgQMod:suncore.MsgQModEnum, prefix:string): void;

        /**
         * 注册MsgQ模块的命令前缀
         */
        protected $regMsgQCmd(msgQMod:suncore.MsgQModEnum, prefix:string): void;

        registerObserver(name:string, method:Function, caller:Object, receiveOnce?:boolean, priority?:number): IObserver;

        removeObserver(name:string, method:Function, caller:Object): void;

        hasObserver(name:string, method:Function, caller:Object): boolean;

        registerCommand(name:string, cls:new () => ICommand): void;

        removeCommand(name:string): void;

        hasCommand(name:string): boolean;

        registerProxy(proxy:IProxy): void;

        removeProxy(name:string): void;

        retrieveProxy(name:string): IProxy;

        hasProxy(name:string): boolean;

        registerMediator(mediator:IMediator): void;

        removeMediator(name:string): void;

        retrieveMediator(name:string): IMediator;

        hasMediator(name:string): boolean;

        sendNotification(name:string, args?:any, cancelable?:boolean): void;

        notifyCancel(): void;
    }

    class Notifier implements INotifier {

        constructor(msgQMod?:suncore.MsgQModEnum);

        protected readonly facade: IFacade;

        protected readonly msgQMod: suncore.MsgQModEnum;
    }

    class Proxy extends Notifier implements IProxy {

        protected data: any;

        constructor(name:string, data?:any);

        onRegister(): void;

        onRemove(): void;
    }

    abstract class SimpleCommand extends Notifier implements ICommand {

        abstract execute(...args:Array<any>): void;
    }

    class View implements IView {

        static inst: IView;
    }

    abstract class MacroCommand extends Notifier implements ICommand {

        abstract initializeMacroCommand(): void;

        addSubCommand(cls:new () => ICommand): void;

        execute(): void;
    }

    class Mediator extends Notifier implements IMediator {

        protected viewComponent: any;

        constructor(name:string, viewComponent?:any);

        listNotificationInterests(): void;

        handleNotification(name:string, method:Function): void;

        onRegister(): void;

        onRemove(): void;
    }
}