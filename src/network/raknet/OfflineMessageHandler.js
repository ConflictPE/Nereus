const MessageIdentifiers = require("./packet/MessageIdentifiers");

const UnconnectedPong = require("./packet/UnconnectedPong");
const OpenConnectionReply1 = require("./packet/OpenConnectionReply1");
const OpenConnectionReply2 = require("./packet/OpenConnectionReply2");

class OfflineMessageHandler {

	constructor(handler) {
		this.handler = handler;
	}

	getHandler() {
		return this.handler;
	}

	handle(packet, source) {
		let pk;
		switch(packet.getId()) {
			case MessageIdentifiers.ID_UNCONNECTED_PING:
				pk = new UnconnectedPong();
				pk.serverID = this.handler.getId();
				pk.pingID = packet.pingID;
				pk.serverName = "MCPE;Nereus Server;141;1.2;0;10";
				this.handler.sendPacket(pk, source);
				return true;
			case MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_1:
				pk = new OpenConnectionReply1();
				pk.mtuSize = packet.mtuSize;
				pk.serverID = this.getHandler().getId();
				this.handler.sendPacket(pk, source);
				return true;
			case MessageIdentifiers.ID_OPEN_CONNECTION_REQUEST_2:
				if(packet.serverPort !== this.getHandler().source.port) {
					let mtuSize = Math.min(Math.abs(packet.mtuSize), 1464); // Max size, do not allow creating large buffers to fill server memory
					pk = new OpenConnectionReply2();
					pk.mtuSize = mtuSize;
					pk.serverID = this.getHandler().getId();
					pk.clientAddress = source.ip;
					pk.clientPort = source.port;
					this.handler.sendPacket(pk, source);
					this.getHandler().openSession(source, packet.clientID, mtuSize);
				} else {
					console.log("Not opening session for " + source.address + ":" + source.port + " due to mismatched port. Expected " + this.getHandler().source.port + ", got " + packet.serverPort);
				}
				return true;
		}
	}
}

module.exports = OfflineMessageHandler;