"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const path = require("path");
const Datastore = require("nedb");
const dbPositions = new Datastore({
    filename: "./db/positions",
    autoload: true
});
const dbPrograms = new Datastore({ filename: "./db/programs", autoload: true });
// require('console-remote-client').connect('console.re', '80', 'raspberry-ns');
//
// ──────────────────────────────────────────── I ──────────
//   :::::: D B : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────
//
// const offset = {
//   name: "offset",
//   position: {
//     x: 0,
//     y: 0,
//     z: 0
//   }
// };
// const current = {
//   name: "current",
//   position: {
//     x: 0,
//     y: 0,
//     z: 0
//   }
// };
// const program1 = {
//   author: "boss",
//   name: "program 1",
//   src: [
//     "x 50 y 50 z 50",
//     "x 100 y 50 z 50",
//     "x 100 y 100 z 50",
//     "x 100 y 100 z 100"
//   ]
// };
// dbPositions.insert(offset, (err, newDoc) => {
//   console.log(newDoc);
// });
// dbPositions.findOne({ name: "offset" }, (err, docs) => {
//   console.log(docs);
// });
// dbPositions.update(
//   { name: "current" },
//   {
//     position: {
//       x: 1,
//       y: 1,
//       z: 1
//     }
//   },
//   {},
//   (err, numReplaced) => {
//     console.log(numReplaced);
//   }
// );
// const program2 = {
//   author: "boss",
//   name: "program 1",
//   src: ["x 50 y 50 z 50", "x 100 y 50 z 50", "x 100 y 100 z 50", "x 0 y 0 z 0"]
// };
// dbPositions.findOne({ name: "offset" }, (err, doc) => {
//   console.log(doc);
// });
// dbPrograms.insert(program1, (err, newDoc) => {
//   console.log(newDoc);
// });
// dbPrograms.update(
//   { name: program2.name },
//   { src: program2.src },
//   {},
//   (err, numReplaced) => {
//     console.log(numReplaced);
//   }
// );
// dbPrograms.findOne({ name: program2.name }, (err, doc) => {
//   console.log(doc);
// });
// const programSrc = `
//   x 50 y 50 z 50;
//   x 100 y 50 z 50;
//   x 100 y 100 z 50;
//   x 100 y 100 z 100;`;
// const arrayParse = arg => {
//   return arg.split(";");
// };
// console.log(arrayParse(programSrc));
// ──────────────────────────────────────────────────────────────
//   :::::: J O H N N Y : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const raspi = require("raspi-io").RaspiIO;
// // const raspi = require("raspi-io");
const five = require("johnny-five");
const board = new five.Board({
    io: new raspi()
});
// const { Board, Stepper } = require("johnny-five");
// const board = new Board({
//   io: new raspi()
// });
// var Stepper = require("wpi-stepper").Stepper;
// import { Stepper } from "wpi-stepper/es6/lib/stepper";
const A4988 = require("A4988");
//
// ──────────────────────────────────────────────────────────────
//   :::::: S E R V E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
//
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
const port = process.env.PORT || 3000;
//
// ────────────────────────────────────────────────────────────
//   :::::: G P I O : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//
board.on("ready", () => {
    // const red = new five.Led("P1-11");
    // const green = new five.Led("P1-13");
    // const yellow = new five.Led("P1-15");
    // const ready = new five.Led("P1-16");
    // // const socketIo = new five.Led("P1-18");
    // // const bluetoothLed = new five.Led("P1-22");
    // const button = new five.Button({
    //   pin: "P1-36",
    //   invert: true,
    //   isPullup: true
    //   // isPulldown: true
    // });
    // let hold = false;
    // const led = arg => {
    //   arg.on();
    //   setTimeout(() => {
    //     arg.off();
    //   }, 100);
    // };
    //
    // ──────────────────────────────────────────────────────────
    //   :::::: R E S T : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────
    //
    app.use("/api/led/http", (req, res) => {
        // red.toggle();
        console.log("red");
        res.json({
            led: "red"
        });
    });
    //
    // ──────────────────────────────────────────────────────────────────────
    //   :::::: H T T P   M O T O R : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────
    //
    app.use("/api/motor", (req, res) => {
        // red.toggle();
        // X +
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "x-up") {
            if (req.body.action === true) {
                // motor1.forward(req.body.speed);
                console.log("start");
            }
            if (req.body.action === false) {
                // motor1.reverse(0);
                console.log("stop");
            }
        }
        // X -
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "x-down") {
            if (req.body.action === true) {
                // motor2.forward(req.body.speed);
                console.log("start");
            }
            if (req.body.action === false) {
                // motor2.reverse(0);
                console.log("stop");
            }
        }
        // Y +
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "y-up") {
            if (req.body.action === true) {
                // motor1.forward(req.body.speed);
                console.log("start");
            }
            if (req.body.action === false) {
                // motor1.reverse(0);
                console.log("stop");
            }
        }
        // Y -
        // ─────────────────────────────────────────────────────────────────
        if (req.body.axis === "y-down") {
            if (req.body.action === true) {
                // motor2.forward(req.body.speed);
                console.log("start");
            }
            if (req.body.action === false) {
                // motor2.reverse(0);
                console.log("stop");
            }
        }
        // setTimeout(() => {
        //   motor1.reverse(0);
        // }, 2000);
        console.log(req.body);
        res.json({
            motor: req.body
        });
    });
    // ────────────────────────────────────────────────────────────────────────────────
    // app.use('/api/led/green', (req, res) => {
    //   green.toggle();
    //   console.log('green');
    //   res.json({
    //     led: 'green'
    //   });
    // });
    // app.use('/api/led/yellow', (req, res) => {
    //   yellow.toggle();
    //   console.log('yellow');
    //   res.json({
    //     led: 'yellow'
    //   });
    // });
    //
    // ──────────────────────────────────────────────────────────────
    //   :::::: B U T T O N : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────
    //
    // button.on("hold", function() {
    //   if (!hold) {
    //     red.on();
    //     hold = true;
    //   }
    //   console.log("Button held");
    // });
    //
    // button.on("down", function() {
    //   led(green);
    //   console.log("Button pressed");
    // });
    //
    // button.on("up", function() {
    //   led(yellow);
    //   hold = false;
    //   red.off();
    //   console.log("Button released");
    // });
    app.use("/api/raspberry", (req, res) => {
        // console.re.log(req.body.text);
        res.json(Object.assign(Object.assign({}, req.body), { pi: "raspberry api" }));
    });
    // ────────────────────────────────────────────────────────────────────────────────
    app.use("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    const server = app.listen(port, () => {
        // ready.on();
        console.log("test 2");
        console.log(`server running on port ${port}`);
    });
    //
    // ────────────────────────────────────────────────────────────
    //   :::::: M O T O R : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────
    //
    //
    // const pinA = new five.Pin("P1-40");
    // // const pinB = new five.Pin('P1-38');
    // // left
    // const motor1 = new five.Motor({
    //   pins: {
    //     pwm: "P1-35",
    //     dir: "P1-37"
    //   },
    //   invertPWM: true
    // });
    // // right
    // const motor2 = new five.Motor({
    //   pins: {
    //     pwm: "P1-37",
    //     dir: "P1-35"
    //   },
    //   invertPWM: true
    // });
    // pinA.high();
    // motor1.on("forward", function() {
    //   console.log("forward 1", Date.now());
    // });
    // motor2.on("forward", function() {
    //   console.log("forward 2", Date.now());
    // });
    // motor1.on("stop", function() {
    //   console.log("automated stop on timer 1", Date.now());
    // });
    // motor2.on("stop", function() {
    //   console.log("automated stop on timer 2", Date.now());
    // });
    // motor1.forward(50);
    // ────────────────────────────────────────────────────────────────────────────────
    // setTimeout(() => {
    //   motor1.forward(100);
    // }, 500);
    // setTimeout(() => {
    //   motor1.forward(150);
    // }, 1000);
    // setTimeout(() => {
    //   motor1.forward(200);
    // }, 1500);
    // setTimeout(() => {
    //   motor1.forward(250);
    // }, 2000);
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // setTimeout(() => {
    //   motor1.reverse(0);
    // }, 2500);
    // setTimeout(() => {
    //   // motor1.reverse(0);
    //   motor2.forward(50);
    // }, 3000);
    //
    // ────────────────────────────────────────────────────────────────────────────────
    // setTimeout(() => {
    //   motor2.forward(100);
    // }, 3500);
    // setTimeout(() => {
    //   motor2.forward(150);
    // }, 4000);
    // setTimeout(() => {
    //   motor2.forward(200);
    // }, 4500);
    // setTimeout(() => {
    //   motor2.forward(250);
    // }, 5000);
    // ────────────────────────────────────────────────────────────────────────────────
    //
    // setTimeout(() => {
    //   motor2.reverse(0);
    // }, 5500);
    //
    //
    // ────────────────────────────────────────────────────────────
    //   :::::: S T E P   M O T O R : :  :   :    :     :        :
    // ────────────────────────────────────────────────────────────
    //
    // motor 1 pins 38, 40
    // motor 2 pins 31, 33
    // motor 3 pind 35, 37
    // const a4988 = new A4988({ step: "P1-38", dir: "P1-40" });
    const a4988 = new A4988({ step: 21, dir: 20 });
    console.log(a4988);
    a4988.turn(5000).then(steps => {
        console.log(`Turned ${steps} steps`);
        a4988.direction = true;
        a4988.turn(5000).then(steps => console.log(`Turned ${steps} steps`));
    });
    console.log("ok");
    // let stepper = new five.Stepper({
    //   type: five.Stepper.TYPE.DRIVER,
    //   stepsPerRev: 200,
    //   pins: {
    //     step: 11,
    //     dir: 12
    //   }
    // });
    // const stepper = new Stepper({
    //   type: Stepper.TYPE.DRIVER,
    //   stepsPerRev: 200,
    //   pins: {
    //     step: "P1-38",
    //     dir: "P1-40"
    //   }
    // });
    // stepsOrOpts
    // {
    //   steps: number of steps to move
    //   direction: 1, 0 (CCW, CW)
    //   rpm: Revolutions per minute. Defaults to 180
    //   accel: Number of steps to accelerate
    //   decel: Number of steps to decelerate
    // }
    //
    //   - 10 full revolutions
    //   - Clockwise
    //   - Accelerate over the first 1600 steps
    //   - Decelerate over the last 1600 steps
    //
    // stepper
    //   .rpm(180)
    //   .ccw()
    //   .step(2000, function() {
    //     console.log("done");
    //   });
    // stepper.step(
    //   { steps: 2000, direction: 1, accel: 1600, decel: 1600 },
    //   function() {
    //     console.log("Done stepping!");
    //   }
    // );
    // stepper.rpm(180).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // // 180 rpm
    // stepper.speed(0.1885).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // stepper.direction(1).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // stepper.direction(0).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // // or
    // stepper.direction(five.Stepper.DIRECTION.CW).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // stepper.direction(five.Stepper.DIRECTION.CCW).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // stepper.accel(1600).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // stepper.decel(1600).step(2000, function() {
    //   console.log("Done stepping!");
    // });
    // stepper.ccw().step(2000);
    //
    // ────────────────────────────────────────────────────────────────────────
    // :::::: S O C K E T   -   I O : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────
    //
    // const io = require('socket.io')(server);
    // io.on('connection', function(socket) {
    //   console.log('Connected');
    //   socketIo.on();
    //   socket.on('test', function(data, cb) {
    //     console.log({ test: `socket ${data.test}` });
    //     socket.emit('test', `socket ${data.test}`);
    //   });
    //   socket.on('disconnect', function() {
    //     console.log('User Disconnected');
    //   });
    // });
    //
    // ────────────────────────────────────────────────────────────────────
    // :::::: B L U E T O O T H : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────
    //
    // const bluetooth = require('node-bluetooth');
    // console.log('bluetooth ready');
    // // create bluetooth device instance
    // const device = new bluetooth.DeviceINQ();
    // //
    // // device.listPairedDevices(console.log);
    // // scaning
    // device
    //   .on('finished', console.log.bind(console, 'finished'))
    //   .on('found', function found(address, name) {
    //     console.log('Found: ' + address + ' with name  ' + name);
    //     device.listPairedDevices(console.log);
    //     device.findSerialPortChannel(address, function(channel) {
    //       console.log(
    //         'Found RFCOMM channel for serial port on %s: ',
    //         name,
    //         channel
    //       );
    // make bluetooth connect to remote device
    // bluetooth.connect(address, channel, function(err, connection) {
    //   // if (err) return console.error(err);
    //   connection.write(new Buffer('Hello!', 'utf-8'), () => {
    //     console.log('wrote');
    //   });
    // });
    // make bluetooth connect to remote device
    // bluetooth.connect(address, channel, function(err, connection) {
    //   if (err) return console.error(err);
    //   connection.on('data', buffer => {
    //     console.log('received message:', buffer.toString());
    //   });
    //   connection.write(new Buffer('Hello!', 'utf-8'), () => {
    //     console.log('wrote');
    //   });
    // });
    //   });
    // })
    // .scan();
});
