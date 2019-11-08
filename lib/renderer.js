"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const rx_ipc_1 = require("./rx-ipc");
exports.default = new rx_ipc_1.RxIpc(electron_1.ipcRenderer);
//# sourceMappingURL=renderer.js.map