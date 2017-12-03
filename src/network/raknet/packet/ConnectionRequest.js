const RakPacket = require("./RakPacket");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectionRequest extends RakPacket {

	static getId() {
		return MessageIdentifiers.ID_CONNECTION_REQUEST;
	}

	constructor() {
		super();

		this.clientID = -1;
		this.sendPingTime = 0;
		this.useSecurity = false;
	}

	encodePayload() {
		this.bb.writeLong(this.clientID);
		this.bb.writeLong(this.sendPingTime);
		this.bb.writeByte(this.useSecurity ? 1 : 0);
	}

	decodePayload() {
		this.clientID = this.bb.readLong();
		this.sendPingTime = this.bb.readLong();
		this.useSecurity = this.bb.readByte() !== 0;
	}

}

module.exports = ConnectionRequest;