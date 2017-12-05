const RakPacket = require("./RakPacket");
const RakNet = require("../RakNet");

class OfflineMessage extends RakPacket {

	constructor() {
		super();

		this.magic = "";
	}

	readMagic() {
		this.magic = this.bb.buffer.slice(0, 16).toString("binary");
		this.bb.offset += 16;
	}

	writeMagic() {
		this.magic = RakNet.getMagic();
		this.bb.append(this.magic, "binary");
	}

	validateMagic() {
		return RakNet.getMagic() === this.magic;
	}

}

module.exports = OfflineMessage;