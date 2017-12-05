class Session {

	constructor(handler, source, clientId, mtuSize) {
		this.handler = handler;
		this.ip = source.ip;
		this.port = source.port;
		this.clientId = clientId;
		this.mtuSize = mtuSize;
	}

	getHandler() {
		return this.handler;
	}

	getIp() {
		return this.ip;
	}

	getPort() {
		return this.port;
	}

	getClientId() {
		return this.clientId;
	}

	getMtuSize() {
		return this.mtuSize;
	}

}

module.exports = Session;