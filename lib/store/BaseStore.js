"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseStore = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _mobx = require("mobx");
class BaseStore {
  constructor(root) {
    (0, _defineProperty2.default)(this, "rootStore", void 0);
    this.rootStore = root;
    (0, _mobx.makeObservable)(this, {
      root: _mobx.computed
    });
  }
  get root() {
    return this.rootStore;
  }
}
exports.BaseStore = BaseStore;