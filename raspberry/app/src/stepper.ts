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
    private finish: boolean = false
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
  }

  private step_2(): void {
    this.ms1.digitalWrite(true);
    this.ms2.digitalWrite(false);
    this.ms3.digitalWrite(false);
  }

  private step_4(): void {
    this.ms1.digitalWrite(false);
    this.ms2.digitalWrite(true);
    this.ms3.digitalWrite(false);
  }

  private step_8(): void {
    this.ms1.digitalWrite(true);
    this.ms2.digitalWrite(true);
    this.ms3.digitalWrite(false);
  }

  private step_16(): void {
    this.ms1.digitalWrite(true);
    this.ms2.digitalWrite(true);
    this.ms3.digitalWrite(true);
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
  private autoStop(
    callback: ({ step: number }) => {}
  ): Promise<{ stop: boolean }> {
    return new Promise((resolve, reject) => {
      this.finish = true;
      this.running = false;
      callback({ step: this.steps });
      resolve({ stop: true });
    });
  }

  private autoStep(direction: number, stepSize: number): void {
    this.steps = this.steps + direction * (1 / stepSize);
    this.step.digitalWrite(true);
    this.step.digitalWrite(false);
  }

  private autoLimit(
    destination: number,
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step: number }) => {},
    resolve: any
  ): void {
    if (this.steps + 1 > limit.max && direction === 1) {
      this.autoStop(callback);
      resolve({ done: true });
    } else if (this.steps - 1 < limit.min && direction === -1) {
      this.autoStop(callback);
      resolve({ done: true });
    } else if (this.steps + 1 > destination && direction === 1) {
      console.log("destinatione done", destination);
      this.autoStop(callback);
      resolve({ done: true });
    } else if (this.steps - 1 < destination && direction === -1) {
      console.log("destinatione done", destination);
      this.autoStop(callback);
      resolve({ done: true });
    } else {
      this.autoStep(direction, stepSize);
      resolve({ done: false });
    }
  }

  private autoMove(
    destination: number,
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step: number }) => {},
    resolve: any
  ): any {
    if (!this.finish) {
      this.onStepSize(stepSize);
      this.onDirection(direction);
      this.autoLimit(
        destination,
        direction,
        stepSize,
        limit,
        callback,
        resolve
      );
      callback({ step: this.steps });
      setTimeout(() => {
        this.autoMove(
          destination,
          direction,
          stepSize,
          limit,
          callback,
          resolve
        );
      }, 1);
    }
    return;
  }

  public autoGoToPosition(
    destination: number,
    direction: number,
    stepSize: number,
    limit: { max: number; min: number },
    callback: ({ step: number }) => {}
  ): Promise<{ done: boolean }> {
    if (this.onRunning()) {
      return new Promise((resolve, reject) =>
        this.autoMove(
          destination,
          direction,
          stepSize,
          limit,
          callback,
          resolve
        )
      );
    }
    return new Promise((resolve, reject) => reject("motor is running !!!"));
  }
}

// const z = new Stepper(19, 26);
// stepper.x
//   .turn(1000, 1, 1)
//   .then((data: any) => console.log("1 x", data))
//   .catch(err => console.log("error", err));

// stepper.y
//   .turn(1000, 1, 1)
//   .then((data: any) => console.log("1 y", data))
//   .catch(err => console.log("error", err));
