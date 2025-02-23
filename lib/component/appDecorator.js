"use strict";

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.weak-map.js");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appDecorator = appDecorator;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.object.values.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _mobxReactLite = require("mobx-react-lite");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var DEFAULTS = {
  redirectUrl: '/',
  requireLogin: true,
  fallbackCSR: false,
  renderSpinner: function renderSpinner() {
    return /*#__PURE__*/_react.default.createElement("div", null, "\u52A0\u8F7D\u4E2D\uFF5E");
  }
};
function appDecorator(Stores, appConfig) {
  return function (Component) {
    var _App = function App(props) {
      var stores = props.stores;
      var storesArr = Object.values(stores);
      var onInit = /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
          var needClientRender;
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                // 暂时认为有任意一个store没有在服务端完成数据加载，则认为是服务端渲染失败，客户端全部重新请求
                // todo：理想情况应该是各个store互不干扰，其中一个失败在客户端可以独立重新加载，不影响其他组件
                needClientRender = storesArr.some(function (store) {
                  return !store.isServerRendered;
                });
                if (!needClientRender) {
                  _context.next = 6;
                  break;
                }
                _context.next = 4;
                return Promise.all(storesArr.map(function (store) {
                  return store.initClientData();
                }));
              case 4:
                _context.next = 7;
                break;
              case 6:
                storesArr.forEach(function (store) {
                  return store.prepareClientData();
                });
              case 7:
                storesArr.forEach(function (store) {
                  return store.finishInitLoading();
                });
              case 8:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function onInit() {
          return _ref.apply(this, arguments);
        };
      }();
      (0, _react.useEffect)(function () {
        onInit();
      }, []);
      return storesArr.every(function (store) {
        return store.isFinishInitLoading;
      }) ? /*#__PURE__*/_react.default.createElement(Component, props) : _App.appConfig.renderSpinner({});
    };
    _App.displayName = "appProvider(".concat(Component.displayName || Component.name, ")");
    _App.appConfig = _objectSpread(_objectSpread({}, DEFAULTS), appConfig);
    _App.createStores = function () {
      return Object.keys(Stores).reduce(function (result, key) {
        result[key] = new Stores[key]();
        return result;
      }, {});
    };
    return (0, _mobxReactLite.observer)(_App);
  };
}