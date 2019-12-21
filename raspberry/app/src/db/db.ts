import * as Datastore from "nedb";

export class Db {
  constructor(
    public positions = new Datastore({
      filename: "./db/positions",
      autoload: true
    }),
    public programs = new Datastore({
      filename: "./db/programs",
      autoload: true
    })
  ) {}

  public getCurrent(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.positions.findOne({ name: "current" }, (err, current) => {
        resolve(current);
      });
    });
  }

  public getProgram(programId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.programs.findOne({ _id: programId }, (err, program) => {
        resolve(program);
      });
    });
  }

  public async getPrograms(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.programs.find({}, (err, programs) => {
        resolve(programs);
      });
    });
  }

  public createProgram(program: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.programs.insert(program, (err, _program) => {
        resolve(_program);
      });
    });
  }

  public updateProgram(id: string, program: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.programs.update({ _id: id }, program, {}, (err, _program) => {
        resolve(_program);
      });
    });
  }

  public deleteProgram(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.programs.remove({ _id: id }, (err, _program) => {
        resolve(_program);
      });
    });
  }

  public updateCurrent(current: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.positions.update(
        { name: "current" },
        current,
        {},
        (err, _current) => {
          resolve(_current);
        }
      );
    });
  }

  public resetCurrent(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.positions.update(
        { name: "current" },
        { x: 0, y: 0, z: 0 },
        {},
        (err, _current) => {
          resolve(_current);
        }
      );
    });
  }
}
