const UnconnectedPing = require("./UnconnectedPing");
const MessageIdentifiers = require("./MessageIdentifiers");

class ConnectedPing extends UnconnectedPing {

	static getId() {
		return MessageIdentifiers.ID_UNCONNECTED_PING_OPEN_CONNECTIONS;
	}

}

module.exports = ConnectedPing;