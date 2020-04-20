"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Http {
    stepperStrategy(req, start, stop) {
        if (req.body.action === true) {
            start();
        }
        if (req.body.action === false) {
            stop();
        }
    }
}
exports.Http = Http;
