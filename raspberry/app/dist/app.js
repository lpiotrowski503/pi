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
const stepper_1 = require("./stepper");
const auto_1 = require("./auto");
const http_1 = require("./http");
const store_1 = require("./store");
const db_1 = require("./db");
//
// ──────────────────────────────────────────────────────────────
//   :::::: C O N F I G : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const http = new http_1.Http();
const app = new store_1.Store();
const db = new db_1.Db();
//
// ──────────────────────────────────────────────────────────
//   :::::: A U T O : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//
const setArgs = () => { };
const stepperAxis = (axis) => {
    if (app.settings[app.moveCounter][axis].direction === null) {
        nextStep();
    }
    else {
        app.args = {
            destination: app.settings[app.moveCounter][axis].destination,
            direction: app.settings[app.moveCounter][axis].direction,
            stepSize: app.settings[app.moveCounter][axis].speed,
            limit: app.limit[axis],
            callback: (response) => {
                app.current.position[axis] = response.step;
                db.updateCurrent(app.current);
                if (response.done) {
                    nextStep();
                }
            },
            timeout: 1
        };
        app.stepper[axis]
            .autoGoToPosition(app.args)
            .then((response) => {
            console.log("then---", response);
            console.log("current", app.current.position);
        })
            .catch((err) => { });
    }
};
const nextStep = () => {
    app.complite++;
    if (app.complite === 3) {
        app.moveCounter++;
        app.complite = 0;
        if (app.moveCounter < app.settings.length) {
            setTimeout(() => {
                stepperAxis("x");
                stepperAxis("y");
                stepperAxis("z");
            }, 1);
        }
        else {
            console.log("program finish----------------");
            console.log(app.moveCounter);
            console.log(app.settings.length);
            console.log("current", app.current.position);
            console.log("-----------------------------------");
            return;
        }
    }
    else {
        return;
    }
};
const autoStartProgram = () => {
    app.program.setParams(app.current.position, (_settings) => {
        app.settings = _settings;
        stepperAxis("x");
        stepperAxis("y");
        stepperAxis("z");
    });
};
const prepareDb = () => __awaiter(void 0, void 0, void 0, function* () {
    app.current = yield db.getCurrent();
    app.stepper = {
        x: new stepper_1.Stepper(20, 21, app.current.position.x),
        y: new stepper_1.Stepper(6, 13, app.current.position.y),
        z: new stepper_1.Stepper(6, 13, app.current.position.z)
    };
    app.program = new auto_1.Auto(yield db.getProgram("program 1"));
    setTimeout(() => {
        console.log(app.settings);
        console.log(app.current);
        autoStartProgram();
    }, 2000);
});
//
// ──────────────────────────────────────────────────────────────
//   :::::: M A N U A L : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const manual = {
    start: () => { },
    stop: () => { }
};
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
app.board.on("ready", () => {
    prepareDb();
    //
    // ──────────────────────────────────────────────────────────────────────
    //   :::::: H T T P  : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────
    //
    app.server.use("/api/motor", (req, res) => {
        app.args = {
            direction: req.body.direction,
            stepSize: req.body.speed,
            limit: app.limit[req.body.axis],
            callback: (response) => __awaiter(void 0, void 0, void 0, function* () {
                app.current.position[req.body.axis] = response.step;
                db.updateCurrent(app.current);
                console.log(app.current.position);
            })
        };
        http.stepperStrategy(req, () => {
            app.stepper[req.body.axis].manualStart(app.args);
        }, () => {
            app.stepper[req.body.axis].manualStop();
        });
        res.json({
            motor: req.body
        });
    });
});
// to do
// ────────────────────────────────────────────────────────────────────────────────
// zmienić current nie o jeden tylko o wielkość kroku - D O N E
// zamienić settings na [settings] może pomóc do odpalenia całego programu - D O N E
// delayMicroseconds() - kontrola szybkości skoków
