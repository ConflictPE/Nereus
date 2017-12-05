const serverId = Math.floor(Math.random() * 100000);

class RakNet {

	static getProtocol() {
		return 6;
	}

	static getMagic() {
		return "\x00\xff\xff\x00\xfe\xfe\xfe\xfe\xfd\xfd\xfd\xfd\x12\x34\x56\x78";
	}

	static getServerId() {
		return serverId;
	}

	static getSystemAddressCount() {
		return 20;
	}

}

module.exports = RakNet;