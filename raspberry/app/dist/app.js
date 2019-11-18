"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const Datastore = require("nedb");
const stepper_1 = require("./stepper");
const auto_1 = require("./auto");
const http_1 = require("./http");
// import { Db } from "./db";
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
const http = new http_1.Http();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
//
// ────────────────────────────────────────────────────────────────────────
//   :::::: P O S I T I O N   D B : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────
//
const dbPositions = new Datastore({
    filename: "./db/positions",
    autoload: true
});
let current;
let stepper;
let limitNumber = 100;
let limit = {
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
};
//
// ──────────────────────────────────────────────────────────────────────
//   :::::: P R O G R A M   D B : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────
//
const dbPrograms = new Datastore({ filename: "./db/programs", autoload: true });
let program;
let settings;
let moveCounter = 0;
let complite = 0;
const stepperAxis = (axis) => {
    if (settings[moveCounter][axis].direction === null) {
        nextStep();
    }
    else {
        stepper[axis]
            .autoGoToPosition(settings[moveCounter][axis].destination, settings[moveCounter][axis].direction, settings[moveCounter][axis].speed, limit[axis], (response) => {
            updateCurrentPosition(axis, response);
            if (response.done) {
                nextStep();
            }
        })
            .then((response) => {
            console.log("then---", response);
            console.log("current", current.position);
        })
            .catch((err) => { });
    }
};
const updateCurrentPosition = (axis, response) => {
    current.position[axis] = response.step;
    dbPositions.update({ name: "current" }, current, {}, (err, doc) => { });
};
const nextStep = () => {
    complite++;
    if (complite === 3) {
        moveCounter++;
        complite = 0;
        if (moveCounter < settings.length) {
            setTimeout(() => {
                stepperAxis("x");
                stepperAxis("y");
                stepperAxis("z");
            }, 100);
        }
        else {
            console.log("program finish----------------");
            console.log(moveCounter);
            console.log(settings.length);
            console.log("current", current.position);
            console.log("-----------------------------------");
            return;
        }
    }
    else {
        return;
    }
};
const autoStartProgram = () => {
    program.setParams(current.position, (_settings) => {
        settings = _settings;
        console.log(settings);
        stepperAxis("x");
        stepperAxis("y");
        stepperAxis("z");
    });
};
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
board.on("ready", () => {
    dbPositions.findOne({ name: "current" }, (err, doc) => {
        current = doc;
        //
        // ────────────────────────────────────────────────────────────
        //   :::::: S T E E P   M O T O R : :  :   :    :     :
        // ────────────────────────────────────────────────────────────
        //
        stepper = {
            x: new stepper_1.Stepper(20, 21, current.position.x),
            y: new stepper_1.Stepper(6, 13, current.position.y),
            z: new stepper_1.Stepper(6, 13, current.position.z)
        };
        dbPrograms.findOne({}, (err, prog) => {
            program = new auto_1.Auto(prog);
            setTimeout(() => {
                console.log("current", current.position);
                console.log(prog.src);
                autoStartProgram();
            }, 2000);
        });
    });
    //
    // ──────────────────────────────────────────────────────────────────────
    //   :::::: H T T P  : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────
    //
    app.use("/api/motor", (req, res) => {
        http.stepperStrategy(req, () => {
            stepper[req.body.axis]
                .manualStart(req.body.direction, req.body.speed, limit[req.body.axis], (response) => {
                current.position[req.body.axis] = response.step;
                console.log(current.position);
                dbPositions.update({ name: "current" }, current, {}, (err, doc) => { });
            })
                .then(() => { })
                .catch(() => { });
        }, () => {
            stepper[req.body.axis]
                .manualStop((response) => {
                current.position[req.body.axis] = response.step;
                console.log(current.position);
                dbPositions.update({ name: "current" }, current, {}, (err, doc) => { });
            })
                .then(() => { })
                .catch(() => { });
        });
        res.json({
            motor: req.body
        });
    });
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });
});
// to do
// ────────────────────────────────────────────────────────────────────────────────
// zmienić current nie o jeden tylko o wielkość kroku - D O N E
// zamienić settings na [settings] może pomóc do odpalenia całego programu - D O N E
// delayMicroseconds() - kontrola szybkości skoków
