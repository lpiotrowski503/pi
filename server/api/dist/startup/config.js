"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
class Config {
    config(app) {
        app.use(cors());
        app.use(express.json());
        app.use(express.static(path.join(__dirname, '../../public')));
    }
}
exports.default = new Config().config;
