import "core-js/modules/es.array.slice.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.search.js";
import "core-js/modules/es.string.starts-with.js";
import qs from 'qs';
import cookie from 'cookie';
import UAParser from 'ua-parser-js';

/**
 * 创建浏览器端信息上下文
 *
 * @ignore
 * @return {ClientContext} context
 */
export function createClientContext() {
  return {
    get pathname() {
      return location.pathname;
    },
    get query() {
      var _location$search;
      var search = (_location$search = location.search) !== null && _location$search !== void 0 ? _location$search : '';
      return qs.parse(search.startsWith('?') ? search.slice(1) : search);
    },
    get userAgent() {
      return navigator.userAgent;
    },
    get hostname() {
      return location.hostname;
    },
    get cookies() {
      return cookie.parse(document.cookie);
    },
    get platform() {
      return new UAParser(navigator.userAgent).getResult();
    }
  };
}