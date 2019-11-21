
module suncore {

    /**
     * 命令枚举
     * export
     */
    export abstract class NotifyKey {
        /**
         * export
         */
        static readonly STARTUP: string = "suncore.NotifyKey.STARTUP";
        /**
         * export
         */
        static readonly SHUTDOWN: string = "suncore.NotifyKey.SHUTDOWN";

        /**
         * export
         */
        static readonly PHYSICS_FRAME: string = "suncore.NotifyKey.PHYSICS_FRAME";
        /**
         * export
         */
        static readonly PHYSICS_PREPARE: string = "suncore.NotifyKey.PHYSICS_PREPARE";

        /**
         * export
         */
        static readonly ENTER_FRAME: string = "suncore.NotifyKey.ENTER_FRAME";
        /**
         * export
         */
        static readonly LATER_FRAME: string = "suncore.NotifyKey.LATER_FRAME";

        /**
         * export
         */
        static readonly CREATE_TIMELINE: string = "suncore.NotifyKey.CREATE_TIMELINE";
        /**
         * export
         */
        static readonly REMOVE_TIMELINE: string = "suncore.NotifyKey.REMOVE_TIMELINE";
        /**
         * export
         */
        static readonly TIMELINE_STOPPED: string = "suncore.NotifyKey.TIMELINE_STOPPED";
        /**
         * export
         */
        static readonly TIMESTAMP_STOPPED: string = "suncore.NotifyKey.TIMESTAMP_STOPPED";
    }
}