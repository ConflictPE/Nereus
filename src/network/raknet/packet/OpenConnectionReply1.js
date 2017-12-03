const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class OpenConnectionReply1 extends OfflineMessage {

	static getId() {
		return MessageIdentifiers.ID_OPEN_CONNECTION_REPLY_1;
	}

	constructor() {
		super();

		this.serverID = -1;
		this.serverSecurity = false;
		this.mtuSize = 0;
	}

	encodePayload() {
		this.writeMagic();
		this.bb.writeLong(this.serverID);
		this.bb.writeByte(this.serverSecurity ? 1 : 0);
		this.bb.writeShort(this.mtuSize);
	}

	decodePayload() {
		this.readMagic();
		this.serverID = this.bb.readLong();
		this.serverSecurity = this.bb.readByte() !== 0;
		this.mtuSize = this.bb.readShort();
	}

}

module.exports = OpenConnectionReply1;