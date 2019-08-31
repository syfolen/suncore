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

    export interface IController {
        executeCommand(name: string, args: any): void;
        registerCommand(name: string, cls: new () => ICommand): void;
        removeCommand(name: string): void;
        retrieveCommand(name: string): new () => ICommand;
        hasCommand(name: string): boolean;
    }

    export interface IFacade {
        /**
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为1
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): void;
        removeObserver(name: string, method: Function, caller: Object): void;
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
        /**
         * @cancelable: 事件是否允许取消，默认为false
         */
        sendNotification(name: string, args?: any, cancelable?: boolean): void;
        notifyCancel(): void;
    }

    export interface IModel {
        registerProxy(proxy: IProxy): void;
        removeProxy(name: string): void;
        retrieveProxy(name: string): IProxy;
        hasProxy(name: string): boolean;
    }

    export interface INotifier {
        /**
         * @cancelable: 事件是否允许取消，默认为false
         */
        sendNotification(name: string, args?: any): void;
    }


    export interface IObserver {
        name: string;
        caller: Object;
        method: Function;
        priority: number;
        receiveOnce: boolean;
    }

    export interface IView {
        /**
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为1
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): IObserver;
        removeObserver(name: string, method: Function, caller: Object): void;
        notifyCancel(): void;

        /**
         * @cancelable: 事件是否允许取消，默认为false
         */
        notifyObservers(name: string, args?: any, cancelable?: boolean): void;
        registerMediator(mediator: IMediator): void;
        removeMediator(name: string): void;
        retrieveMediator(name: string): IMediator;
        hasMediator(name: string): boolean;
    }

    export interface ICommand extends INotifier {
        execute(...args: Array<any>): void;
    }

    export interface IMediator extends INotifier {
        getMediatorName(): string;
        getViewComponent(): any;
        listNotificationInterests(): void;
        removeNotificationInterests(): void;
        handleNotification(name: string, method: Function): void;
        onRegister(): void;
        onRemove(): void;
    }

    export interface IProxy extends INotifier {
        getProxyName(): string;
        onRegister(): void;
        onRemove(): void;
        setData(data: any): void;
        getData(): any;
    }

    export class Controller implements IController {
        static readonly SINGLETON_MSG: string;
        static readonly inst: IController;

        private $commands: { [name: string]: new () => ICommand };

        constructor();

        executeCommand(name: string, args: any): void;

        registerCommand(name: string, cls: new () => ICommand): void;

        removeCommand(name: string): void;

        retrieveCommand(name: string): new () => ICommand;

        hasCommand(name: string): boolean;
    }

    export class Facade implements IFacade {
        static readonly SINGLETON_MSG: string;
        static inst: IFacade;

        static getInstance(): IFacade;

        private $view: IView;
        private $model: IModel;
        private $controller: IController;

        constructor();

        private $initializeFacade(): void;

        protected $initializeModel(): void;

        protected $initializeView(): void;

        protected $initializeController(): void;

        /**
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为1
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): void;

        removeObserver(name: string, method: Function, caller: Object): void;

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

        /**
         * @cancelable: 事件是否允许取消，默认为false
         */
        sendNotification(name: string, args?: any, cancelable?: boolean): void;

        notifyCancel(): void;
    }

    export class Model implements IModel {
        static readonly SINGLETON_MSG: string;
        static inst: IModel;

        private $proxies: { [name: string]: IProxy };

        constructor();

        registerProxy(proxy: IProxy): void;

        removeProxy(name: string): void;

        retrieveProxy(name: string): IProxy;

        hasProxy(name: string): boolean;
    }



    export class Notifier {
        protected facade: IFacade;

        constructor();

        /**
         * @cancelable: 事件是否允许取消，默认为false
         */
        sendNotification(name: string, args?: any): void;
    }

    export class Observer implements IObserver {
        name: string;
        caller: Object;
        method: Function;
        priority: number;
        receiveOnce: boolean;
    }

    export class View implements IView {
        static readonly SINGLETON_MSG: string;
        static inst: IView;

        private $mediators: { [name: string]: IMediator };
        private $observers: { [name: string]: Array<boolean | IObserver> };

        private $isCanceled: boolean;
        private $onceObservers: Array<IObserver>;

        constructor();

        /**
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 优先级，优先响应级别高的消息，值越大，级别越高，默认为1
         */
        registerObserver(name: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): IObserver;

        removeObserver(name: string, method: Function, caller: Object): void;

        notifyCancel(): void;

        /**
         * @cancelable: 事件是否允许取消，默认为false
         */
        notifyObservers(name: string, args?: any, cancelable?: boolean): void;

        registerMediator(mediator: IMediator): void;

        removeMediator(name: string): void;

        retrieveMediator(name: string): IMediator;

        hasMediator(name: string): boolean;
    }


    export abstract class MacroCommand extends Notifier implements ICommand {
        private $commands: Array<new () => ICommand>;

        constructor();

        abstract initializeMacroCommand(): void;

        addSubCommand(cls: new () => ICommand): void;

        execute(): void;
    }

    export class Mediator extends Notifier implements IMediator {
        private $mediatorName: string;
        private $notificationInterests: Array<IObserver>;

        protected viewComponent: any;

        constructor(name: string, viewComponent?: any);

        getMediatorName(): string;

        getViewComponent(): any;

        listNotificationInterests(): void;

        removeNotificationInterests(): void;

        handleNotification(name: string, method: Function): void;

        onRegister(): void;

        onRemove(): void;
    }

    export class Proxy extends Notifier implements IProxy {
        private $proxyName: string;

        protected data: any;

        constructor(name: string, data?: any);

        getProxyName(): string;

        onRegister(): void;

        onRemove(): void;

        setData(data: any): void;

        getData(): any;
    }

    export abstract class SimpleCommand extends Notifier implements ICommand {

        abstract execute(...args: Array<any>): void;
    }

}