"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Auto {
    constructor(program, workingStep = 1, position = {
        x: 0,
        y: 0,
        z: 0
    }) {
        this.workingStep = workingStep;
        this.position = position;
        this.program = program;
    }
    onWorkingStep(row) {
        if (row.includes("g1"))
            this.workingStep = 16;
        if (row.includes("g0"))
            this.workingStep = 1;
    }
    onPosition(axis, row) {
        if (row.includes(axis)) {
            const start = +row.indexOf(axis);
            const end = +row.indexOf(" ", start);
            this.position[axis] = +row.slice(start + 1, end === -1 ? row.length : end);
            //   console.log(row);
            //   console.log(start);
            //   console.log(end);
            //   console.log(this.position);
        }
        // return this.position;
    }
    read() {
        this.program.src.forEach((row) => {
            this.onWorkingStep(row);
            console.log("------------");
            this.onPosition("x", row);
            this.onPosition("y", row);
            this.onPosition("z", row);
            console.log("------------");
        });
    }
    readOne(index) {
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
    compare(start, end) {
        if (start !== end) {
            if (start < end) {
                return 1;
            }
            else {
                return -1;
            }
        }
        return null;
    }
    setParams(index, startPosition, callback) {
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
exports.Auto = Auto;
