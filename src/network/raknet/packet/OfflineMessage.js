const RakPacket = require("./RakPacket");
const RakNet = require("../RakNet");

class OfflineMessage extends RakPacket {

	constructor() {
		super();

		this.magic = "";
	}

	readMagic() {
		this.magic = this.bb.buffer.slice(0, 16);
	}

	writeMagic() {
		this.bb.append(RakNet.getMagic());
	}

	validateMagic() {
		return this.magic === RakNet.getMagic();
	}

}

module.exports = OfflineMessage;