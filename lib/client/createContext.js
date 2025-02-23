"use strict";

require("core-js/modules/es.object.define-property.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClientContext = createClientContext;
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.search.js");
require("core-js/modules/es.string.starts-with.js");
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
      var _location$search;
      var search = (_location$search = location.search) !== null && _location$search !== void 0 ? _location$search : '';
      return _qs.default.parse(search.startsWith('?') ? search.slice(1) : search);
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