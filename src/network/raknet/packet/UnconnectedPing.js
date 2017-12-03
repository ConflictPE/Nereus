const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectedPing extends OfflineMessage {

	static getId() {
		return MessageIdentifiers.ID_UNCONNECTED_PING;
	}

	constructor() {
		super();

		this.pingID = 0;
	}

	encodePayload() {
		this.bb.writeLong(this.pingID);
		this.writeMagic();
	}

	decodePayload() {
		this.pingID = this.bb.readLong();
		this.readMagic();
	}

}

module.exports = ConnectedPing;