class Player {

	public constructor(ip, port, mtuSize) {
		this.ip = ip;
		this.port = port;
		this.ACKQueue = [];
		this.NACKQueue = [];
		this.recoveryQueue = {};
		this.packetQueue = new EncapsulatedPacket([]);
		this.mtuSize = mtuSize;
		this.sequencenumber = 0;
		this.lastSequenceNumber = 0;
		this.updateTask = setInterval(
			(function (self) {         //Self-executing func which takes 'this' as self
				return function () {   //Return a function in the context of 'self'
					self.update(self); //Thing you wanted to run as non-window 'this'
				}
			})(this),
			1000 / 2     //normal interval, 'this' scope not impacted here.
		);
	}

	public update() {
		if (this.ACKQueue.length > 0) {

		}
		if (this.NACKQueue.length > 0) {

		}
		if (this.packetQueue.packets.length > 0) {
			this.packetQueue.sequencenumber++;
			this.packetQueue.encode();
			//console.log(player.packetQueue.bb);
			SocketInstance.sendPacket(this.packetQueue, this.ip, this.port);
			this.recoveryQueue[this.packetQueue.sequencenumber] = this.packetQueue.packets;
			this.packetQueue.packets = [];
		}
	}

	public handlePackets(e) {
		let packets = e.packets;
		if (e.sequencenumber - this.lastSequenceNumber == 1) {
			this.lastSequenceNumber = e.sequencenumber;
			console.log("Correct sequence.");
		}
		else {
			for (let i = this.lastSequenceNumber; i < e.sequencenumber; i++) {
				this.NACKQueue.push(i);
			}
		}
		for (let i = 0; i < packets.length; i++) {
			this.handlePacket(packets[i]);
		}
	}

	public handlePacket(pk) {
		let pkid = pk.buffer.readByte();
		switch (pkid) {
			case minecraft.CLIENT_CONNECT:
				let c = new ClientConnectPacket(pk.buffer.copy());
				c.decode();
				let reply = new ServerHandshakePacket(this.port, c.session);
				this.sendPacket(reply);
				break;
			default:
				console.log("Not implemented data packet " + pkid);
				break;
		}
	}

	public close(msg) {
		if (msg !== null) {
			this.sendMessage(msg);
		}
		let d = new Disconnect();
		console.log("Client disconnected.");
	}

	public sendPacket(pk) {
		pk.encode();
		this.packetQueue.packets.push(pk);
	}

}

module.exports = Player;