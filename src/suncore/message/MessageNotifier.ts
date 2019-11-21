
module suncore {

    /**
     * 网络消息派发器
     * export
     */
    export abstract class MessageNotifier {

        private static readonly inst: suncom.IEventSystem = new suncom.EventSystem();

        /**
         * 通知网络消息
         * export
         */
        static notify(name: string, data: any): void {
            MessageNotifier.inst.dispatchEvent(name, data);
        }

        /**
         * 注册网络消息监听
         * export
         */
        static register(name: string, method: Function, caller: Object): void {
            MessageNotifier.inst.addEventListener(name, method, caller);
        }

        /**
         * 移除网络消息监听
         * export
         */
        static unregister(name: string, method: Function, caller: Object): void {
            MessageNotifier.inst.removeEventListener(name, method, caller);
        }
    }
}