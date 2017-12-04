const ByteBuffer = require('bytebuffer');
ByteBuffer.DEFAULT_NOASSERT = true;

class RakPacket {

	static getId() {
		return -1;
	}

	getId() {
		return this.constructor.getId();
	}

	constructor() {
		this.bb = new ByteBuffer();
		this.bb.buffer[0] = this.getId();
		this.bb.offset = 1;

		this.bb.readByte(1);
	}

	getAddress() {
		let addr, port;
		let version = this.bb.readByte();

		switch(version) {
			default:
			case 4:
				addr = ((~this.bb.readByte()) & 0xff) + "."  + ((~this.bb.readByte()) & 0xff) + "." + ((~this.bb.readByte()) & 0xff) + "." + ((~this.bb.readByte()) & 0xff);
				port = this.bb.readShort();
				break;
		}

		return {
			ip: addr,
			port: port
		};
	}

	putAddress(addr, port, version) {
		version = version || 4;

		this.bb.writeByte(version);

		switch(version) {
			default:
			case 4:
				addr.split(".").forEach(b => {
					this.bb.writeByte((parseInt(b)) & 0xff);
				});
				this.bb.writeShort(port);
				break;
		}
	}

	encode() {
		this.reset();
		this.encodeHeader();
		this.encodePayload();
	}

	encodeHeader() {
		this.bb.writeByte(this.getId());
	}

	encodePayload() {}

	decode() {
		this.bb.offset = 0;
		this.decodeHeader();
		this.decodePayload();
	}

	decodeHeader() {
		this.bb.readByte(); // ID
	}

	decodePayload() {}

	reset() {
		this.bb.reset();
		this.bb.buffer[0] = this.getId();
		this.bb.offset = 1;
	}

}

module.exports = RakPacket;