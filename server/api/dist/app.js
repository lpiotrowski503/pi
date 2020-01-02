"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// ────────────────────────────────────────────────────────────────────────────────
const db_1 = require("./startup/db");
const config_1 = require("./startup/config");
const routes_1 = require("./startup/routes");
const server_1 = require("./startup/server");
const app = express();
db_1.default();
config_1.default(app);
routes_1.default(app);
server_1.default(app);
