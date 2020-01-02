"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Server {
    server(app) {
        this.port = process.env.PORT || 3000;
        app.listen(this.port, () => {
            console.log(`server running on port ${this.port}`);
        });
    }
}
exports.default = new Server().server;
