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
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
board.on("ready", () => {
  dbPositions.findOne({ name: "current" }, (err, doc) => {
    current = doc;
    // console.log(current.position);
    //
    // ────────────────────────────────────────────────────────────
    //   :::::: S T E E P   M O T O R : :  :   :    :     :
    // ────────────────────────────────────────────────────────────
    //
    stepper = {
      x: new Stepper(20, 21, current.position.x),
      y: new Stepper(6, 13, current.position.y)
    };
    dbPrograms.findOne({}, (err, prog) => {
      program = new Auto(prog);
      setTimeout(() => {
        program.setParams(0, current.position, (settings: any) => {
          console.log("settings", settings);

          if (settings.direction !== null) {
            stepper["x"]
              .autoGoToPosition(
                settings.destination,
                settings.direction,
                settings.speed,
                limit["x"],
                (response: any) => {
                  console.log("start", current.position.x);
                  console.log("x", response);
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
              .then(result => {
                console.log("then", result);
              })
              .catch(err => {});
          }
        });
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
              // console.log(response);

              current.position[req.body.axis] = response.step;
              console.log(current.position);
              dbPositions.update(
                { name: "current" },
                current,
                {},
                (err, doc) => {
                  // console.log(doc);
                }
              );
              // console.log(current.position);
            }
          )
          .then(result => {
            // console.log(result);
          })
          .catch(err => {});
      },
      () => {
        stepper[req.body.axis]
          .manualStop((response: any) => {
            // console.log(response);

            current.position[req.body.axis] = response.step;
            console.log(current.position);

            dbPositions.update({ name: "current" }, current, {}, (err, doc) => {
              // console.log(current.position);
            });
          })
          .then(result => {
            // console.log(result);
          })
          .catch(err => {});
      }
    );
    // console.log(current.position);
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
