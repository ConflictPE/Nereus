const RakPacket = require("./RakPacket");
const MessageIdentifiers = require("./MessageIdentifiers");

class DisconnectionNotification extends RakPacket {

	static getId() {
		return MessageIdentifiers.ID_DISCONNECTION_NOTIFICATION;
	}

}

module.exports = DisconnectionNotification;