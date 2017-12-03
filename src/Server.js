const SocketHandler = require("./network/SocketHandler");

// const Info = {
// 	"version": "0.0.1-dev",
// 	"codename": "[DIRT]",
// 	"api": "ALPHA_1"
// };

class Server {

	constructor() {
		this.socketInstance = new SocketHandler("0.0.0.0", 19132);
	}

}

module.exports = Server;