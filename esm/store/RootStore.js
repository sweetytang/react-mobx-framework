import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _typeof from "@babel/runtime/helpers/typeof";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/es.array.map.js";
import "core-js/modules/es.array.reduce.js";
import "core-js/modules/es.object.assign.js";
import "core-js/modules/es.object.entries.js";
import "core-js/modules/es.object.keys.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.string.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";
import { toJS, runInAction, makeObservable, observable, action } from 'mobx';
import { createClientContext } from '../client/createContext';

/**
 * 同构化视图数据模型
 *
 * ssr 生命周期：
 *
 *   server:
 *     constructor -> initServerData -> initDataCallback -> initServices ->
 *     getDatasource -> loadDatasource -> finishServerRender -> finishInitLoading -> toJSON
 *
 *   client:
 *     constructor -> fromJS -> initServices -> prepareClientData -> finishInitLoading
 *
 * csr 生命周期：
 *   constructor -> initClientData -> initDataCallback -> initServices ->
 *   getDatasource -> loadDatasource -> prepareClientData -> finishInitLoading
 *
 */

/**
 * 并行加载数据
 */
function loadDataParallel(_x, _x2, _x3) {
  return _loadDataParallel.apply(this, arguments);
}
function _loadDataParallel() {
  _loadDataParallel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee5(datasource, requestContext, store) {
    var data;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (!(typeof datasource === 'function')) {
            _context5.next = 6;
            break;
          }
          _context5.next = 3;
          return datasource(requestContext, store);
        case 3:
          data = _context5.sent;
          runInAction(function () {
            return Object.assign(store, data);
          });
          return _context5.abrupt("return");
        case 6:
          return _context5.abrupt("return", Promise.all(Object.entries(datasource).map(/*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee4(_ref) {
              var _ref3, key, config, loader, data;
              return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _ref3 = _slicedToArray(_ref, 2), key = _ref3[0], config = _ref3[1];
                    if (typeof config === 'function') {
                      config = {
                        dump: false,
                        loader: config
                      };
                    }
                    loader = config.loader;
                    _context4.next = 5;
                    return Promise.resolve(loader(requestContext, store));
                  case 5:
                    data = _context4.sent;
                    runInAction(function () {
                      if (config.dump) {
                        Object.assign(store, data);
                      } else {
                        store[key] = data;
                      }
                    });
                  case 7:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            return function (_x7) {
              return _ref2.apply(this, arguments);
            };
          }())));
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _loadDataParallel.apply(this, arguments);
}
function deepAssign(target, source) {
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      var value = source[key];
      if (_typeof(value) === 'object' && value) {
        target[key] = target[key] || (Array.isArray(value) ? [] : {});
        deepAssign(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }
}
export var RootStore = /*#__PURE__*/function () {
  function RootStore() {
    var _this = this;
    _classCallCheck(this, RootStore);
    /**
     * 标识服务端渲染是否完成，没完成则会在client进行渲染加载
     */
    _defineProperty(this, "isServerRendered", false);
    /**
     * 是否完成初始化
     */
    _defineProperty(this, "isFinishInitLoading", false);
    /**
     * 从js对象中填充数据，主要用于同构渲染的数据回填
     * @override
     */
    _defineProperty(this, "fromJS", function (rawData) {
      var data;
      try {
        if (rawData) {
          data = JSON.parse(rawData);
        } else {
          data = rawData;
        }
      } catch (e) {
        data = null;
        throw new Error('模板解析失败，请尽快解决');
      }
      if (data) {
        deepAssign(_this, data);
      }
    });
    makeObservable(this, {
      isServerRendered: observable,
      isFinishInitLoading: observable,
      finishInitLoading: action,
      finishServerRender: action,
      initClientData: action,
      initServerData: action,
      initDataCallback: action,
      prepareClientData: action
    });
  }
  return _createClass(RootStore, [{
    key: "finishInitLoading",
    value:
    /**
     * 标记完成数据加载
     */
    function finishInitLoading() {
      this.isFinishInitLoading = true;
    }

    /**
     * 标记完成服务端渲染
     */
  }, {
    key: "finishServerRender",
    value: function finishServerRender() {
      this.finishInitLoading();
      this.isServerRendered = true;
    }

    /**
     * 初始化请求器
     */
  }, {
    key: "initRequestor",
    value: function initRequestor() {}

    /**
     * 初始化一些services，子类覆盖
     */
  }, {
    key: "initServices",
    value: function initServices() {}

    /**
     * 初始化客户端数据
     */
  }, {
    key: "prepareClientData",
    value: function prepareClientData() {}

    /**
     * 异常封装方法，给错误信息包装成标准化的数据格式
     * 包含错误信息的 rejected promise
     */
  }, {
    key: "handleError",
    value: function handleError(e) {
      // todo: 临时性的兼容，防止dealError被调用两次
      if (e.handled) {
        console.warn('该异常已经被dealError处理过了');
        return Promise.reject(e);
      }
      e.errorCode = e.errorCode || 'unknown';
      e.handled = true;
      return Promise.reject(e);
    }

    /**
     * 数据初始化
     */
  }, {
    key: "initDataCallback",
    value: function initDataCallback(requestContext) {
      var datasource = this.getDatasource();
      return this.loadDatasource(datasource, requestContext);
    }

    /**
     * 初始化客户端数据
     */
  }, {
    key: "initClientData",
    value: (function () {
      var _initClientData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return this.initDataCallback(createClientContext());
            case 3:
              this.prepareClientData();
              _context.next = 9;
              break;
            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", this.handleError(_context.t0));
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 6]]);
      }));
      function initClientData() {
        return _initClientData.apply(this, arguments);
      }
      return initClientData;
    }()
    /**
     * 初始化服务端数据
     */
    )
  }, {
    key: "initServerData",
    value: (function () {
      var _initServerData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee2(requestContext) {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return this.initDataCallback(requestContext);
            case 3:
              this.finishServerRender();
              _context2.next = 9;
              break;
            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", this.handleError(_context2.t0));
            case 9:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 6]]);
      }));
      function initServerData(_x4) {
        return _initServerData.apply(this, arguments);
      }
      return initServerData;
    }()
    /**
     * 序列化为json数据
     * @override
     */
    )
  }, {
    key: "toJSON",
    value: function toJSON() {
      return toJS(this);
    }
  }, {
    key: "loadDatasource",
    value: (
    /**
     * 加载数据源
     */
    function () {
      var _loadDatasource = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime.mark(function _callee3(datasource, requestContext) {
        var _this2 = this;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!Array.isArray(datasource)) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return", datasource.reduce(function (result, config) {
                return result.then(function () {
                  return loadDataParallel(config, requestContext, _this2);
                });
              }, Promise.resolve()));
            case 2:
              return _context3.abrupt("return", loadDataParallel(datasource, requestContext, this));
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function loadDatasource(_x5, _x6) {
        return _loadDatasource.apply(this, arguments);
      }
      return loadDatasource;
    }()
    /**
     * 返回配置化的数据源, 有三种配置方式：
     *
     * 1. 配置为数据请求函数，该函数返回一个对象，RootStore会将返回对象展开赋值至自身，请求函数会注入以下两个参数：
     *       - requestContext: 请求上下文，
     *       - store: 当前的 store 实例
     *
     * ```
     *  // 以下会配置最终会导致 store.key1 = value1，store.key2 = value2
     *   async function loader(requestContext, store) {
     *        return {
     *            key1: value1,
     *            key2: value2
     *        };
     *   }
     * ```
     * 2. 配置项为多个键值对构成的数据源配置，会并行的执行每个数据源配置请求函数，将最终的返回值按照配置赋值到store上：
     *     2.1 值为函数时，类似配置1，但会将键对应的store属性值设置为返回值
     *     2.2 值为对象配置项时，可以设置loader和dump，loader与配置1保持一致，dump为bool类型，
     *     标识是否将loader的返回值展开到store上，为true展开，否则将键对应的store属性值设置为返回值
     *
     * ```
     * {
     *    key1(requestContext, store) {}, // 类似配置1，但会设置 store.key1 = 该函数返回值
     *    key2(requestContext, store) {}, // 类似配置1，但会设置 store.key2 = 该函数返回值
     *    key3: {
     *        loader(requestContext, store) {},
     *        dump: true // 会将loader的返回值展开至store
     *    }
     * }
     * ```
     *
     * 3. 配置项为数据源配置数组，会串行的执行每个数据源配置的请求函数，每个配置项的效果参考1和2
     *
     * ```
     * [
     *    async function loader(requestContext, store) {}, // 先执行该函数，再并行执行第二个配置项的各个请求函数
     *    {
     *        key1(requestContext, store) {}, // 类似配置1，但会设置 store.key1 = 该函数返回值
     *        key2(requestContext, store) {}, // 类似配置1，但会设置 store.key2 = 该函数返回值
     *        key3: {
     *            loader(requestContext, store) {},
     *            dump: true 会将loader的返回值展开至store
     *       }
     *    }
     * ]
     * ```
     *
     * @return {{} | Array<{}>}
     * @override
     */
    )
  }, {
    key: "getDatasource",
    value: function getDatasource() {
      return [];
    }
  }]);
}();