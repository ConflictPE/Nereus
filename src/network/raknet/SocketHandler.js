const dgram = require("dgram");

const OfflineMessage = require("./packet/OfflineMessage");
const UnconnectedPing = require("./packet/UnconnectedPing");
const UnconnectedPingOpenConnections = require("./packet/UnconnectedPingOpenConnections");
const OpenConnectionRequest1 = require("./packet/OpenConnectionRequest1");
const OpenConnectionReply1 = require("./packet/OpenConnectionReply1");
const OpenConnectionRequest2 = require("./packet/OpenConnectionRequest2");
const OpenConnectionReply2 = require("./packet/OpenConnectionReply2");
const UnconnectedPong = require("./packet/UnconnectedPong");
const AdvertiseSystem = require("./packet/AdvertiseSystem");

class SocketHandler {

	constructor(address, port) {
		this.server = dgram.createSocket("udp4");
		this.packetPool = [];
		this.registerPackets();
		this.sessions = [];
		this.server.handler = this;
		this.server.bind(port, address);
		this.server.on("error", this.handleError);
		this.server.on("message", this.handleMessage);

		this.server.on("listening", function() {
			let address = this.address();
			console.log("RakLib server listening on " + address.address + ":" + address.port);
		});
	}

	handleError(err) {
		console.log("RakLib error:\n" + err.stack);
		this.server.close();
	}

	handleMessage(msg, rinfo) {
		let pk = this.handler.getPacketFromPool(msg[0], msg.toString());
		if(pk !== null) {
			console.log("Server got: " + pk.constructor.name + " from " + rinfo.address + ":" + rinfo.port);
			let session = this.handler.getSession(rinfo.address, rinfo.port);
			if(session === null) {
				if (pk instanceof OfflineMessage) {
					pk.decode();
					if(pk.validateMagic()) {

					} else {
						console.log("Received garbage message from " + rinfo.address + ":" + rinfo.port + ": " + pk.constructor.name);
					}
				} else {

				}
			} else {

			}
		} else {
			console.log("Unknown packet: " + msg);
		}
	}

	sendPacket(pk, ip, port) {
		this.server.send(pk.bb.buffer, 0, pk.bb.buffer.length, port, ip);
	}

	getSession(ip, port) {
		let id = ip + ":" + port;

		if(id in this.sessions) {
			return this.sessions[id];
		}

		return null;
	}

	getPacketFromPool(id, buffer) {
		if(id in this.packetPool) {
			let pk = new this.packetPool[id];
			pk.bb.buffer = buffer;

			return pk;
		}

		return null;
	}

	registerPacket(id, pk) {
		this.packetPool[id] = pk;
	}

	registerPackets() {
		this.packetPool = [];

		this.registerPacket(UnconnectedPing.getId(), UnconnectedPing);
		this.registerPacket(UnconnectedPingOpenConnections.getId(), UnconnectedPingOpenConnections);
		this.registerPacket(OpenConnectionRequest1.getId(), OpenConnectionRequest1);
		this.registerPacket(OpenConnectionReply1.getId(), OpenConnectionReply1);
		this.registerPacket(OpenConnectionRequest2.getId(), OpenConnectionRequest2);
		this.registerPacket(OpenConnectionReply2.getId(), OpenConnectionReply2);
		this.registerPacket(UnconnectedPong.getId(), UnconnectedPong);
		this.registerPacket(AdvertiseSystem.getId(), AdvertiseSystem);
	}

}

module.exports = SocketHandler;