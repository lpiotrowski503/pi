"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Datastore = require("nedb");
class Db {
    constructor(positions = new Datastore({
        filename: "./db/positions",
        autoload: true
    }), programs = new Datastore({
        filename: "./db/programs",
        autoload: true
    })) {
        this.positions = positions;
        this.programs = programs;
    }
    getCurrent() {
        return new Promise((resolve, reject) => {
            this.positions.findOne({ name: "current" }, (err, current) => {
                resolve(current);
            });
        });
    }
    getProgram(programName) {
        return new Promise((resolve, reject) => {
            this.programs.findOne({ name: programName }, (err, program) => {
                resolve(program);
            });
        });
    }
    getPrograms() {
        return new Promise((resolve, reject) => {
            this.programs.find({}, (err, programs) => {
                resolve(programs);
            });
        });
    }
    createProgram(program) {
        return new Promise((resolve, reject) => {
            this.programs.insert(program, (err, _program) => {
                resolve(_program);
            });
        });
    }
    updateProgram(program) {
        return new Promise((resolve, reject) => {
            this.positions.update({ _id: program.id }, program, {}, (err, _program) => {
                resolve(_program);
            });
        });
    }
    deleteProgram(id) {
        return new Promise((resolve, reject) => {
            this.programs.remove({ _id: id }, (err, _program) => {
                resolve(_program);
            });
        });
    }
    updateCurrent(current) {
        return new Promise((resolve, reject) => {
            this.positions.update({ name: "current" }, current, {}, (err, _current) => {
                resolve(_current);
            });
        });
    }
    resetCurrent() {
        return new Promise((resolve, reject) => {
            this.positions.update({ name: "current" }, { x: 0, y: 0, z: 0 }, {}, (err, _current) => {
                resolve(_current);
            });
        });
    }
}
exports.Db = Db;
