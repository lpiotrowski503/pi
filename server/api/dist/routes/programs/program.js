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
class Program {
    constructor() {
        this.router = express.Router();
    }
    createProgramModel(program) {
        this.program = new program_1.Program(program);
    }
    saveProgram() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.program.save();
        });
    }
    removeProgram(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield program_1.Program.findByIdAndRemove(id);
        });
    }
    editProgram(id, program) {
        return __awaiter(this, void 0, void 0, function* () {
            yield program_1.Program.findByIdAndUpdate(id, {
                name: program.name,
                author: program.author,
                src: program.src
            });
        });
    }
    controller() {
        this.router.post("/", async_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            this.createProgramModel(req.body);
            yield this.saveProgram();
            res.status(200).end();
        }), (error, req, res) => {
            res.status(400).json({ error: error.message });
        }));
        this.router.patch("/:id", async_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.editProgram(req.params.id, req.body);
            res.status(200).end();
        }), (error, req, res) => {
            res.status(400).json({ error: error.message });
        }));
        this.router.delete("/:id", async_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.removeProgram(req.params.id);
            res.status(200).end();
        }), (error, req, res) => {
            res.status(400).json({ error: error.message });
        }));
        return this.router;
    }
}
exports.default = new Program().controller();
