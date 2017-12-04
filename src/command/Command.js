class Command {

	constructor(handler, name, description, aliases, usage) {
		this.handler = handler;
		this.label = name;
		this.name = name;
		this.description = description;
		this.aliases = aliases || [];
		this.usage = usage || "";
	}

	clone() {
		return Object.assign(Object.create(this), this);
	}

	getHandler() {
		return this.handler;
	}

	getLabel() {
		return this.label;
	}

	getName() {
		return this.name;
	}

	getDescription() {
		return this.description;
	}

	getAliases() {
		return this.aliases;
	}

	getUsage() {
		return this.usage;
	}

	setLabel(label) {
		this.label = label;
	}

	setName(name) {
		this.name = name;
	}

	setAliases(aliases) {
		this.aliases = aliases;
	}

	setUsage(usage) {
		this.usage = usage;
	}

	run(sender, args) {}

}

module.exports = Command;