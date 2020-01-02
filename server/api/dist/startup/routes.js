"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const programs_1 = require("../routes/programs/programs");
const program_1 = require("../routes/programs/program");
class Routes {
    routes(app) {
        app.use("/api/program", program_1.default);
        app.use("/api/programs", programs_1.default);
        app.use("*", (req, res) => {
            res.sendFile(path.join(__dirname, "../../public/index.html"));
        });
    }
}
exports.default = new Routes().routes;
