
module suncore {
    /**
     * Socket数据对象
     */
    export class SocketData implements ISocketData {
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