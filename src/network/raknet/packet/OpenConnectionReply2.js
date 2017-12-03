const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class OpenConnectionReply2 extends OfflineMessage {

	static getId() {
		return MessageIdentifiers.ID_OPEN_CONNECTION_REPLY_2;
	}

	constructor() {
		super();

		this.serverID = -1;
		this.clientAddress = "";
		this.clientPort = -1;
		this.mtuSize = 0;
		this.serverSecurity = false;
	}

	encodePayload() {
		this.writeMagic();
		this.bb.writeLong(this.serverID);
		this.putAddress(this.clientAddress, this.clientPort);
		this.bb.writeShort(this.mtuSize);
		this.bb.writeByte(this.serverSecurity ? 1 : 0);
	}

	decodePayload() {
		this.readMagic();
		this.serverID = this.bb.readLong();
		let addrInfo = this.getAddress();
		this.clientAddress = addrInfo.ip;
		this.clientPort = addrInfo.port;
		this.mtuSize = this.bb.readShort();
		this.serverSecurity = this.bb.readByte() !== 0;
	}

}

module.exports = OpenConnectionReply2;