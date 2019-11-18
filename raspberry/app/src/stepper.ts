// const Gpio = require("pigpio").Gpio;
import { Gpio } from "pigpio";

export class Stepper {
  /**
   * speed  ms1 ms2 ms3
   * 1      0   0   0
   * 1/2    1   0   0
   * 1/4    0   1   0
   * 1/8    1   1   0
   * 1/16   1   1   1
   */
  private step: any;
  private dir: any;
  private steps: any;

  constructor(
    step: number,
    dir: number,
    steps: number,
    private ms1 = new Gpio(17, { mode: Gpio.OUTPUT }),
    private ms2 = new Gpio(27, { mode: Gpio.OUTPUT }),
    private ms3 = new Gpio(22, { mode: Gpio.OUTPUT }),
    private running: boolean = false,
    private finish: boolean = false,
    private stepSize: number = 1
  ) {
    this.step = new Gpio(step, { mode: Gpio.OUTPUT });
    this.dir = new Gpio(dir, { mode: Gpio.OUTPUT });
    this.steps = steps;
  }
  //
  // ──────────────────────────────────────────────────────────────────
  //   :::::: S E T T I N G S : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────
  //
  private step_1(): void {
    this.ms1.digitalWrite(false);
    this.ms2.digitalWrite(false);
    this.ms3.digitalWrite(false);
    this.stepSize = 1;
  }

  private step_2(): void {
    this.ms1.digitalWrite(true);
    this.ms2.digitalWrite(false);
    this.ms3.digitalWrite(false);
    this.stepSize = 2;
  }

  private step_4(): void {
    this.ms1.digitalWrite(false);
    this.ms2.digitalWrite(true);
    this.ms3.digitalWrite(false);
    this.stepSize = 4;
  }

  private step_8(): void {
    this.ms1.digitalWrite(true);
    this.ms2.digitalWrite(true);
    this.ms3.digitalWrite(false);
    this.stepSize = 8;
  }

  private step_16(): void {
    this.ms1.digitalWrite(true);
    this.ms2.digitalWrite(true);
    this.ms3.digitalWrite(true);
    this.stepSize = 16;
  }

  private onStepSize(stepSize: number): void {
    this[`step_${stepSize}`]();
  }

  private onDirection(direction: number): void {
    if (direction === 1) {
      this.dir.digitalWrite(true);
    }
    if (direction === -1) {
      this.dir.digitalWrite(false);
    }
  }

  private onRunning(): boolean {
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
  private manualStep(direction: number, stepSize: number): void {
    this.steps = this.steps + direction * (1 / stepSize);
    this.step.digitalWrite(true);
    this.step.digitalWrite(false);
  }

  private manualLimit(
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step: number }) => {},
    resolve: any
  ): void {
    if (this.steps + 1 > limit.max && direction === 1) {
      this.manualStop(callback);
      resolve({ done: true });
    } else if (this.steps - 1 < limit.min && direction === -1) {
      this.manualStop(callback);
      resolve({ done: true });
    } else {
      this.manualStep(direction, stepSize);
      resolve({ done: false });
    }
  }

  private manualMove(
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step: number }) => {},
    resolve: any
  ): any {
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

  public manualStart(
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step: number }) => {}
  ): Promise<{ done: boolean }> {
    if (this.onRunning()) {
      return new Promise((resolve, reject) =>
        this.manualMove(direction, stepSize, limit, callback, resolve)
      );
    }
    return new Promise((resolve, reject) => reject("motor is running !!!"));
  }

  public manualStop(
    callback: ({ step: number }) => {}
  ): Promise<{ stop: boolean }> {
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
  private onRest(
    destination: number,
    direction: number,
    callback: ({ step, destination: number }) => {},
    resolve: any
  ): void {
    if (destination - this.steps < 1 && destination - this.steps > -1) {
      if (
        destination - this.steps < 0.0625 &&
        destination - this.steps > -0.0625
      ) {
        this.autoStop(callback, resolve, {
          done: true,
          destination,
          step: this.steps
        });
      } else {
        this.onStepSize(16);
        this.autoStep(direction);
      }
    } else {
      this.autoStop(callback, resolve, {
        done: true,
        destination,
        step: this.steps
      });
    }
    this.autoStep(direction);
  }

  private autoStop(callback: (args: any) => {}, resolve: any, arg?: any): void {
    this.finish = true;
    this.running = false;
    callback(arg);
    resolve({ stop: this.finish, ...arg });
  }

  private autoStep(direction: number): void {
    this.steps = this.steps + direction * (1 / this.stepSize);
    this.step.digitalWrite(true);
    this.step.digitalWrite(false);
  }

  private autoLimit(
    destination: number,
    direction: number,
    limit: { max: number; min: number },
    callback: ({ step, destination: number }) => {},
    resolve: any
  ): void {
    if (this.steps + 1 > limit.max && direction === 1) {
      this.autoStop(callback, resolve, { done: true, destination });
    } else if (this.steps - 1 < limit.min && direction === -1) {
      this.autoStop(callback, resolve, { done: true, destination });
    } else if (this.steps + 1 > destination && direction === 1) {
      this.onRest(destination, direction, callback, resolve);
    } else if (this.steps - 1 < destination && direction === -1) {
      this.onRest(destination, direction, callback, resolve);
    } else {
      this.autoStep(direction);
    }
  }

  private autoMove(
    destination: number,
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step, destination: number }) => {},
    resolve: any,
    timeout: number
  ): any {
    if (!this.finish) {
      callback({ step: this.steps, destination: destination });
      this.autoLimit(destination, direction, limit, callback, resolve);
      setTimeout(() => {
        this.autoMove(
          destination,
          direction,
          stepSize,
          limit,
          callback,
          resolve,
          timeout
        );
      }, timeout);
    }
    return;
  }

  public autoGoToPosition(
    destination: number,
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step, destination: number }) => {},
    timeout: number = 1
  ): Promise<{ done: boolean }> {
    if (this.onRunning()) {
      return new Promise((resolve, reject) => {
        this.onStepSize(stepSize);
        this.onDirection(direction);
        this.autoMove(
          destination,
          direction,
          stepSize,
          limit,
          callback,
          resolve,
          timeout
        );
      });
    }
    return new Promise((resolve, reject) => reject("motor is running !!!"));
  }
}
