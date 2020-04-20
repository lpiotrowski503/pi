import * as Datastore from "nedb";

export class Db {
  constructor(
    public positions = new Datastore({
      filename: "./db/positions",
      autoload: true,
    }),
    public programs = new Datastore({
      filename: "./db/programs",
      autoload: true,
    })
  ) {}

  public createCurrent(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.positions.insert(
        {
          name: "current",
          position: { x: 250, y: 250, z: 0 },
        },
        (err, _program) => {
          resolve(_program);
        }
      );
    });
  }

  public getCurrent(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.positions.findOne({ name: "current" }, (err, current) => {
        resolve(current);
      });
    });
  }

  public getCurrentAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.positions.find({ name: "current" }, (err, current) => {
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

  public resetCurrent(current: any): Promise<any> {
    return new Promise((resolve, reject) => {
      current.position.x = 250;
      current.position.y = 250;
      current.position.z = 0;
      this.positions.update(
        { name: "current" },
        current,
        {},
        (err, _current) => {
          this.getCurrent().then((res) => resolve(res));
        }
      );
    });
  }
}
