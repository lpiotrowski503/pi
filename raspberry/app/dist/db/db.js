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
const Datastore = require("nedb");
class Db {
    constructor(positions = new Datastore({
        filename: "./db/positions",
        autoload: true,
    }), programs = new Datastore({
        filename: "./db/programs",
        autoload: true,
    })) {
        this.positions = positions;
        this.programs = programs;
    }
    createCurrent() {
        return new Promise((resolve, reject) => {
            this.positions.insert({
                name: "current",
                position: { x: 250, y: 250, z: 0 },
            }, (err, _program) => {
                resolve(_program);
            });
        });
    }
    getCurrent() {
        return new Promise((resolve, reject) => {
            this.positions.findOne({ name: "current" }, (err, current) => {
                resolve(current);
            });
        });
    }
    getCurrentAll() {
        return new Promise((resolve, reject) => {
            this.positions.find({ name: "current" }, (err, current) => {
                resolve(current);
            });
        });
    }
    getProgram(programId) {
        return new Promise((resolve, reject) => {
            this.programs.findOne({ _id: programId }, (err, program) => {
                resolve(program);
            });
        });
    }
    getPrograms() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.programs.find({}, (err, programs) => {
                    resolve(programs);
                });
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
    updateProgram(id, program) {
        return new Promise((resolve, reject) => {
            this.programs.update({ _id: id }, program, {}, (err, _program) => {
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
    resetCurrent(current) {
        return new Promise((resolve, reject) => {
            current.position.x = 250;
            current.position.y = 250;
            current.position.z = 0;
            this.positions.update({ name: "current" }, current, {}, (err, _current) => {
                this.getCurrent().then((res) => resolve(res));
            });
        });
    }
}
exports.Db = Db;
