import { Stepper } from "./stepper";
import { Http } from "./http";
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
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
  const x = new Stepper(20, 21);
  const y = new Stepper(6, 13);
  // const z = new Stepper(19, 26);
  x.turn(1000, 1, 1)
    .then((data: any) => console.log("1 x", data))
    .catch(err => console.log("error", err));

  y.turn(1000, 1, 1)
    .then((data: any) => console.log("1 y", data))
    .catch(err => console.log("error", err));
  //
  // ──────────────────────────────────────────────────────────────────────
  //   :::::: H T T P  : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────
  //
  // app.use("/api/motor", new Http().http());
  const http = new Http();
  app.use("/api/motor", (req, res) => {
    // X +
    // ─────────────────────────────────────────────────────────────────
    if (req.body.axis === "x-up") {
      if (req.body.action === true) {
        x.start(1, 1)
          .then((data: any) => console.log("start --- x-up", data))
          .catch(err => console.log("error", err));
      }

      if (req.body.action === false) {
        x.stop();
        console.log("stop --- x-up");
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
          .then((data: any) => console.log("x-down", data))
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
          .then((data: any) => console.log("y-up", data))
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
          .then((data: any) => console.log("y-down", data))
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
