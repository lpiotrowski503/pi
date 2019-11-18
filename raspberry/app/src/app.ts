import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import * as Datastore from "nedb";

import { Stepper } from "./stepper";
import { Auto } from "./auto";
import { Http } from "./http";
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
const http = new Http();
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
let current: any;
let stepper: any;
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
let program: any;
// ────────────────────────────────────────────────────────────────────────────────
let moveCounter = 0;
let complite = 0;

const stepperAxis = (axis: string, settings: any) => {
  if (settings[moveCounter][axis].direction !== null) {
    stepper[axis]
      .autoGoToPosition(
        settings[moveCounter][axis].destination,
        settings[moveCounter][axis].direction,
        settings[moveCounter][axis].speed,
        limit[axis],
        (response: any) => {
          // console.log(axis, response);
          if (response.done) {
            complite++;
            console.log(
              "if----------------------",
              axis,
              moveCounter,
              complite
            );
            if (complite === 3) {
              moveCounter++;
              console.log(moveCounter);
              complite = 0;
              if (moveCounter < settings.length) {
                console.log("if settings", settings[moveCounter]["x"]);
                console.log("if settings", settings[moveCounter]["y"]);
                console.log("if settings", settings[moveCounter]["z"]);
                setTimeout(() => {
                  stepperAxis("x", settings);
                  stepperAxis("y", settings);
                  stepperAxis("z", settings);
                }, 100);
              } else {
                console.log("if program finish----------------");
                console.log(moveCounter);
                console.log(settings.length);
                console.log("-----------------------------------");
                return;
              }
            } else {
              return;
            }
          }
          // console.log("start", current.position.x);
          // current.position["x"] = response.step;
          // console.log(current.position);
          // dbPositions.update(
          //   { name: "current" },
          //   current,
          //   {},
          //   (err, doc) => {
          //     // console.log(doc);
          //   }
          // );
          // console.log(current.position);
        }
      )
      .then((response: any) => {
        console.log("then----", response);
      })
      .catch(err => {});
  } else {
    complite++;
    console.log("else----------------------", axis, moveCounter, complite);
    if (complite === 3) {
      moveCounter++;
      complite = 0;
      if (moveCounter < settings.length) {
        console.log("else settings", settings[moveCounter]["x"]);
        console.log("else settings", settings[moveCounter]["y"]);
        console.log("else settings", settings[moveCounter]["z"]);
        setTimeout(() => {
          stepperAxis("x", settings);
          stepperAxis("y", settings);
          stepperAxis("z", settings);
        }, 100);
      } else {
        console.log("else program finish----------------");
        console.log(moveCounter);
        console.log(settings.length);
        console.log("-----------------------------------");
        return;
      }
    } else {
      return;
    }
  }
};

const autoStartProgram = () => {
  program.setParams(current.position, (settings: any) => {
    console.log(settings);
    stepperAxis("x", settings);
    stepperAxis("y", settings);
    stepperAxis("z", settings);
    // }
  });
};
// ────────────────────────────────────────────────────────────────────────────────
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
      x: new Stepper(20, 21, current.position.x),
      y: new Stepper(6, 13, current.position.y),
      z: new Stepper(6, 13, current.position.z)
    };
    dbPrograms.findOne({}, (err, prog: any) => {
      program = new Auto(prog);
      setTimeout(() => {
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
    http.stepperStrategy(
      req,
      () => {
        stepper[req.body.axis]
          .manualStart(
            req.body.direction,
            req.body.speed,
            limit[req.body.axis],
            (response: any) => {
              current.position[req.body.axis] = response.step;
              console.log(current.position);
              dbPositions.update(
                { name: "current" },
                current,
                {},
                (err, doc) => {}
              );
            }
          )
          .then(() => {})
          .catch(() => {});
      },
      () => {
        stepper[req.body.axis]
          .manualStop((response: any) => {
            current.position[req.body.axis] = response.step;
            console.log(current.position);
            dbPositions.update(
              { name: "current" },
              current,
              {},
              (err, doc) => {}
            );
          })
          .then(() => {})
          .catch(() => {});
      }
    );
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
