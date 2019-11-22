export class Program {
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
    }
  }

  private readOne(index: number): void {
    const src = this.program.src;
    this.onWorkingStep(src[index]);
    this.onPosition("x", src[index]);
    this.onPosition("y", src[index]);
    this.onPosition("z", src[index]);
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
    startPosition: { x: number; y: number; z: number },
    callback: any
  ): any {
    const result: any[] = [];
    let position = startPosition;
    this.program.src.forEach((row: string, index: number) => {
      this.readOne(index);
      result.push({
        x: {
          destination: this.position.x,
          direction: this.compare(position.x, this.position.x),
          speed: this.workingStep
        },
        y: {
          destination: this.position.y,
          direction: this.compare(startPosition.y, this.position.y),
          speed: this.workingStep
        },
        z: {
          destination: this.position.z,
          direction: this.compare(startPosition.z, this.position.z),
          speed: this.workingStep
        }
      });
      position.x = +`${this.position.x}`;
      position.y = +`${this.position.y}`;
      position.z = +`${this.position.z}`;
    });
    callback(result);
  }
}
