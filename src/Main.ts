
//程序入口
Laya.init(600, 400, Laya.WebGL);

setTimeout(() => {
	puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.STARTUP, test.StartupCommand);
	puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.STARTUP);
}, 1000);