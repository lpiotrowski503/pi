const Gpio = require("pigpio").Gpio;

export class A4988 {
  _delay;
  _steps;
  _step;
  _dir;

  constructor({ step = 15, dir = 14 }) {
    this._delay = 1;
    this._steps = 0;

    this._step = new Gpio(step, { mode: Gpio.OUTPUT });
    this._dir = new Gpio(dir, { mode: Gpio.OUTPUT });
    this._step.digitalWrite(false);
    this._dir.digitalWrite(false);

    console.log("a4988");
  }

  onDirection(direction) {
    if (direction === 1) {
      this._dir.digitalWrite(true);
    }
    if (direction === 0) {
      this._dir.digitalWrite(false);
    }
  }

  _turn(steps, res) {
    // console.log(steps);
    // console.log(this._steps);

    this._steps++;
    this._step.digitalWrite(true);
    this._step.digitalWrite(false);
    if (this._steps == steps) {
      return;
    }
    setTimeout(() => this._turn(steps, res), this._delay);
  }

  turn(steps = 1, direction = 1) {
    this.onDirection(direction);
    console.log(direction);
    this._steps = 0;
    return new Promise(res => this._turn(steps, res));
  }
}
