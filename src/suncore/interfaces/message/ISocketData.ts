
module suncore {

    /**
     * Socket数据对象接口
     */
    export interface ISocketData {
        /**
         * 协议
         */
        name: string;

        /**
         * 挂载数据
         */
        socData: any;
    }
}