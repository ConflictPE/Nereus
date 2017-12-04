const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectedPing extends OfflineMessage {

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
		this.bb.writeLong(this.pingID);
		this.bb.writeLong(this.serverID);
		this.writeMagic();
		this.bb.writeShort(this.serverName.length);
		this.bb.writeString(this.serverName);
	}

	decodePayload() {
		this.pingID = this.bb.readLong();
		this.serverID = this.bb.readLong();
		this.readMagic();
		this.serverName = this.bb.readString();
	}

}

module.exports = ConnectedPing;