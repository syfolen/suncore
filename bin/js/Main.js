//程序入口
Laya.init(600, 400, Laya.WebGL);
setTimeout(function () {
    puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.STARTUP, test.StartupCommand);
    puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.STARTUP);
    suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_FRAME, a, null);
}, 1000);
var count = 0;
function a() {
    console.log("a");
    count++;
    if (count > 10) {
        suncore.System.removeMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_FRAME, a, null);
    }
}
//# sourceMappingURL=Main.js.map