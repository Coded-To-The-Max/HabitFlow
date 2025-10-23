"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var PopupApp_1 = require("./PopupApp");
require("./index.css");
var container = document.getElementById('root');
if (container) {
    var root = (0, client_1.createRoot)(container);
    root.render(<PopupApp_1.default />);
}
