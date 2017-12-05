const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class UnconnectedPong extends OfflineMessage {

	static getId() {
		return MessageIdentifiers.ID_UNCONNECTED_PONG;
	}

	constructor() {
		super();

		this.pingID = 0;
		this.serverID = 0;
		this.serverName = "";
	}

	encodePayload() {
		this.bb.writeLong(this.pingID)
			.writeLong(this.serverID);

		this.writeMagic();

		this.bb.writeShort(this.serverName.length)
			.writeString(this.serverName)
			.flip()
			.compact();
	}

	decodePayload() {
		this.pingID = this.bb.readLong().low;
		this.serverID = this.bb.readLong().low;

		this.readMagic();

		let len = this.bb.readShort();
		this.serverName = this.bb.readString(len);
	}

}

module.exports = UnconnectedPong;