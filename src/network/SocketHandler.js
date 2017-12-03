const dgram = require("dgram");

const UnconnectedPing = require("./raknet/packet/UnconnectedPing");
const UnconnectedPingOpenConnections = require("./raknet/packet/UnconnectedPingOpenConnections");
const OpenConnectionRequest1 = require("./raknet/packet/OpenConnectionRequest1");
const OpenConnectionReply1 = require("./raknet/packet/OpenConnectionReply1");
const OpenConnectionRequest2 = require("./raknet/packet/OpenConnectionRequest2");
const OpenConnectionReply2 = require("./raknet/packet/OpenConnectionReply2");
const UnconnectedPong = require("./raknet/packet/UnconnectedPong");
const AdvertiseSystem = require("./raknet/packet/AdvertiseSystem");

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
			let r, u, res;
			console.log("Server got: " + pk.constructor.name + " from " + rinfo.address + ":" + rinfo.port);
			switch (pk.getId()) {
				case raknet.UNCONNECTED_PING:
					u = new UNCONNECTED_PING(buf);
					u.decode();
					let ad = new UNCONNECTED_PONG(u.pingID);
					ad.encode();
					this.send(ad.bb.buffer, 0, ad.bb.buffer.length, rinfo.port, rinfo.address); //Send waiting data buffer
					break;
				case raknet.OPEN_CONNECTION_REQUEST_1: //ID_OPEN_CONNECTION_REQUEST_1
					r = new OPEN_CONNECTION_REQUEST_1(buf);
					r.decode();
					if (r.protocol !== raknet.STRUCTURE) {
						res = new INCOMPATIBLE_PROTOCOL_VERSION();
						res.encode();
						this.send(res.bb.buffer, 0, res.bb.buffer.length, rinfo.port, rinfo.address);
					}
					else {
						res = new OPEN_CONNECTION_REPLY_1(r.mtusize);
						res.encode();
						this.send(res.bb.buffer, 0, res.bb.buffer.length, rinfo.port, rinfo.address);
					}
					break;
				case raknet.OPEN_CONNECTION_REQUEST_2: //ID_OPEN_CONNECTION_REQUEST_2
					r = new OPEN_CONNECTION_REQUEST_2(buf);
					r.decode();
					res = new OPEN_CONNECTION_REPLY_2(rinfo.port, r.mtusize);
					res.encode();
					let p = new Player(rinfo.address, rinfo.port, r.mtusize);
					if (!this.players.clientExists(p)) {
						this.players.push(p); //Add player to clients
						console.log("Added player.");
						this.send(res.bb.buffer, 0, res.bb.buffer.length, rinfo.port, rinfo.address); //Send waiting data buffer
					}
					else {

					}
					break;
				default:
					console.log("Unknown raknet packet.");
					break;
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