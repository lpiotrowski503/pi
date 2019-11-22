"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
class Store {
    constructor(limitNumber = 200, board = {}, current = {}, stepper = {}, program = {}, settings = [], params = {}, moveCounter = 0, complite = 0, limit = {
        x: {
            max: limitNumber,
            min: -limitNumber
        },
        y: {
            max: limitNumber,
            min: -limitNumber
        },
        z: {
            max: limitNumber,
            min: -limitNumber
        }
    }, server = express(), raspi = require("raspi-io").RaspiIO, five = require("johnny-five")) {
        this.limitNumber = limitNumber;
        this.board = board;
        this.current = current;
        this.stepper = stepper;
        this.program = program;
        this.settings = settings;
        this.params = params;
        this.moveCounter = moveCounter;
        this.complite = complite;
        this.limit = limit;
        this.server = server;
        this.raspi = raspi;
        this.five = five;
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(express.static(path.join(__dirname, "../public")));
        this.server.listen(3000, () => {
            console.log(`server running on port 3000`);
        });
        this.board = new five.Board({
            io: new raspi()
        });
    }
    setManualParams({ req, db }) {
        this.params = {
            direction: req.body.direction,
            stepSize: req.body.speed,
            limit: this.limit[req.body.axis],
            callback: (response) => {
                this.current.position[req.body.axis] = response.step;
                db.updateCurrent(this.current);
                console.log(this.current.position);
            }
        };
    }
    setAutoParams({ axis, db, nextStep }) {
        this.params = {
            destination: this.settings[this.moveCounter][axis].destination,
            direction: this.settings[this.moveCounter][axis].direction,
            stepSize: this.settings[this.moveCounter][axis].speed,
            limit: this.limit[axis],
            callback: (response) => {
                this.current.position[axis] = response.step;
                db.updateCurrent(this.current);
                if (response.done) {
                    nextStep();
                }
            },
            timeout: 1
        };
    }
}
exports.Store = Store;
