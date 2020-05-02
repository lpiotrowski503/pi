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
let isStoped = false;
//
// ────────────────────────────────────────────────────────────
//   :::::: U T I L S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
const getNowDate = () => {
  const d = new Date();
  const h = d.getHours() < 10 ? "0" + d.getHours().toString() : d.getHours();
  const m =
    d.getMinutes() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes();
  const s =
    d.getSeconds() < 10 ? "0" + d.getSeconds().toString() : d.getSeconds();
  const ms = d.getMilliseconds();
  return `${h}:${m}:${s}::${ms}`;
};

const returnToZero = () => {
  app.stepper["x"].autoStop();
  app.stepper["y"].autoStop();
  app.stepper["z"].autoStop();

  setTimeout(() => {
    prepareAuto({
      src: ["g0 z250", "g0 x250 y250"],
    });
    app.moveCounter = 0;
    autoStartProgram();
  }, 1000);
};

//
// ──────────────────────────────────────────────────────────
//   :::::: A U T O : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//
const stepperAxis = (axis: string) => {
  if (app.settings[app.moveCounter][axis].direction === null) {
    stepsNumber++;
    nextStep();
  } else {
    app.setAutoParams({ axis, db, nextStep });
    app.stepper[axis]
      .autoGoToPosition(app.params)
      .then((response: any) => {
        console.log(
          "pi-out---auto-move--- " +
            JSON.stringify({ ...app.current.position, time: getNowDate() })
        );
      })
      .catch((error) => {
        isStoped = true;
      });
  }
};

const nextStep = () => {
  if (isStoped) {
    console.log(
      "pi-out--- " +
        JSON.stringify({
          action: "finish program",
          stepsLength: stepsNumber,
          timeLength: ((Date.now() - startTime) / 1000).toFixed(1) + "s",
          time: getNowDate(),
        })
    );
    stepsNumber = 0;
    isStoped = false;
    return;
  }

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
      console.log(
        "pi-out--- " +
          JSON.stringify({
            action: "finish program",
            stepsLength: stepsNumber,
            timeLength: ((Date.now() - startTime) / 1000).toFixed(1) + "s",
            time: getNowDate(),
          })
      );
      stepsNumber = 0;
      return;
    }
  } else {
    return;
  }
};

const autoStartProgram = () => {
  startTime = Date.now();
  console.log(
    "pi-out--- " +
      JSON.stringify({ action: "start program", time: getNowDate() })
  );
  stepperAxis("x");
  stepperAxis("y");
  stepperAxis("z");
};

// const prepareAuto = async (id: string) => {
const prepareAuto = async (program: any) => {
  app.program = new Program(program);
  app.program.setParams(app.current.position, (_settings: any) => {
    app.settings = _settings;
    // console.log("@@@", app.settings);
  });
};

const init = async () => {
  app.current = await db.getCurrent();
  app.stepper = {
    x: new Stepper(20, 21, app.current.position.x),
    y: new Stepper(6, 13, app.current.position.y),
    z: new Stepper(19, 26, app.current.position.z),
  };
};

init();

// db.createCurrent().then((data) => console.log(data));
db.getCurrentAll().then((data) => {
  setTimeout(() => {
    console.log(data);
  }, 1000);
});

//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
app.board.on("ready", async () => {
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
        // .then(() => console.log("start"))
        // .catch(() => console.log("manual start error"));
      },
      () => {
        app.stepper[req.body.axis].manualStop();
        // .then(() => console.log("stop"))
        // .catch(() => console.log("manual stop error"));
      }
    );
    const result = {
      x: app.current.position.x.toFixed(2),
      y: app.current.position.y.toFixed(2),
      z: app.current.position.z.toFixed(2),
    };
    console.log(
      "pi-out--- " +
        JSON.stringify({
          action: "manual move",
          ...result,
          time: getNowDate(),
        })
    );
    res.json(result);
  });

  app.server.get("/api/programs", async (req, res) => {
    res.status(200).json(await db.getPrograms());
  });

  app.server.post("/api/program", async (req, res) => {
    res.status(200).json(await db.createProgram(req.body));
  });

  app.server.patch("/api/program/:id", async (req, res) => {
    res.status(200).json(await db.updateProgram(req.params.id, req.body));
  });

  app.server.delete("/api/program/:id", async (req, res) => {
    res.status(200).json(await db.deleteProgram(req.params.id));
  });

  app.server.post("/api/program/load/:id", async (req, res) => {
    console.log(
      "pi-out--- " +
        JSON.stringify({
          action: "loaded program",
          name: req.body.name,
          time: getNowDate(),
        })
    );
    // await prepareAuto(req.params.id, req.body);
    await prepareAuto(req.body);
    res.status(200).end();
  });

  app.server.get("/api/program/start", (req, res) => {
    setTimeout(() => {
      try {
        if (httpPass) {
          app.moveCounter = 0;
          autoStartProgram();
          byPass();
        }
      } catch (error) {
        console.log("error");
      }
      res.status(200).end();
    }, 5000);
  });

  app.server.get("/api/program/stop", (req, res) => {
    returnToZero();

    setTimeout(() => {
      const result = {
        x: app.current.position.x.toFixed(2),
        y: app.current.position.y.toFixed(2),
        z: app.current.position.z.toFixed(2),
      };

      res.status(200).json(result);
    }, 1000);
  });

  app.server.put("/api/reset", async (req, res) => {
    app.current = await db.resetCurrent(app.current);
    const result = {
      x: app.current.position.x.toFixed(2),
      y: app.current.position.y.toFixed(2),
      z: app.current.position.z.toFixed(2),
    };
    console.log(app.current);
    init();
    res.status(200).json(result);
  });

  app.server.get("/api/zero", (req, res) => {
    prepareAuto({
      src: ["g1 x250 y250 z300"],
    });
    app.moveCounter = 0;
    autoStartProgram();
    setTimeout(() => {
      res.status(200).json({
        x: 250,
        y: 250,
        z: 500,
      });
    }, 2000);
  });
});
// to do
// ────────────────────────────────────────────────────────────────────────────────
// zmienić current nie o jeden tylko o wielkość kroku - D O N E
// zamienić settings na [settings] może pomóc do odpalenia całego programu - D O N E
// delayMicroseconds() - kontrola szybkości skoków
