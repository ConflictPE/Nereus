const Command = require("../Command");

class HelpCommand extends Command {

	constructor(handler) {
		super(handler, "help", "Help command.",["?"], "/help");
	}

	run(sender, args) {
		let command, pageNumber;

		if(args.length === 0) {
			command = "";
			pageNumber = 1;
		} else if(!isNaN(args[args.length - 1])) {
			pageNumber = parseInt(args.pop());
			if(pageNumber <= 0) {
				pageNumber = 1;
			}

			command = args.join(" ");
		} else {
			command = args.join(" ");
			pageNumber = 1;
		}

		if(command === "") {
			let commands = [];
			let commandKeys = [];
			this.getHandler().getCommands().forEach((cmd) => {
				if(commandKeys.indexOf(cmd.getName()) === -1) {
					commands.push(cmd);
					commandKeys.push(cmd.getName());
				}
			});

			let pageCount = Math.ceil(commands.length / sender.getScreenLineHeight());
			pageNumber = Math.min(pageNumber, pageCount);

			let page = [];
			let startNum = sender.getScreenLineHeight() * (pageNumber - 1);
			let endNum = startNum + sender.getScreenLineHeight();
			for(let i = startNum; i < endNum; i++) {
				if(commands[i]) {
					page[i] = commands[i];
				} else {
					break;
				}
			}

			commandKeys = commandKeys.sort();

			sender.sendMessage("--- Showing help page " + pageNumber + " of " + pageCount + " (/help <page>) ---");
			page.forEach((cmd) => {
				sender.sendMessage("/" + cmd.getName() + ": " + cmd.getDescription());
			});
		} else {
			let cmd = this.getHandler().getCommand(command);
			if(cmd instanceof Command) {
				let message = "--------- Help: /" + cmd.getName() + " ---------\n";
				message += "Description: " + cmd.getDescription() + "\n";
				message += "Usage: " + cmd.getUsage();
				sender.sendMessage(message);
				return true;
			}

			sender.sendMessage("No help for '" + command.toString().toLowerCase() + "'");
		}
	}

}

module.exports = HelpCommand;