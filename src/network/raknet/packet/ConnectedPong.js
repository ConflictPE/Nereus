const RakPacket = require("./RakPacket");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectedPong extends RakPacket {

	static getId() {
		return MessageIdentifiers.ID_CONNECTED_PONG;
	}

	constructor() {
		super();

		this.sendPingTime = 0;
		this.sendPongTime = 0;
	}

	encodePayload() {
		this.bb.writeLong(this.sendPingTime);
		this.bb.writeLong(this.sendPongTime);
	}

	decodePayload() {
		this.sendPingTime = this.bb.readLong();
		this.sendPongTime = this.bb.readLong();
	}

}

module.exports = ConnectedPong;