"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RootStore = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _mobx = require("mobx");
var _createContext = require("../client/createContext");
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
async function loadDataParallel(datasource, requestContext, store) {
  if (typeof datasource === 'function') {
    const data = await datasource(requestContext, store);
    (0, _mobx.runInAction)(() => Object.assign(store, data));
    return;
  }
  return Promise.all(Object.entries(datasource).map(async _ref => {
    let [key, config] = _ref;
    if (typeof config === 'function') {
      config = {
        dump: false,
        loader: config
      };
    }
    const loader = config.loader;
    const data = await Promise.resolve(loader(requestContext, store));
    (0, _mobx.runInAction)(() => {
      if (config.dump) {
        Object.assign(store, data);
      } else {
        store[key] = data;
      }
    });
  }));
}
function deepAssign(target, source) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      if (typeof value === 'object' && value) {
        target[key] = target[key] || (Array.isArray(value) ? [] : {});
        deepAssign(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }
}
class RootStore {
  constructor() {
    /**
     * 标识服务端渲染是否完成，没完成则会在client进行渲染加载
     */
    (0, _defineProperty2.default)(this, "isServerRendered", false);
    /**
     * 是否完成初始化
     */
    (0, _defineProperty2.default)(this, "isFinishInitLoading", false);
    /**
     * 从js对象中填充数据，主要用于同构渲染的数据回填
     * @override
     */
    (0, _defineProperty2.default)(this, "fromJS", rawData => {
      let data;
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
        deepAssign(this, data);
      }
    });
    (0, _mobx.makeObservable)(this, {
      isServerRendered: _mobx.observable,
      isFinishInitLoading: _mobx.observable,
      finishInitLoading: _mobx.action,
      finishServerRender: _mobx.action,
      initClientData: _mobx.action,
      initServerData: _mobx.action,
      initDataCallback: _mobx.action,
      prepareClientData: _mobx.action
    });
  }
  /**
   * 标记完成数据加载
   */
  finishInitLoading() {
    this.isFinishInitLoading = true;
  }

  /**
   * 标记完成服务端渲染
   */
  finishServerRender() {
    this.finishInitLoading();
    this.isServerRendered = true;
  }

  /**
   * 初始化请求器
   */
  initRequestor() {}

  /**
   * 初始化一些services，子类覆盖
   */
  initServices() {}

  /**
   * 初始化客户端数据
   */
  prepareClientData() {}

  /**
   * 异常封装方法，给错误信息包装成标准化的数据格式
   * 包含错误信息的 rejected promise
   */
  handleError(e) {
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
  initDataCallback(requestContext) {
    const datasource = this.getDatasource();
    return this.loadDatasource(datasource, requestContext);
  }

  /**
   * 初始化客户端数据
   */
  async initClientData() {
    try {
      await this.initDataCallback((0, _createContext.createClientContext)());
      this.prepareClientData();
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * 初始化服务端数据
   */
  async initServerData(requestContext) {
    try {
      await this.initDataCallback(requestContext);
      this.finishServerRender();
    } catch (err) {
      return this.handleError(err);
    }
  }

  /**
   * 序列化为json数据
   * @override
   */
  toJSON() {
    return (0, _mobx.toJS)(this);
  }
  /**
   * 加载数据源
   */
  async loadDatasource(datasource, requestContext) {
    // 数组则表示有依赖，需要串行加载
    if (Array.isArray(datasource)) {
      return datasource.reduce((result, config) => result.then(() => loadDataParallel(config, requestContext, this)), Promise.resolve());
    }
    return loadDataParallel(datasource, requestContext, this);
  }

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
  getDatasource() {
    return [];
  }
}
exports.RootStore = RootStore;