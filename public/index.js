"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var fetch = require("node-fetch");
var slackLogger = /** @class */ (function () {
    function slackLogger() {
    }
    slackLogger.main = function () {
        var _this = this;
        // Read config file & setup starting position
        var data = fs.readFileSync('./logger.config.1.json');
        var jsonData = JSON.parse(data.toString());
        this.apiUrl = jsonData.url;
        this.logfilePath = jsonData.logfilePath;
        this.backend = jsonData.backend;
        this.levels = jsonData.levels;
        console.log('API url: ' + this.apiUrl);
        console.log('logfilePath: ' + this.logfilePath);
        console.log('backend: ' + this.backend);
        console.log('levels: ');
        console.log(this.levels);
        // Set lastModifiedLine to current number of lines in logfile
        fs.createReadStream(this.logfilePath)
            .on('error', function (e) { return console.error(e); })
            .on('data', function (chunk) {
            for (var i = 0; i < chunk.length; ++i) {
                if (chunk[i] == 10)
                    _this.lastModifiedLine++;
            }
        })
            .on('end', function () {
            console.log('Current lines: ' + _this.lastModifiedLine.toString());
        });
        // Start watching logfile
        fs.watch(this.logfilePath, function (event, filename) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(event === 'change')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.logChangeCallback(event, filename, this.logfilePath, this.lastModifiedLine, this.apiUrl, this.levels)];
                    case 1:
                        _a.sent();
                        console.log("Looking at line " + this.lastModifiedLine.toString());
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        return 0;
    };
    slackLogger.logChangeCallback = function (event, filename, logfilePath, lastModifiedLine, url, levels) {
        return __awaiter(this, void 0, void 0, function () {
            var startLine, endLine, content, msgs, i, msg, i, data, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startLine = lastModifiedLine;
                        endLine = startLine;
                        msgs = [];
                        if (!(event === 'change')) return [3 /*break*/, 4];
                        content = fs.readFileSync(logfilePath).toString().split('\n');
                        for (i = startLine; i < content.length; i++) {
                            endLine++;
                            msg = content[i];
                            if (levels.indexOf(msg.split(' ')[0]) > -1) {
                                msgs.push(content[i]);
                            }
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < msgs.length)) return [3 /*break*/, 4];
                        data = {
                            'text': msgs[i]
                        };
                        return [4 /*yield*/, fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            })];
                    case 2:
                        response = _a.sent();
                        if (response.status === 200) {
                            console.log('Message sent!');
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        fs.watch(this.logfilePath, function (event, filename) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(event === 'change')) return [3 /*break*/, 2];
                                        this.lastModifiedLine = endLine - 1;
                                        return [4 /*yield*/, this.logChangeCallback(event, filename, this.logfilePath, this.lastModifiedLine, this.apiUrl, this.levels)];
                                    case 1:
                                        _a.sent();
                                        console.log("Looking at line " + this.lastModifiedLine.toString());
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    slackLogger.apiUrl = "";
    slackLogger.logfilePath = "";
    slackLogger.backend = "";
    slackLogger.levels = null;
    slackLogger.lastModifiedLine = 0;
    return slackLogger;
}());
slackLogger.main();
//# sourceMappingURL=index.js.map