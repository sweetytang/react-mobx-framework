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
      const search = location.search ?? '';
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