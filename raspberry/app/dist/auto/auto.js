"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Auto {
    constructor() {
        this.stepperAxis = ({ axis, app, db }) => {
            if (app.settings[app.moveCounter][axis].direction === null) {
                this.nextStep({ app, db });
            }
            else {
                app.setAutoParams({ axis, db, nextStep: this.nextStep });
                app.stepper[axis].autoGoToPosition(app.params).then((response) => {
                    console.log("then---", response);
                    console.log("current", app.current.position);
                });
            }
        };
        this.nextStep = ({ app, db }) => {
            app.complite++;
            if (app.complite === 3) {
                app.moveCounter++;
                app.complite = 0;
                if (app.moveCounter < app.settings.length) {
                    setTimeout(() => {
                        this.stepperAxis({ axis: "x", app, db });
                        this.stepperAxis({ axis: "y", app, db });
                        this.stepperAxis({ axis: "z", app, db });
                    }, 1);
                }
                else {
                    console.log("program finish----------------");
                    console.log(app.moveCounter);
                    console.log(app.settings.length);
                    console.log("current", app.current.position);
                    console.log("-----------------------------------");
                    return;
                }
            }
            else {
                return;
            }
        };
        this.autoStartProgram = ({ app, db }) => {
            console.log(1, app);
            // app.program.setParams(app.current.position, (_settings: any) => {
            //   app.settings = _settings;
            // this.stepperAxis({ axis: "x", app, db });
            // this.stepperAxis({ axis: "y", app, db });
            // this.stepperAxis({ axis: "z", app, db });
            // });
        };
    }
}
exports.Auto = Auto;
