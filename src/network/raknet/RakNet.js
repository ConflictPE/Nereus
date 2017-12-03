const serverId = Math.floor(Math.random() * 100000);

class RakNet {

	static getProtocol() {
		return 6;
	}

	static getMagic() {
		return "00ffff00fefefefefdfdfdfd12345678";
	}

	static getServerId() {
		return serverId;
	}

	static getSystemAddressCount() {
		return 20;
	}

}

module.exports = RakNet;