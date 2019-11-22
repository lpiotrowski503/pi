import { Stepper } from "./stepper/stepper";
import { Program } from "./program/program";
import { Http } from "./http/http";
import { Store } from "./store/store";
import { Db } from "./db/db";
import { Auto } from "./auto/auto";
//
// ──────────────────────────────────────────────────────────────
//   :::::: C O N F I G : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const http = new Http();
const app = new Store();
const db = new Db();
const auto = new Auto();
//
// ──────────────────────────────────────────────────────────
//   :::::: A U T O : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//
const stepperAxis = (axis: string) => {
  if (app.settings[app.moveCounter][axis].direction === null) {
    nextStep();
  } else {
    app.setAutoParams({ axis, db, nextStep });
    app.stepper[axis].autoGoToPosition(app.params).then((response: any) => {
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
    } else {
      console.log("program finish----------------");
      console.log(app.moveCounter);
      console.log(app.settings.length);
      console.log("current", app.current.position);
      console.log("-----------------------------------");
      return;
    }
  } else {
    return;
  }
};

const autoStartProgram = () => {
  stepperAxis("x");
  stepperAxis("y");
  stepperAxis("z");
};

const prepareAuto = async () => {
  app.current = await db.getCurrent();
  app.stepper = {
    x: new Stepper(20, 21, app.current.position.x),
    y: new Stepper(6, 13, app.current.position.y),
    z: new Stepper(19, 26, app.current.position.z)
  };
  app.program = new Program(await db.getProgram("program 1"));
  app.program.setParams(app.current.position, (_settings: any) => {
    app.settings = _settings;
  });
};
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
app.board.on("ready", async () => {
  await prepareAuto();
  setTimeout(() => {
    console.log(app.current);
    console.log(app.settings);
    // console.log(0, app);
    // auto.autoStartProgram({ app, db });
    autoStartProgram();
  }, 2000);
  //
  // ──────────────────────────────────────────────────────────────────────
  //   :::::: H T T P  : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────
  //
  app.server.use("/api/motor", (req, res) => {
    app.setManualParams({ req, db });
    http.stepperStrategy(
      req,
      () => {
        app.stepper[req.body.axis].manualStart(app.params);
      },
      () => {
        app.stepper[req.body.axis].manualStop();
      }
    );
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
