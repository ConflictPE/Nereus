const RakPacket = require("./RakPacket");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectedPing extends RakPacket {

	static getId() {
		return MessageIdentifiers.ID_CONNECTED_PING;
	}

	constructor() {
		super();

		this.sendPingTime = 0;
	}

	encodePayload() {
		this.bb.writeLong(this.sendPingTime);
	}

	decodePayload() {
		this.sendPingTime = this.bb.readLong().low;
	}

}

module.exports = ConnectedPing;