const RakPacket = require("./RakPacket");
const MessageIdentifiers = require("./MessageIdentifiers");
const RakNet = require("../RakNet");

class ConnectionRequestAccepted extends RakPacket {

	static getId() {
		return MessageIdentifiers.ID_CONNECTION_REQUEST_ACCEPTED;
	}

	constructor() {
		super();

		this.address = "";
		this.port = -1;
		this.systemAddresses = [
			["127.0.0.1", 0, 4]
		];

		this.sendPingTime = 0;
		this.sendPongTime = 0;
	}

	encodePayload() {
		this.putAddress(this.address, this.port, 4);
		this.bb.writeShort(0);
		for(let i = 0; i < RakNet.getSystemAddressCount(); i++) {
			let addr = this.systemAddresses[i] || ["0.0.0.0", 0, 4];
			this.putAddress(addr[0], addr[1], addr[2]);
		}

		this.bb.writeLong(this.sendPingTime);
		this.bb.writeLong(this.sendPongTime);
	}

	decodePayload() {
		// Not needed
	}

}

module.exports = ConnectionRequestAccepted;