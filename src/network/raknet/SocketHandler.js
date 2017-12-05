const dgram = require("dgram");

const OfflineMessageHandler = require("./OfflineMessageHandler");
const BedrockProtocol = require("../minecraft/BedrockProtocol");
const Nereus = require("../../Nereus");

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

	constructor(server, address, port) {
		this.server = server;

		this.id = Math.floor(Math.random() * 999999);

		this.source = {
			ip: address,
			port: port
		};
		this.name = "";

		this.socket = dgram.createSocket("udp4");

		this.packetPool = [];
		this.registerPackets();

		this.offlineMessageHandler = new OfflineMessageHandler(this);
		this.sessions = new Map();

		this.socket.on("error", (err) => {
			console.log("RakLib error:\n" + err.stack);
			this.server.close();
		});

		this.socket.on("message", (msg, rinfo) => {
			this.handleMessage(msg, rinfo);
		});

		this.socket.on("listening", () => {
			console.log("RakLib server listening on " + address + ":" + port);
		});

		this.refreshName();
		this.nameUpdateTask = setInterval(() => {
			this.refreshName();
		}, 10000); // update the motd every 10 seconds

		this.socket.bind(port, address);
	}

	getId() {
		return this.id;
	}

	getName() {
		return this.name;
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
			pk.bb.append(buffer, "hex");

			return pk;
		}

		return null;
	}

	setName(name) {
		this.name = name;
	}

	handleMessage(msg, rinfo) {
		let pk = this.getPacketFromPool(msg[0], msg);
		if(pk !== null) {
			console.log("Server got: " + pk.constructor.name + " from " + rinfo.address + ":" + rinfo.port);
			let session = this.getSession(rinfo.address, rinfo.port);
			if(session === null) {
				if (pk instanceof OfflineMessage) {
					pk.decode();
					// if(pk.validateMagic()) {
						this.offlineMessageHandler.handle(pk, {
							ip: rinfo.address,
							port: rinfo.port
						});
					// } else {
					// 	console.log("Received garbage message from " + rinfo.address + ":" + rinfo.port + ": " + pk.constructor.name);
					// }
				} else {

				}
			} else {

			}
		} else {
			console.log("Unknown packet " + msg[0] + ": " + msg);
		}
	}

	sendPacket(pk, source) {
		pk.encode();
		this.socket.send(pk.bb.buffer, 0, pk.bb.buffer.length, source.port, source.ip);
		console.log("sending " + pk.constructor.name + " to " + source.ip + ":" + source.port);
	}

	openSession(source, clientId, mtuSize) {
		this.sessions.set(source.ip + ":" + source.port, {});
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

	refreshName() {
		this.name = [
			"MCPE",
			this.server.getMotd(),
			BedrockProtocol.CURRENT_PROTOCOL,
			BedrockProtocol.VERSION_NETWORK,
			this.server.getOnlinePlayers().length,
			this.server.getMaxPlayers(),
			this.id,
			Nereus.NAME,
			"SMP"
		].join(";") + ";";
	}

}

module.exports = SocketHandler;