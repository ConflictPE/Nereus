const CommandHandler = require("./command/CommandHandler");
const SocketHandler = require("./network/raknet/SocketHandler");

const Info = {
	"version": "0.0.1-dev",
	"codename": "[DIRT]",
	"api": "ALPHA_1"
};

class Server {

	constructor() {
		console.log("This server is running Nereus v" + this.info.version + " " + this.info.codename + " targeting API version " + this.info.api + "!");
		this.socketInstance = new SocketHandler("0.0.0.0", 19132);
		this.commandHandler = new CommandHandler(this);
	}

	get info() {
		return Info;
	}

}

module.exports = Server;