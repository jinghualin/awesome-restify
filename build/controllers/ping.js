"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PingController {
    initialize(httpServer) {
        httpServer.get("/ping", (req, res) => res.send(200, "hello"));
    }
}
exports.PingController = PingController;
//# sourceMappingURL=ping.js.map