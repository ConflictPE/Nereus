const CommandSender = require("./CommandSender");

class ConsoleCommandSender extends CommandSender {

	constructor() {
		super();
	}

	sendMessage(message) {
		console.log(message);
	}

	getScreenLineHeight() {
		return 120;
	}

}

module.exports = ConsoleCommandSender;