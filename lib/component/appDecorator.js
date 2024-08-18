"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appDecorator = appDecorator;
var _react = _interopRequireWildcard(require("react"));
var _mobxReactLite = require("mobx-react-lite");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DEFAULTS = {
  redirectUrl: '/',
  requireLogin: true,
  fallbackCSR: false,
  renderSpinner: () => /*#__PURE__*/_react.default.createElement("div", null, "\u52A0\u8F7D\u4E2D\uFF5E")
};
function appDecorator(Stores, appConfig) {
  return Component => {
    const App = props => {
      const {
        stores
      } = props;
      const storesArr = Object.values(stores);
      const onInit = async () => {
        // 暂时认为有任意一个store没有在服务端完成数据加载，则认为是服务端渲染失败，客户端全部重新请求
        // todo：理想情况应该是各个store互不干扰，其中一个失败在客户端可以独立重新加载，不影响其他组件
        const needClientRender = storesArr.some(store => !store.isServerRendered);
        if (needClientRender) {
          await Promise.all(storesArr.map(store => store.initClientData()));
        } else {
          storesArr.forEach(store => store.prepareClientData());
        }
        storesArr.forEach(store => store.finishInitLoading());
      };
      (0, _react.useEffect)(() => {
        onInit();
      }, []);
      return storesArr.every(store => store.isFinishInitLoading) ? /*#__PURE__*/_react.default.createElement(Component, props) : App.appConfig.renderSpinner({});
    };
    App.displayName = `appProvider(${Component.displayName || Component.name})`;
    App.appConfig = {
      ...DEFAULTS,
      ...appConfig
    };
    App.createStores = () => {
      return Object.keys(Stores).reduce((result, key) => {
        result[key] = new Stores[key]();
        return result;
      }, {});
    };
    return (0, _mobxReactLite.observer)(App);
  };
}