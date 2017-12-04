const MessageIdentifiers = require("./packet/MessageIdentifiers");

const UnconnectedPong = require("./packet/UnconnectedPong");
class OfflineMessageHandler {

	constructor(handler) {
		this.handler = handler;
	}

	getHandler() {
		return this.handler;
	}

	handle(packet, source) {
		switch(packet.getId()) {
			case MessageIdentifiers.ID_UNCONNECTED_PING:
				let pk = new UnconnectedPong();
				pk.serverID = this.handler.getId();
				pk.pingID = packet.pingID;
				pk.serverName = "MCPE;Nereus;141;1.2;0;10";
				this.handler.sendPacket(pk, source);
				return true;
		}
	}
}

module.exports = OfflineMessageHandler;