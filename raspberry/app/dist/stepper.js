"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gpio = require("pigpio").Gpio;
class Stepper {
    constructor(step, dir, ms1 = new Gpio(17, { mode: Gpio.OUTPUT }), ms2 = new Gpio(27, { mode: Gpio.OUTPUT }), ms3 = new Gpio(22, { mode: Gpio.OUTPUT }), steps = 0, running = false, finish = false) {
        this.ms1 = ms1;
        this.ms2 = ms2;
        this.ms3 = ms3;
        this.steps = steps;
        this.running = running;
        this.finish = finish;
        this.step = new Gpio(step, { mode: Gpio.OUTPUT });
        this.dir = new Gpio(dir, { mode: Gpio.OUTPUT });
    }
    onDirection(direction) {
        if (direction === 1) {
            this.dir.digitalWrite(true);
        }
        if (direction === 0) {
            this.dir.digitalWrite(false);
        }
    }
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
    onStep(steps, resolve) {
        this.steps++;
        this.step.digitalWrite(true);
        this.step.digitalWrite(false);
        this.onStop(steps, resolve);
    }
    onStop(steps, resolve) {
        if (this.steps == steps) {
            this.running = false;
            this.finish = true;
            this.steps = 0;
            resolve({ done: true });
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
    onMove(steps, direction, stepSize, resolve) {
        if (!this.finish) {
            this.onStepSize(stepSize);
            this.onDirection(direction);
            this.onStep(steps, resolve);
            setTimeout(() => {
                this.onMove(steps, direction, stepSize, resolve);
            }, 1);
        }
        return;
    }
    turn(steps, direction, stepSize) {
        if (this.onRunning()) {
            return new Promise((resolve, reject) => this.onMove(steps, direction, stepSize, resolve));
        }
        return new Promise((resolve, reject) => reject("motor is running !!!"));
    }
    start(direction, stepSize) {
        if (this.onRunning()) {
            return new Promise((resolve, reject) => this.onMove(1000, direction, stepSize, resolve));
        }
        return new Promise((resolve, reject) => reject("motor is running !!!"));
    }
    stop() {
        this.running = false;
        this.finish = true;
        this.steps = 0;
    }
}
exports.Stepper = Stepper;
