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
const stepper_1 = require("./stepper/stepper");
const program_1 = require("./program/program");
const http_1 = require("./http/http");
const store_1 = require("./store/store");
const db_1 = require("./db/db");
const auto_1 = require("./auto/auto");
//
// ──────────────────────────────────────────────────────────────
//   :::::: C O N F I G : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const http = new http_1.Http();
const app = new store_1.Store();
const db = new db_1.Db();
const auto = new auto_1.Auto();
let stepsNumber = 0;
let startTime = 0;
// ────────────────────────────────────────────────────────────────────────────────
let httpPass = true;
let byPass = () => {
    httpPass = false;
    setTimeout(() => {
        httpPass = true;
    }, 500);
};
//
// ────────────────────────────────────────────────────────────
//   :::::: U T I L S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
const getNowDate = () => {
    const d = new Date();
    const h = d.getHours() < 10 ? "0" + d.getHours().toString() : d.getHours();
    const m = d.getMinutes() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes();
    const s = d.getSeconds() < 10 ? "0" + d.getSeconds().toString() : d.getSeconds();
    const ms = d.getMilliseconds();
    return `${h}:${m}:${s}::${ms}`;
};
//
// ──────────────────────────────────────────────────────────
//   :::::: A U T O : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//
const stepperAxis = (axis) => {
    if (app.settings[app.moveCounter][axis].direction === null) {
        stepsNumber++;
        nextStep();
    }
    else {
        app.setAutoParams({ axis, db, nextStep });
        app.stepper[axis].autoGoToPosition(app.params).then((response) => {
            console.log("pi-out---auto-move--- " +
                JSON.stringify(Object.assign(Object.assign({}, app.current.position), { time: getNowDate() })));
        });
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
            console.log("pi-out--- " +
                JSON.stringify({
                    action: "finish program",
                    stepsLength: stepsNumber,
                    timeLength: ((Date.now() - startTime) / 1000).toFixed(1) + "s",
                    time: getNowDate(),
                }));
            stepsNumber = 0;
            return;
        }
    }
    else {
        return;
    }
};
const autoStartProgram = () => {
    startTime = Date.now();
    console.log("pi-out--- " +
        JSON.stringify({ action: "start program", time: getNowDate() }));
    stepperAxis("x");
    stepperAxis("y");
    stepperAxis("z");
};
// const prepareAuto = async (id: string) => {
const prepareAuto = (program) => __awaiter(void 0, void 0, void 0, function* () {
    app.program = new program_1.Program(program);
    app.program.setParams(app.current.position, (_settings) => {
        app.settings = _settings;
    });
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    app.current = yield db.getCurrent();
    app.stepper = {
        x: new stepper_1.Stepper(20, 21, app.current.position.x),
        y: new stepper_1.Stepper(6, 13, app.current.position.y),
        z: new stepper_1.Stepper(19, 26, app.current.position.z),
    };
});
init();
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
app.board.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    //
    // ──────────────────────────────────────────────────────────────────────
    //   :::::: H T T P  : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────
    //
    app.server.use("/api/motor", (req, res) => {
        app.setManualParams({ req, db });
        http.stepperStrategy(req, () => {
            app.stepper[req.body.axis].manualStart(app.params);
            // .then(() => console.log("start"))
            // .catch(() => console.log("manual start error"));
        }, () => {
            app.stepper[req.body.axis].manualStop();
            // .then(() => console.log("stop"))
            // .catch(() => console.log("manual stop error"));
        });
        const result = {
            x: app.current.position.x.toFixed(2),
            y: app.current.position.y.toFixed(2),
            z: app.current.position.z.toFixed(2),
        };
        console.log("pi-out--- " +
            JSON.stringify(Object.assign(Object.assign({ action: "manual move" }, result), { time: getNowDate() })));
        res.json(result);
    });
    app.server.get("/api/programs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json(yield db.getPrograms());
    }));
    app.server.post("/api/program", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json(yield db.createProgram(req.body));
    }));
    app.server.patch("/api/program/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json(yield db.updateProgram(req.params.id, req.body));
    }));
    app.server.delete("/api/program/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json(yield db.deleteProgram(req.params.id));
    }));
    app.server.post("/api/program/load/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("pi-out--- " +
            JSON.stringify({
                action: "loaded program",
                name: req.body.name,
                time: getNowDate(),
            }));
        // await prepareAuto(req.params.id, req.body);
        yield prepareAuto(req.body);
        res.status(200).end();
    }));
    app.server.get("/api/program/start", (req, res) => {
        try {
            if (httpPass) {
                app.moveCounter = 0;
                autoStartProgram();
                byPass();
            }
        }
        catch (error) {
            console.log("error");
        }
        res.status(200).end();
    });
    app.server.get("/api/program/stop", (req, res) => {
        res.json({ id: "stop" });
    });
}));
// to do
// ────────────────────────────────────────────────────────────────────────────────
// zmienić current nie o jeden tylko o wielkość kroku - D O N E
// zamienić settings na [settings] może pomóc do odpalenia całego programu - D O N E
// delayMicroseconds() - kontrola szybkości skoków
