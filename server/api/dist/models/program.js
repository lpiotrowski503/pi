"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class ProgramModel {
    constructor() {
        this.programSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            },
            src: {
                type: Array,
                required: true
            }
        });
        this.program = mongoose.model("Program", this.programSchema);
    }
}
exports.Program = new ProgramModel().program;
