
module suncore {

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
}