const RakPacket = require("./RakPacket");
const MessageIdentifiers = require("./MessageIdentifiers");
const RakNet = require("../RakNet");

class NewIncomingConnection extends RakPacket {

	static getId() {
		return MessageIdentifiers.ID_NEW_INCOMING_CONNECTION;
	}

	constructor() {
		super();

		this.address = "";
		this.port = -1;

		this.systemAddresses = [];

		this.sendPingTime = 0;
		this.sendPongTime = 0;
	}

	encodePayload() {
		// Not needed
	}

	decodePayload() {
		let addrInfo = this.getAddress();
		this.address = addrInfo.ip;
		this.port = addrInfo.port;

		let stopOffset = this.bb.buffer.length - 16; // buffer length - sizeof(sendPingTime) - sizeof(sendPongTime)
		for(let i = 0; i < RakNet.getSystemAddressCount(); i++) {
			if(this.bb.offset >= stopOffset) {
				this.systemAddresses[i] = ["0.0.0.0", 0, 4];
			} else {
				let addrInfo = this.getAddress();
				this.systemAddresses[i] = [addrInfo.ip, addrInfo.port, 4];
			}
		}

		this.sendPingTime = this.bb.readLong().low;
		this.sendPongTime = this.bb.readLong().low;
	}

}

module.exports = NewIncomingConnection;