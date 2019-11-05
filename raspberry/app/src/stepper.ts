const Gpio = require("pigpio").Gpio;

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

  constructor(
    step: number,
    dir: number,
    private ms1 = new Gpio(17, { mode: Gpio.OUTPUT }),
    private ms2 = new Gpio(27, { mode: Gpio.OUTPUT }),
    private ms3 = new Gpio(22, { mode: Gpio.OUTPUT }),
    private steps = 0,
    private running = false,
    private finish = false
  ) {
    this.step = new Gpio(step, { mode: Gpio.OUTPUT });
    this.dir = new Gpio(dir, { mode: Gpio.OUTPUT });
  }

  private onDirection(direction: number): void {
    if (direction === 1) {
      this.dir.digitalWrite(true);
    }
    if (direction === 0) {
      this.dir.digitalWrite(false);
    }
  }

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

  private onStep(steps: number, resolve): void {
    this.steps++;
    this.step.digitalWrite(true);
    this.step.digitalWrite(false);
    this.onStop(steps, resolve);
  }

  private onStop(steps: number, resolve): void {
    if (this.steps == steps) {
      this.running = false;
      this.finish = true;
      this.steps = 0;
      resolve({ done: true });
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

  private onMove(
    steps: number,
    direction: number,
    stepSize: number,
    resolve
  ): any {
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

  public turn(
    steps: number,
    direction: number,
    stepSize: number
  ): Promise<{ done: boolean }> {
    if (this.onRunning()) {
      return new Promise((resolve, reject) =>
        this.onMove(steps, direction, stepSize, resolve)
      );
    }
    return new Promise((resolve, reject) => reject("motor is running !!!"));
  }

  public start(
    direction: number,
    stepSize: number
  ): Promise<{ done: boolean }> {
    if (this.onRunning()) {
      return new Promise((resolve, reject) =>
        this.onMove(1000000, direction, stepSize, resolve)
      );
    }
    return new Promise((resolve, reject) => reject("motor is running !!!"));
  }

  public stop(): Promise<{ stop: boolean }> {
    return new Promise((resolve, reject) => {
      this.steps = 0;
      this.finish = true;
      this.running = false;
      resolve({ stop: true });
    });
  }
}
