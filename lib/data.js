"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var data = [];
"http://127.0.0.1:3000/public/img/101.png";
for (var index = 1; index < 70; index++) {
    if (index !== 2 && index !== 3) {
        data.push("http://127.0.0.1:3000/public/img/" + index + ".png");
    }
}

exports.default = data;
//# sourceMappingURL=data.js.map