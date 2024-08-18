"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClientContext = createClientContext;
var _qs = _interopRequireDefault(require("qs"));
var _cookie = _interopRequireDefault(require("cookie"));
var _uaParserJs = _interopRequireDefault(require("ua-parser-js"));
/**
 * 创建浏览器端信息上下文
 *
 * @ignore
 * @return {ClientContext} context
 */
function createClientContext() {
  return {
    get pathname() {
      return location.pathname;
    },
    get query() {
      return _qs.default.parse(location.search);
    },
    get userAgent() {
      return navigator.userAgent;
    },
    get hostname() {
      return location.hostname;
    },
    get cookies() {
      return _cookie.default.parse(document.cookie);
    },
    get platform() {
      return new _uaParserJs.default(navigator.userAgent).getResult();
    }
  };
}