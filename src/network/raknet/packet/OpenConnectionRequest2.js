const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class OpenConnectionRequest2 extends OfflineMessage {

	static getId() {
		return MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_2;
	}

	constructor() {
		super();

		this.clientID = 0;
		this.serverAddress = "";
		this.serverPort = 0;
		this.mtuSize = 0;
	}

	encodePayload() {
		this.writeMagic();
		this.putAddress(this.serverAddress, this.serverPort);
		this.bb.writeShort(this.mtuSize);
		this.bb.writeLong(this.clientID);
	}

	decodePayload() {
		this.readMagic();
		let addrInfo = this.getAddress();
		this.serverAddress = addrInfo.ip;
		this.serverPort = addrInfo.port;
		this.mtuSize = this.bb.readShort();
		this.clientID = this.bb.readLong();
	}

}

module.exports = OpenConnectionRequest2;