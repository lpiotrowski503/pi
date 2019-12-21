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
// ────────────────────────────────────────────────────────────────────────────────
let httpPass = true;
let byPass = () => {
    httpPass = false;
    setTimeout(() => {
        httpPass = true;
    }, 2000);
};
//
// ──────────────────────────────────────────────────────────
//   :::::: A U T O : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//
const stepperAxis = (axis) => {
    if (app.settings[app.moveCounter][axis].direction === null) {
        nextStep();
    }
    else {
        app.setAutoParams({ axis, db, nextStep });
        app.stepper[axis].autoGoToPosition(app.params).then((response) => {
            console.log("then---", response);
            console.log("current", app.current.position);
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
    stepperAxis("x");
    stepperAxis("y");
    stepperAxis("z");
};
const prepareAuto = (id) => __awaiter(void 0, void 0, void 0, function* () {
    app.current = yield db.getCurrent();
    app.stepper = null;
    app.stepper = {
        x: new stepper_1.Stepper(20, 21, app.current.position.x),
        y: new stepper_1.Stepper(6, 13, app.current.position.y),
        z: new stepper_1.Stepper(19, 26, app.current.position.z)
    };
    app.program = new program_1.Program(yield db.getProgram(id));
    app.program.setParams(app.current.position, (_settings) => {
        app.settings = _settings;
        console.log(app.current);
        console.log(app.settings);
    });
});
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
app.board.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    // setTimeout(() => {
    //   // console.log(app.current);
    //   // console.log(app.settings);
    //   // console.log(0, app);
    //   // auto.autoStartProgram({ app, db });
    //   // autoStartProgram();
    // }, 2000);
    //
    // ──────────────────────────────────────────────────────────────────────
    //   :::::: H T T P  : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────
    //
    app.server.use("/api/motor", (req, res) => {
        app.setManualParams({ req, db });
        http.stepperStrategy(req, () => {
            app.stepper[req.body.axis].manualStart(app.params);
        }, () => {
            app.stepper[req.body.axis].manualStop();
        });
        res.json({
            motor: req.body
        });
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
    app.server.get("/api/program/load/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield prepareAuto(req.params.id);
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
            console.log(error);
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
