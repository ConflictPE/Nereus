const RakPacket = require("./RakPacket");
const RakNet = require("../RakNet");

class OfflineMessage extends RakPacket {

	constructor() {
		super();

		this.magic = "";
	}

	readMagic() {
		this.magic = this.bb.buffer.slice(0, 16).toString("binary");
	}

	writeMagic() {
		this.bb.append(RakNet.getMagic(), "hex");
	}

	validateMagic() {
		return this.magic === RakNet.getMagic();
	}

}

module.exports = OfflineMessage;