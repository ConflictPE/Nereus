const RakPacket = require("./RakPacket");
const MessageIdentifiers = require("./MessageIdentifiers");

class AdvertiseSystem extends RakPacket {

	static getId() {
		return MessageIdentifiers.ID_ADVERTISE_SYSTEM;
	}

	constructor() {
		super();

		this.serverName = "";
	}

	encodePayload() {
		this.bb.writeString(this.serverName);
	}

	decodePayload() {
		this.serverName = this.bb.readString();
	}

}

module.exports = AdvertiseSystem;