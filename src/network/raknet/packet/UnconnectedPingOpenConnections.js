const UnconnectedPing = require("./UnconnectedPing");
const MessageIdentifiers = require("./MessageIdentifiers");

class UnconnectedPingOpenConnections extends UnconnectedPing {

	static getId() {
		return MessageIdentifiers.ID_UNCONNECTED_PING_OPEN_CONNECTIONS;
	}

}

module.exports = UnconnectedPingOpenConnections;