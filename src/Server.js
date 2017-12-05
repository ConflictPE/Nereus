const CommandHandler = require("./command/CommandHandler");
const SocketHandler = require("./network/raknet/SocketHandler");

const Info = {
	version: "0.0.1-dev",
	codename: "[DIRT]",
	api: "ALPHA_1"
};

class Server {

	constructor() {
		this.maxPlayers = 10;
		this.players = [];
		this.motd = "Nereus server";
		console.log("This server is running Nereus v" + this.info().version + " " + this.info().codename + " targeting API version " + this.info().api + "!");
		this.socketInstance = new SocketHandler("0.0.0.0", 19132);
		this.refreshSocketName();
		this.commandHandler = new CommandHandler(this);
	}

	info() {
		return Info;
	}

	getMaxPlayers() {
		return this.maxPlayers;
	}

	getOnlinePlayers() {
		return this.players;
	}

	getMotd() {
		return this.motd;
	}

	refreshSocketName() {
		this.socketInstance.setName("MCPE;" + this.motd + ";141;1.2;" + this.players.length + ";" + this.maxPlayers + ";" + this.socketInstance.getId() + ";");
	}

}

module.exports = Server;