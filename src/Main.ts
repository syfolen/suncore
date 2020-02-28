
//程序入口
Laya.init(600, 400, Laya.WebGL);

class Facade extends puremvc.Facade {

	static getInstance(): puremvc.IFacade {
		return puremvc.Facade.inst || new Facade();
	}

	protected $initMsgQ(): void {
		this.$regMMICmd(suncore.MsgQModEnum.CUI, "CUI");
		this.$regMMICmd(suncore.MsgQModEnum.GUI, "GUI");
		this.$regMsgQCmd(suncore.MsgQModEnum.L4C, "MSG");
		this.$regMsgQCmd(suncore.MsgQModEnum.NSL, "NET");
	}
}

setTimeout(() => {
	Facade.getInstance().registerCommand(suncore.NotifyKey.STARTUP, test.StartupCommand);
	Facade.getInstance().sendNotification(suncore.NotifyKey.STARTUP);
}, 1000);