
module suncore {
    /**
     * 命令枚举
     * export
     */
    export namespace NotifyKey {
        /**
         * export
         */
        export const STARTUP: string = "suncore.NotifyKey.STARTUP";

        /**
         * depends
         */
        export const SHUTDOWN: string = "suncore.NotifyKey.SHUTDOWN";

        /**
         * export
         */
        export const START_TIMELINE: string = "suncore.NotifyKey.START_TIMELINE";

        /**
         * depends
         */
        export const PAUSE_TIMELINE: string = "suncore.NotifyKey.PAUSE_TIMELINE";

        /**
         * export
         */
        export const PHYSICS_FRAME: string = "suncore.NotifyKey.PHYSICS_FRAME";

        /**
         * depends
         */
        export const PHYSICS_PREPARE: string = "suncore.NotifyKey.PHYSICS_PREPARE";

        /**
         * export
         */
        export const ENTER_FRAME: string = "suncore.NotifyKey.ENTER_FRAME";

        /**
         * depends
         */
        export const LATER_FRAME: string = "suncore.NotifyKey.LATER_FRAME";
    }
}