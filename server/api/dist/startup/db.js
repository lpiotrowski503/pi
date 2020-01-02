"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class Db {
    connect() {
        this.url = "mongodb://pi:serverpi3@ds259348.mlab.com:59348/pi";
        mongoose
            .connect(this.url)
            .then(() => console.log("connected db"))
            .catch(() => console.log("connected error"));
    }
}
exports.default = new Db().connect;
