import * as express from "express";
import * as cors from "cors";
import * as path from "path";

export class Store {
  constructor(
    private limitNumber: number = 500,
    public board: any = {},
    public current: any = {},
    public stepper: any = {},
    public program: any = {},
    public settings: any = [],
    public params: any = {},
    public moveCounter: number = 0,
    public complite: number = 0,
    public limit: any = {
      x: {
        max: limitNumber,
        min: 0,
      },
      y: {
        max: limitNumber,
        min: 0,
      },
      z: {
        max: 1000,
        min: -500,
      },
    },
    public server = express(),
    public raspi = require("raspi-io").RaspiIO,
    public five = require("johnny-five")
  ) {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.static(path.join(__dirname, "../public")));
    this.server.listen(3000, () => {
      console.log(`server running on port 3000`);
    });
    this.board = new five.Board({
      io: new raspi(),
    });
  }

  public setManualParams({ req, db }): void {
    this.params = {
      direction: req.body.direction,
      stepSize: req.body.speed,
      limit: this.limit[req.body.axis],
      callback: (response: any) => {
        this.current.position[req.body.axis] = response.step;
        db.updateCurrent(this.current);
      },
    };
  }

  public setAutoParams({ axis, db, nextStep }): void {
    this.params = {
      destination: this.settings[this.moveCounter][axis].destination,
      direction: this.settings[this.moveCounter][axis].direction,
      stepSize: this.settings[this.moveCounter][axis].speed,
      limit: this.limit[axis],
      callback: (response: any) => {
        this.current.position[axis] = response.step;
        db.updateCurrent(this.current);
        if (response.done) {
          nextStep();
        }
      },
      timeout: 1,
    };
  }
}
