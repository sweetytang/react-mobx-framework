import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "core-js/modules/es.symbol.js";
import "core-js/modules/es.array.filter.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.array.map.js";
import "core-js/modules/es.array.reduce.js";
import "core-js/modules/es.function.name.js";
import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.object.define-properties.js";
import "core-js/modules/es.object.define-property.js";
import "core-js/modules/es.object.get-own-property-descriptor.js";
import "core-js/modules/es.object.get-own-property-descriptors.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.object.values.js";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.for-each.js";
import "core-js/modules/web.dom-collections.iterator.js";
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
var DEFAULTS = {
  redirectUrl: '/',
  requireLogin: true,
  fallbackCSR: false,
  renderSpinner: function renderSpinner() {
    return /*#__PURE__*/React.createElement("div", null, "\u52A0\u8F7D\u4E2D\uFF5E");
  }
};
export function appDecorator(Stores, appConfig) {
  return function (Component) {
    var _App = function App(props) {
      var stores = props.stores;
      var storesArr = Object.values(stores);
      var onInit = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
          var needClientRender;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
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
      useEffect(function () {
        onInit();
      }, []);
      return storesArr.every(function (store) {
        return store.isFinishInitLoading;
      }) ? /*#__PURE__*/React.createElement(Component, props) : _App.appConfig.renderSpinner({});
    };
    _App.displayName = "appProvider(".concat(Component.displayName || Component.name, ")");
    _App.appConfig = _objectSpread(_objectSpread({}, DEFAULTS), appConfig);
    _App.createStores = function () {
      return Object.keys(Stores).reduce(function (result, key) {
        result[key] = new Stores[key]();
        return result;
      }, {});
    };
    return observer(_App);
  };
}