const OfflineMessage = require("./OfflineMessage");
const MessageIdentifiers = require("./MessageIdentifiers");

class OpenConnectionRequest1 extends OfflineMessage {

	static getId() {
		return MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_1;
	}

	constructor() {
		super();

		this.protocol = 0;
		this.mtuSize = 0;
	}

	encodePayload() {
		this.writeMagic();
		this.bb.writeByte(this.protocol);
		this.bb.write("1".repeat(this.mtuSize - 18));
	}

	decodePayload() {
		this.readMagic();
		this.protocol = this.bb.readByte();
		this. mtuSize = this.bb.remaining().length + 18;
	}

}

module.exports = OpenConnectionRequest1;