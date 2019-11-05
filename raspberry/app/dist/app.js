"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stepper_1 = require("./stepper");
const http_1 = require("./http");
const express = require("express");
const cors = require("cors");
const path = require("path");
const Gpio = require("pigpio").Gpio;
// ──────────────────────────────────────────────────────────────
//   :::::: J O H N N Y : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const raspi = require("raspi-io").RaspiIO;
const five = require("johnny-five");
const board = new five.Board({
    io: new raspi()
});
//
// ──────────────────────────────────────────────────────────────
//   :::::: S E R V E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
board.on("ready", () => {
    //
    // ────────────────────────────────────────────────────────────
    //   :::::: S T E P   M O T O R : :  :   :    :     :        :
    // ────────────────────────────────────────────────────────────
    //
    const x = new stepper_1.Stepper(20, 21);
    const y = new stepper_1.Stepper(6, 13);
    // const z = new Stepper(19, 26);
    x.turn(1000, 1, 1)
        .then((data) => console.log("1 x", data))
        .catch(err => console.log("error", err));
    y.turn(1000, 1, 1)
        .then((data) => console.log("1 y", data))
        .catch(err => console.log("error", err));
    //
    // ──────────────────────────────────────────────────────────────────────
    //   :::::: H T T P  : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────
    //
    // app.use("/api/motor", new Http().http());
    const http = new http_1.Http();
    app.use("/api/motor", (req, res) => {
        // X +
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "x-up") {
            if (req.body.action === true) {
                console.log("start");
                // x.turn(100, 1, 1)
                //   .then((data: any) => console.log("x-up", data))
                //   .catch(err => console.log("error", err));
                x.start(1, 1)
                    .then((data) => console.log("x-up", data))
                    .catch(err => console.log("error", err));
            }
            if (req.body.action === false) {
                x.stop();
                console.log("stop");
            }
        }
        // X -
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "x-down") {
            if (req.body.action === true) {
                console.log("start");
                // x.turn(100, 0, 1)
                //   .then((data: any) => console.log("x-down", data))
                //   .catch(err => console.log("error", err));
                x.start(0, 1)
                    .then((data) => console.log("x-down", data))
                    .catch(err => console.log("error", err));
            }
            if (req.body.action === false) {
                y.stop();
                console.log("stop");
            }
        }
        // Y +
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "y-up") {
            if (req.body.action === true) {
                console.log("start");
                // y.turn(100, 1, 1)
                //   .then((data: any) => console.log("y-up", data))
                //   .catch(err => console.log("error", err));
                y.start(1, 1)
                    .then((data) => console.log("y-up", data))
                    .catch(err => console.log("error", err));
            }
            if (req.body.action === false) {
                y.stop();
                console.log("stop");
            }
        }
        // Y -
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "y-down") {
            if (req.body.action === true) {
                console.log("start");
                // y.turn(100, 0, 1)
                //   .then((data: any) => console.log("y-down", data))
                //   .catch(err => console.log("error", err));
                y.start(0, 1)
                    .then((data) => console.log("y-down", data))
                    .catch(err => console.log("error", err));
            }
            if (req.body.action === false) {
                console.log("stop");
            }
        }
        console.log(req.body);
        res.json({
            motor: req.body
        });
    });
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });
});
