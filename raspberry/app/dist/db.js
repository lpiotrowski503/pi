"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Datastore = require("nedb");
class Db {
    constructor(positions = new Datastore({
        filename: "./db/positions",
        autoload: true
    }), programs = new Datastore({
        filename: "./db/programs",
        autoload: true
    })) {
        this.positions = positions;
        this.programs = programs;
    }
    getCurrent() {
        return new Promise((resolve, reject) => {
            this.positions.findOne({ name: "current" }, (err, current) => {
                resolve(current);
            });
        });
    }
    getProgram(programName) {
        return new Promise((resolve, reject) => {
            this.programs.findOne({ name: programName }, (err, program) => {
                resolve(program);
            });
        });
    }
    updateCurrent(current) {
        return new Promise((resolve, reject) => {
            this.positions.update({ name: "current" }, current, {}, (err, _current) => {
                resolve(_current);
            });
        });
    }
}
exports.Db = Db;
// public storage() {}
// public findOne(find) {
//   this.db.findOne(find, (err, docs) => {
//     console.log(docs);
//   });
// }
// public update(current: any) {
//   this.db.update(
//     { name: "current" },
//     current,
//     (err, numReplaced) => {
//       console.log(numReplaced);
//       this.findOne({ name: "current" });
//     }
//     // dbPrograms.update(
//     // { name: program2.name },
//     // { src: program2.src },
//     // {},
//     // (err, numReplaced) => {
//     //   console.log(numReplaced);
//     // }
//   );
// }
//
// ──────────────────────────────────────────── I ──────────
//   :::::: D B : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────
//
// const offset = {
//   name: "offset",
//   position: {
//     x: 0,
//     y: 0,
//     z: 0
//   }
// };
// const current = {
//   name: "current",
//   position: {
//     x: 0,
//     y: 0,
//     z: 0
//   }
// };
// const program1 = {
//   author: "boss",
//   name: "program 1",
//   src: [
//     "x 50 y 50 z 50",
//     "x 100 y 50 z 50",
//     "x 100 y 100 z 50",
//     "x 100 y 100 z 100"
//   ]
// };
// dbPositions.insert(offset, (err, newDoc) => {
//   console.log(newDoc);
// });
// dbPositions.findOne({ name: "offset" }, (err, docs) => {
//   console.log(docs);
// });
// dbPositions.update(
//   { name: "current" },
//   {
//     position: {
//       x: 1,
//       y: 1,
//       z: 1
//     }
//   },
//   {},
//   (err, numReplaced) => {
//     console.log(numReplaced);
//   }
// );
// const program2 = {
//   author: "boss",
//   name: "program 1",
//   src: ["x 50 y 50 z 50", "x 100 y 50 z 50", "x 100 y 100 z 50", "x 0 y 0 z 0"]
// };
// dbPositions.findOne({ name: "offset" }, (err, doc) => {
//   console.log(doc);
// });
// dbPrograms.insert(program1, (err, newDoc) => {
//   console.log(newDoc);
// });
// dbPrograms.update(
//   { name: program2.name },
//   { src: program2.src },
//   {},
//   (err, numReplaced) => {
//     console.log(numReplaced);
//   }
// );
// dbPrograms.findOne({ name: program2.name }, (err, doc) => {
//   console.log(doc);
// });
// const programSrc = `
//   x 50 y 50 z 50;
//   x 100 y 50 z 50;
//   x 100 y 100 z 50;
//   x 100 y 100 z 100;`;
// const arrayParse = arg => {
//   return arg.split(";");
// };
// console.log(arrayParse(programSrc));
// const program1 = {
//   author: "boss",
//   name: "program 1",
//   src: [
//     "g0 x0 y0 z0",
//     "g0 x-50 y-50",
//     "g0 z-40",
//     "g1 z-50",
//     "g1 y50",
//     "g1 x50",
//     "g1 y-50",
//     "g1 x-50",
//     "g1 z-40",
//     "g0 z0",
//     "g0 x0 y0"
//   ]
// };
// if (docs === null) {
//   dbPrograms.insert(program1, (err, newDoc) => {
//     console.log(newDoc);
//   });
// }
