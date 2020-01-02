"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const async_1 = require("../../middleware/async");
const program_1 = require("../../models/program");
class Programs {
    constructor() {
        this.router = express.Router();
    }
    controller() {
        this.router.get("/", async_1.default((req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield program_1.Program.find({})); }), (error, req, res) => res.status(400).json({ error: error.message })));
        return this.router;
    }
}
exports.default = new Programs().controller();
