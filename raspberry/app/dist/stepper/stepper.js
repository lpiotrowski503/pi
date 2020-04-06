"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gpio = require("pigpio").Gpio;
// import { Gpio } from "pigpio";
class Stepper {
    constructor(step, dir, steps, ms1 = new Gpio(17, { mode: Gpio.OUTPUT }), ms2 = new Gpio(27, { mode: Gpio.OUTPUT }), ms3 = new Gpio(22, { mode: Gpio.OUTPUT }), running = false, finish = false, stepSize = 1) {
        this.ms1 = ms1;
        this.ms2 = ms2;
        this.ms3 = ms3;
        this.running = running;
        this.finish = finish;
        this.stepSize = stepSize;
        this.step = new Gpio(step, { mode: Gpio.OUTPUT });
        this.dir = new Gpio(dir, { mode: Gpio.OUTPUT });
        this.steps = steps;
    }
    //
    // ──────────────────────────────────────────────────────────────────
    //   :::::: S E T T I N G S : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────
    //
    step_1() {
        this.ms1.digitalWrite(false);
        this.ms2.digitalWrite(false);
        this.ms3.digitalWrite(false);
        this.stepSize = 1;
    }
    step_2() {
        this.ms1.digitalWrite(true);
        this.ms2.digitalWrite(false);
        this.ms3.digitalWrite(false);
        this.stepSize = 2;
    }
    step_4() {
        this.ms1.digitalWrite(false);
        this.ms2.digitalWrite(true);
        this.ms3.digitalWrite(false);
        this.stepSize = 4;
    }
    step_8() {
        this.ms1.digitalWrite(true);
        this.ms2.digitalWrite(true);
        this.ms3.digitalWrite(false);
        this.stepSize = 8;
    }
    step_16() {
        this.ms1.digitalWrite(true);
        this.ms2.digitalWrite(true);
        this.ms3.digitalWrite(true);
        this.stepSize = 16;
    }
    onStepSize(stepSize = this.args.stepSize) {
        this[`step_${stepSize}`]();
    }
    onDirection() {
        if (this.args.direction === 1) {
            this.dir.digitalWrite(true);
        }
        if (this.args.direction === -1) {
            this.dir.digitalWrite(false);
        }
    }
    onRunning() {
        if (!this.running) {
            this.finish = false;
            this.running = true;
            return true;
        }
        return false;
    }
    //
    // ──────────────────────────────────────────────────────────────
    //   :::::: M A N U A L : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────
    //
    manualStep() {
        this.steps = this.steps + this.args.direction * (1 / this.args.stepSize);
        this.step.digitalWrite(true);
        this.step.digitalWrite(false);
    }
    manualLimit() {
        if (this.steps + 1 > this.args.limit.max && this.args.direction === 1) {
            this.manualStop();
        }
        else if (this.steps - 1 < this.args.limit.min &&
            this.args.direction === -1) {
            this.manualStop();
        }
        else {
            this.manualStep();
        }
    }
    manualMove() {
        if (!this.finish) {
            this.onStepSize();
            this.onDirection();
            this.manualLimit();
            this.args.callback(Object.assign({ step: this.steps }, this.args));
            setTimeout(() => {
                console.log(this.steps);
                this.manualMove();
            }, 1);
        }
        return;
    }
    manualStart(args) {
        if (this.onRunning()) {
            return new Promise((resolve, reject) => {
                this.args = Object.assign(Object.assign({}, args), { resolve });
                this.manualMove();
            });
        }
        return new Promise((resolve, reject) => reject("motor is running !!!"));
    }
    manualStop() {
        return new Promise((resolve, reject) => {
            this.finish = true;
            this.running = false;
            this.args.callback(Object.assign({ done: true, step: this.steps }, this.args));
            this.args.resolve(Object.assign({ done: true, step: this.steps }, this.args));
        });
    }
    //
    // ──────────────────────────────────────────────────────────
    //   :::::: A U T O : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────
    //
    onRest() {
        if (this.args.destination - this.steps < 1 &&
            this.args.destination - this.steps > -1) {
            if (this.args.destination - this.steps < 0.0625 &&
                this.args.destination - this.steps > -0.0625) {
                this.autoStop();
            }
            else {
                this.onStepSize(16);
                this.autoStep();
            }
        }
        else {
            this.autoStop();
        }
        this.autoStep();
    }
    autoStop() {
        this.finish = true;
        this.running = false;
        this.args.callback(Object.assign({ done: true, step: this.steps }, this.args));
        this.args.resolve(Object.assign({ done: true, step: this.steps }, this.args));
    }
    autoStep() {
        this.steps = this.steps + this.args.direction * (1 / this.stepSize);
        this.step.digitalWrite(true);
        this.step.digitalWrite(false);
    }
    autoLimit() {
        if (this.steps + 1 > this.args.limit.max && this.args.direction === 1) {
            this.autoStop();
        }
        else if (this.steps - 1 < this.args.limit.min &&
            this.args.direction === -1) {
            this.autoStop();
        }
        else if (this.steps + 1 > this.args.destination &&
            this.args.direction === 1) {
            this.onRest();
        }
        else if (this.steps - 1 < this.args.destination &&
            this.args.direction === -1) {
            this.onRest();
        }
        else {
            this.autoStep();
        }
    }
    autoMove() {
        if (!this.finish) {
            this.args.callback(Object.assign({ step: this.steps }, this.args));
            this.autoLimit();
            setTimeout(() => {
                this.autoMove();
            }, 1);
        }
        return;
    }
    autoGoToPosition(args) {
        if (this.onRunning()) {
            return new Promise((resolve, reject) => {
                this.args = Object.assign(Object.assign({}, args), { resolve });
                this.onStepSize();
                this.onDirection();
                this.autoMove();
            });
        }
        return new Promise((resolve, reject) => reject("motor is running !!!"));
    }
}
exports.Stepper = Stepper;
//
// todo
// ────────────────────────────────────────────────────────────────────────────────
// manual refactor
// 3 class - settings ( main ), manual , auto
