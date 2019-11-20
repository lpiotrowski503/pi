"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    constructor(limitNumber = 200, config = {
        current: {},
        stepper: {},
        program: {},
        settings: [],
        args: {},
        moveCounter: 0,
        complite: 0,
        limit: {
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
        }
    }) {
        this.limitNumber = limitNumber;
        this.config = config;
    }
}
exports.Store = Store;
