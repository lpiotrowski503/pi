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
        }
    }
    readOne(index) {
        const src = this.program.src;
        this.onWorkingStep(src[index]);
        this.onPosition("x", src[index]);
        this.onPosition("y", src[index]);
        this.onPosition("z", src[index]);
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
    setParams(startPosition, callback) {
        const result = [];
        let position = startPosition;
        this.program.src.forEach((row, index) => {
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
exports.Auto = Auto;
