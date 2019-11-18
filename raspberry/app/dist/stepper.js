"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const Gpio = require("pigpio").Gpio;
const pigpio_1 = require("pigpio");
class Stepper {
    constructor(step, dir, steps, ms1 = new pigpio_1.Gpio(17, { mode: pigpio_1.Gpio.OUTPUT }), ms2 = new pigpio_1.Gpio(27, { mode: pigpio_1.Gpio.OUTPUT }), ms3 = new pigpio_1.Gpio(22, { mode: pigpio_1.Gpio.OUTPUT }), running = false, finish = false, stepSize = 1) {
        this.ms1 = ms1;
        this.ms2 = ms2;
        this.ms3 = ms3;
        this.running = running;
        this.finish = finish;
        this.stepSize = stepSize;
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
    onRest(destination, direction, callback, resolve) {
        if (destination - this.steps < 1 && destination - this.steps > -1) {
            if (destination - this.steps < 0.0625 &&
                destination - this.steps > -0.0625) {
                this.autoStop(callback, resolve, {
                    done: true,
                    destination,
                    step: this.steps
                });
            }
            else {
                this.onStepSize(16);
                this.autoStep(direction);
            }
        }
        else {
            this.autoStop(callback, resolve, {
                done: true,
                destination,
                step: this.steps
            });
        }
        this.autoStep(direction);
    }
    autoStop(callback, resolve, arg) {
        this.finish = true;
        this.running = false;
        callback(arg);
        resolve(Object.assign({ stop: this.finish }, arg));
    }
    autoStep(direction) {
        this.steps = this.steps + direction * (1 / this.stepSize);
        this.step.digitalWrite(true);
        this.step.digitalWrite(false);
    }
    autoLimit(destination, direction, limit, callback, resolve) {
        if (this.steps + 1 > limit.max && direction === 1) {
            this.autoStop(callback, resolve, { done: true, destination });
        }
        else if (this.steps - 1 < limit.min && direction === -1) {
            this.autoStop(callback, resolve, { done: true, destination });
        }
        else if (this.steps + 1 > destination && direction === 1) {
            this.onRest(destination, direction, callback, resolve);
        }
        else if (this.steps - 1 < destination && direction === -1) {
            this.onRest(destination, direction, callback, resolve);
        }
        else {
            this.autoStep(direction);
        }
    }
    autoMove(destination, direction, stepSize, limit, callback, resolve, timeout) {
        if (!this.finish) {
            callback({ step: this.steps, destination: destination });
            this.autoLimit(destination, direction, limit, callback, resolve);
            setTimeout(() => {
                this.autoMove(destination, direction, stepSize, limit, callback, resolve, timeout);
            }, timeout);
        }
        return;
    }
    autoGoToPosition(destination, direction, stepSize, limit, callback, timeout = 1) {
        if (this.onRunning()) {
            return new Promise((resolve, reject) => {
                this.onStepSize(stepSize);
                this.onDirection(direction);
                this.autoMove(destination, direction, stepSize, limit, callback, resolve, timeout);
            });
        }
        return new Promise((resolve, reject) => reject("motor is running !!!"));
    }
}
exports.Stepper = Stepper;
