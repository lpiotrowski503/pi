"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Http {
    stepperStrategy(req, start, stop) {
        if (req.body.action === true) {
            console.log(1);
            start();
        }
        if (req.body.action === false) {
            console.log(0);
            stop();
        }
    }
}
exports.Http = Http;
