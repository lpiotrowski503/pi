const Gpio = require("pigpio").Gpio;
// import { Gpio } from "pigpio";

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
  private args: any;

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

  private onStepSize(stepSize = this.args.stepSize): void {
    this[`step_${stepSize}`]();
  }

  private onDirection(): void {
    if (this.args.direction === 1) {
      this.dir.digitalWrite(true);
    }
    if (this.args.direction === -1) {
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
  private manualStep(): void {
    this.steps = this.steps + this.args.direction * (1 / this.args.stepSize);
    this.step.digitalWrite(true);
    this.step.digitalWrite(false);
  }

  private manualLimit(): void {
    if (this.steps + 1 > this.args.limit.max && this.args.direction === 1) {
      this.manualStop();
    } else if (
      this.steps - 1 < this.args.limit.min &&
      this.args.direction === -1
    ) {
      this.manualStop();
    } else {
      this.manualStep();
    }
  }

  private manualMove(): any {
    if (!this.finish) {
      this.onStepSize();
      this.onDirection();
      this.manualLimit();
      this.args.callback({ step: this.steps, ...this.args });
      setTimeout(() => {
        console.log(
          "pi-out--- " +
            JSON.stringify({
              action: "manual move",
              step: this.steps,
              ...this.args,
            })
        );
        this.manualMove();
      }, 1);
    }
    return;
  }

  public manualStart(args: any): Promise<{ done: boolean }> {
    if (this.onRunning()) {
      return new Promise((resolve, reject) => {
        this.args = {
          ...args,
          resolve,
        };
        this.manualMove();
      });
    }
    return new Promise((resolve, reject) => reject("motor is running !!!"));
  }

  public manualStop(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.finish = true;
      this.running = false;
      this.args.callback({ done: true, step: this.steps, ...this.args });
      this.args.resolve({ done: true, step: this.steps, ...this.args });
    });
  }
  //
  // ──────────────────────────────────────────────────────────
  //   :::::: A U T O : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────
  //
  private onRest(): void {
    if (
      this.args.destination - this.steps < 1 &&
      this.args.destination - this.steps > -1
    ) {
      if (
        this.args.destination - this.steps < 0.0625 &&
        this.args.destination - this.steps > -0.0625
      ) {
        this.autoStop();
      } else {
        this.onStepSize(16);
        this.autoStep();
      }
    } else {
      this.autoStop();
    }
    this.autoStep();
  }

  private autoStop(): void {
    this.finish = true;
    this.running = false;
    this.args.callback({ done: true, step: this.steps, ...this.args });
    this.args.resolve({ done: true, step: this.steps, ...this.args });
  }

  private autoStep(): void {
    this.steps = this.steps + this.args.direction * (1 / this.stepSize);
    this.step.digitalWrite(true);
    this.step.digitalWrite(false);
  }

  private autoLimit(): void {
    if (this.steps + 1 > this.args.limit.max && this.args.direction === 1) {
      this.autoStop();
    } else if (
      this.steps - 1 < this.args.limit.min &&
      this.args.direction === -1
    ) {
      this.autoStop();
    } else if (
      this.steps + 1 > this.args.destination &&
      this.args.direction === 1
    ) {
      this.onRest();
    } else if (
      this.steps - 1 < this.args.destination &&
      this.args.direction === -1
    ) {
      this.onRest();
    } else {
      this.autoStep();
    }
  }

  private autoMove(): any {
    if (!this.finish) {
      this.args.callback({ step: this.steps, ...this.args });
      this.autoLimit();
      setTimeout(() => {
        this.autoMove();
      }, 1);
    }
    return;
  }

  public autoGoToPosition(args: any): Promise<any> {
    if (this.onRunning()) {
      return new Promise((resolve, reject) => {
        this.args = {
          ...args,
          resolve,
        };
        this.onStepSize();
        this.onDirection();
        this.autoMove();
      });
    }
    return new Promise((resolve, reject) => reject("motor is running !!!"));
  }
}
//
// todo
// ────────────────────────────────────────────────────────────────────────────────
// manual refactor
// 3 class - settings ( main ), manual , auto
