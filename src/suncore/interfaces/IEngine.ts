
module suncore {

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
}