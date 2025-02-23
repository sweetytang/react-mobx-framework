"use strict";

require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseStore = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _mobx = require("mobx");
var BaseStore = exports.BaseStore = /*#__PURE__*/function () {
  function BaseStore(root) {
    (0, _classCallCheck2.default)(this, BaseStore);
    (0, _defineProperty2.default)(this, "rootStore", void 0);
    this.rootStore = root;
    (0, _mobx.makeObservable)(this, {
      root: _mobx.computed
    });
  }
  return (0, _createClass2.default)(BaseStore, [{
    key: "root",
    get: function get() {
      return this.rootStore;
    }
  }]);
}();