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
		let len = this.bb.readShort();
		this.serverName = this.bb.readString(len);
	}

}

module.exports = AdvertiseSystem;