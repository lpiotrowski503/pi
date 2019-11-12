export class Auto {
  private program: any;

  constructor(
    program: any,
    private workingStep: number = 1,
    private position: {
      x: number;
      y: number;
      z: number;
    } = {
      x: 0,
      y: 0,
      z: 0
    }
  ) {
    this.program = program;
  }

  private onWorkingStep(row: string): void {
    if (row.includes("g1")) this.workingStep = 16;
    if (row.includes("g0")) this.workingStep = 1;
  }

  private onPosition(axis: string, row: string): void {
    if (row.includes(axis)) {
      const start = +row.indexOf(axis);
      const end = +row.indexOf(" ", start);
      this.position[axis] = +row.slice(
        start + 1,
        end === -1 ? row.length : end
      );

      //   console.log(row);
      //   console.log(start);
      //   console.log(end);
      //   console.log(this.position);
    }
    // return this.position;
  }

  private read(): void {
    this.program.src.forEach((row: string) => {
      this.onWorkingStep(row);
      console.log("------------");
      this.onPosition("x", row);
      this.onPosition("y", row);
      this.onPosition("z", row);
      console.log("------------");
    });
  }

  private readOne(index: number): void {
    const src = this.program.src;
    // this.program.src.forEach((row: string) => {
    this.onWorkingStep(src[index]);
    // console.log("------------");
    this.onPosition("x", src[index]);
    this.onPosition("y", src[index]);
    this.onPosition("z", src[index]);
    // console.log("------------");
    // });
  }

  private compare(start: any, end: any): number | null {
    if (start !== end) {
      if (start < end) {
        return 1;
      } else {
        return -1;
      }
    }
    return null;
  }

  public setParams(
    index: number,
    startPosition: { x: number; y: number; z: number },
    callback: (args: {
      destination: number;
      direction: number | null;
      speed: number;
    }) => {}
  ): any {
    this.readOne(index);
    // console.log(this.compare(startPosition.x, this.position.x));
    // console.log(this.compare(startPosition.y, this.position.y));
    // console.log(this.compare(startPosition.z, this.position.z));

    // this.readOne(1);
    // console.log(this.compare(startPosition.x, this.position.x));
    // console.log(this.compare(startPosition.y, this.position.y));
    // console.log(this.compare(startPosition.z, this.position.z));

    //   resolve({
    //     direction: this.compare(startPosition.x, this.position.x),
    //     stepSize: this.workingStep
    //   });

    callback({
      destination: this.position.x,
      direction: this.compare(startPosition.x, this.position.x),
      speed: this.workingStep
    });
  }
}
