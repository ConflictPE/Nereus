const Nereus = require("./Nereus");
const CommandHandler = require("./command/CommandHandler");
const SocketHandler = require("./network/raknet/SocketHandler");

class Server {

	constructor() {
		this.maxPlayers = 10;
		this.players = [];
		this.motd = "Nereus server";
		console.log("This server is running Nereus v" + Nereus.VERSION + " " + Nereus.CODENAME + " targeting API version " + Nereus.API + "!");
		this.raknet = new SocketHandler(this, "0.0.0.0", 19132);
		this.commandHandler = new CommandHandler(this);
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

}

module.exports = Server;