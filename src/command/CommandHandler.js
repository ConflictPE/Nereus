const readline = require("readline");

const ConsoleCommandSender = require("./ConsoleCommandSender");
const Command = require("./Command");

const HelpCommand = require("./commands/HelpCommand");

class CommandHandler {

	constructor(server) {
		this.readline = {};

		this.server = server;
		this.started = false;
		this.consoleCommandSender = new ConsoleCommandSender();
		this.commands = new Map();

		this.registerDefaults();
		this.start();
	}

	getServer() {
		return this.server;
	}

	getCommands() {
		return this.commands;
	}

	getCommand(label) {
		return this.commands.get(label);
	}

	registerDefaults() {
		this.registerCommand("ne", new HelpCommand(this));
	}

	commandExists(name) {
		return this.commands.has(name.toString().toLowerCase());
	}

	registerCommand(fallbackPrefix, command, label) {
		if(!label) {
			label = command.getName();
		}

		label = label.toString().trim().toLowerCase();
		fallbackPrefix = fallbackPrefix.toString().trim().toLowerCase();

		let registered = this.registerAlias(command, false, fallbackPrefix, label);

		let aliases = command.getAliases();
		aliases.forEach((alias, index) => {
			if(!this.registerAlias(command.clone(), true, fallbackPrefix, alias)) {
				aliases.splice(index, 1);
			}
		});

		command.setAliases(aliases);

		if(!registered) {
			command.setLabel(fallbackPrefix + ":" + label);
		}

		return registered;
	}

	registerAlias(command, isAlias, fallbackPrefix, label) {
		if(isAlias) {
			command.setLabel(label);
		}

		this.commands.set(fallbackPrefix + ":" + label, command);
		this.commands.set(label, command);

		return true;
	}

	unregisterCommand(command) {
		this.commands.forEach((cmd, name) => {
			if(cmd === command) {
				this.commands.delete(name);
			}
		});

		return true;
	}

	start() {
		if(this.started) {
			return false;
		}

		this.readline = readline.createInterface({
			input: process.stdin
		});

		this.readline.on("line", (input) => {
			this.dispatchCommand(this.consoleCommandSender, input);
		});

		this.started = true;
	}

	dispatchCommand(sender, commandLine) {
		if(commandLine === "") {
			return false;
		}

		let args = commandLine.split(" ");
		let cmd = args.shift();

		if(this.commandExists(cmd)) {
			let command = this.commands.get(cmd);
			command.run(sender, args);
		} else {
			sender.sendMessage("Command not found!");
		}
	}

}

module.exports = CommandHandler;
