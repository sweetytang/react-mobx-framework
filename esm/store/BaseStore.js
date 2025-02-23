import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { makeObservable, computed } from "mobx";
export var BaseStore = /*#__PURE__*/function () {
  function BaseStore(root) {
    _classCallCheck(this, BaseStore);
    _defineProperty(this, "rootStore", void 0);
    this.rootStore = root;
    makeObservable(this, {
      root: computed
    });
  }
  return _createClass(BaseStore, [{
    key: "root",
    get: function get() {
      return this.rootStore;
    }
  }]);
}();