"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const env_1 = require("./env");
exports.corsOptions = {
    origin: env_1.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
};
