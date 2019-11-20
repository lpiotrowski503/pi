import * as express from "express";
import * as cors from "cors";
import * as path from "path";

export class Store {
  constructor(
    private limitNumber: number = 200,
    public board: any = {},
    public current: any = {},
    public stepper: any = {},
    public program: any = {},
    public settings: any = [],
    public args: any = {},
    public moveCounter: number = 0,
    public complite: number = 0,
    public limit: any = {
      x: {
        max: limitNumber,
        min: -limitNumber
      },
      y: {
        max: limitNumber,
        min: -limitNumber
      },
      z: {
        max: limitNumber,
        min: -limitNumber
      }
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
      io: new raspi()
    });
  }
}
