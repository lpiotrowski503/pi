"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const Gpio = require("pigpio").Gpio;
const pigpio_1 = require("pigpio");
class Stepper {
    constructor(step, dir, steps, ms1 = new pigpio_1.Gpio(17, { mode: pigpio_1.Gpio.OUTPUT }), ms2 = new pigpio_1.Gpio(27, { mode: pigpio_1.Gpio.OUTPUT }), ms3 = new pigpio_1.Gpio(22, { mode: pigpio_1.Gpio.OUTPUT }), running = false, finish = false) {
        this.ms1 = ms1;
        this.ms2 = ms2;
        this.ms3 = ms3;
        this.running = running;
        this.finish = finish;
        this.step = new pigpio_1.Gpio(step, { mode: pigpio_1.Gpio.OUTPUT });
        this.dir = new pigpio_1.Gpio(dir, { mode: pigpio_1.Gpio.OUTPUT });
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
    }
    step_2() {
        this.ms1.digitalWrite(true);
        this.ms2.digitalWrite(false);
        this.ms3.digitalWrite(false);
    }
    step_4() {
        this.ms1.digitalWrite(false);
        this.ms2.digitalWrite(true);
        this.ms3.digitalWrite(false);
    }
    step_8() {
        this.ms1.digitalWrite(true);
        this.ms2.digitalWrite(true);
        this.ms3.digitalWrite(false);
    }
    step_16() {
        this.ms1.digitalWrite(true);
        this.ms2.digitalWrite(true);
        this.ms3.digitalWrite(true);
    }
    onStepSize(stepSize) {
        this[`step_${stepSize}`]();
    }
    onDirection(direction) {
        if (direction === 1) {
            this.dir.digitalWrite(true);
        }
        if (direction === -1) {
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
    // private onStep(steps: number, resolve: any): void {
    //   this.steps++;
    //   this.step.digitalWrite(true);
    //   this.step.digitalWrite(false);
    //   this.onStop(steps, resolve);
    // }
    // private onStop(steps: number, resolve: any): void {
    //   if (this.steps == steps) {
    //     this.running = false;
    //     this.finish = true;
    //     this.steps = 0;
    //     resolve({ done: true });
    //   } else {
    //     resolve({ done: false, step: this.steps });
    //   }
    // }
    // private onMove(
    //   steps: number,
    //   direction: number,
    //   stepSize: number,
    //   resolve: any
    // ): any {
    //   if (!this.finish) {
    //     this.onStepSize(stepSize);
    //     this.onDirection(direction);
    //     this.onStep(steps, resolve);
    //     setTimeout(() => {
    //       this.onMove(steps, direction, stepSize, resolve);
    //     }, 1);
    //   }
    //   return;
    // }
    // public turn(
    //   steps: number,
    //   direction: number,
    //   stepSize: number
    // ): Promise<{ done: boolean }> {
    //   if (this.onRunning()) {
    //     return new Promise((resolve, reject) =>
    //       this.onMove(steps, direction, stepSize, resolve)
    //     );
    //   }
    //   return new Promise((resolve, reject) => reject("motor is running !!!"));
    // }
    //
    // ──────────────────────────────────────────────────────────────
    //   :::::: M A N U A L : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────
    //
    manualStep(direction, stepSize) {
        this.steps = this.steps + direction * (1 / stepSize);
        this.step.digitalWrite(true);
        this.step.digitalWrite(false);
    }
    manualLimit(direction, stepSize, limit, callback, resolve) {
        if (this.steps + 1 > limit.max && direction === 1) {
            this.manualStop(callback);
            resolve({ done: true });
        }
        else if (this.steps - 1 < limit.min && direction === -1) {
            this.manualStop(callback);
            resolve({ done: true });
        }
        else {
            this.manualStep(direction, stepSize);
            resolve({ done: false });
        }
    }
    manualMove(direction, stepSize, limit, callback, resolve) {
        if (!this.finish) {
            this.onStepSize(stepSize);
            this.onDirection(direction);
            this.manualLimit(direction, stepSize, limit, callback, resolve);
            callback({ step: this.steps });
            setTimeout(() => {
                this.manualMove(direction, stepSize, limit, callback, resolve);
            }, 1);
        }
        return;
    }
    manualStart(direction, stepSize, limit, callback) {
        if (this.onRunning()) {
            return new Promise((resolve, reject) => this.manualMove(direction, stepSize, limit, callback, resolve));
        }
        return new Promise((resolve, reject) => reject("motor is running !!!"));
    }
    manualStop(callback) {
        return new Promise((resolve, reject) => {
            this.finish = true;
            this.running = false;
            callback({ step: this.steps });
            resolve({ stop: true });
        });
    }
    //
    // ──────────────────────────────────────────────────────────
    //   :::::: A U T O : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────
    //
    autoStop(callback) {
        return new Promise((resolve, reject) => {
            this.finish = true;
            this.running = false;
            callback({ step: this.steps });
            resolve({ stop: true });
        });
    }
    autoStep(direction, stepSize) {
        this.steps = this.steps + direction * (1 / stepSize);
        this.step.digitalWrite(true);
        this.step.digitalWrite(false);
    }
    autoLimit(destination, direction, stepSize, limit, callback, resolve) {
        if (this.steps + 1 > limit.max && direction === 1) {
            this.autoStop(callback);
            resolve({ done: true });
        }
        else if (this.steps - 1 < limit.min && direction === -1) {
            this.autoStop(callback);
            resolve({ done: true });
        }
        else if (this.steps + 1 > destination && direction === 1) {
            console.log("destinatione done", destination);
            this.autoStop(callback);
            resolve({ done: true });
        }
        else if (this.steps - 1 < destination && direction === -1) {
            console.log("destinatione done", destination);
            this.autoStop(callback);
            resolve({ done: true });
        }
        else {
            this.autoStep(direction, stepSize);
            resolve({ done: false });
        }
    }
    autoMove(destination, direction, stepSize, limit, callback, resolve) {
        if (!this.finish) {
            this.onStepSize(stepSize);
            this.onDirection(direction);
            this.autoLimit(destination, direction, stepSize, limit, callback, resolve);
            callback({ step: this.steps });
            setTimeout(() => {
                this.autoMove(destination, direction, stepSize, limit, callback, resolve);
            }, 1);
        }
        return;
    }
    autoGoToPosition(destination, direction, stepSize, limit, callback) {
        if (this.onRunning()) {
            return new Promise((resolve, reject) => this.autoMove(destination, direction, stepSize, limit, callback, resolve));
        }
        return new Promise((resolve, reject) => reject("motor is running !!!"));
    }
}
exports.Stepper = Stepper;
// const z = new Stepper(19, 26);
// stepper.x
//   .turn(1000, 1, 1)
//   .then((data: any) => console.log("1 x", data))
//   .catch(err => console.log("error", err));
// stepper.y
//   .turn(1000, 1, 1)
//   .then((data: any) => console.log("1 y", data))
//   .catch(err => console.log("error", err));
