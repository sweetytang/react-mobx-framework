import React from 'react';
import { observer } from 'mobx-react-lite';
import { RootStore } from '../store/RootStore';
import { IObj } from '../type/index';

const DEFAULTS = {
    redirectUrl: '/',
    requireLogin: true,
    fallbackCSR: false,
    renderSpinner: () => <div>加载中～</div>,
};

interface IAppConfig extends IObj {
    fallbackCSR?: boolean;
    requireLogin?: boolean;
    redirectUrl?: string;
    renderSpinner?: React.FC<any>;
}

interface IAppProps {
    stores: RootStore[];
}

export function appDecorator<T extends RootStore = RootStore>(RootStores: IObj<any>, appConfig: IAppConfig) {
    return (Component: any) => {
      class App extends React.Component<IAppProps> {
 
        static displayName = `appProvider(${Component.displayName || Component.name})`;
  
        static appConfig = {
          ...DEFAULTS,
          ...appConfig
        };
  
        static createStores() {
          return Object.keys(RootStores).reduce((result: IObj<T>, key) => {
            result[key] = new RootStores[key]();
            return result;
          }, {});
        }
  
        async componentDidMount() {
          // 暂时认为有任意一个store没有在服务端完成数据加载，则认为是服务端渲染失败，客户端全部重新请求
          // todo：理想情况应该是各个store互不干扰，其中一个失败在客户端可以独立重新加载，不影响其他组件
          const needClientRender = this.props.stores.some(store => !store.isServerRendered);
          if(needClientRender) {
            await Promise.all(this.props.stores.map(store => store.initClientData()));
          } else {
            this.props.stores.forEach(store => store.prepareClientData());
          }
  
          this.props.stores.forEach(store => store.finishInitLoading());
        }
  
        componentDidCatch(error: any, info: any) {
          if(process.env.NODE_ENV === 'development') {
            console.log('renderError:', error);
            console.log('renderInfo:', info);
            throw error;
          }

          error.message += '_' + JSON.stringify(info);
          // 生成环境下直接抛error会被吞react吞了，包装成异步异常丢出去
          setTimeout(() => {
            throw error;
          });
        }
  
        render() {
          return this.props.stores.every(store => store.isFinishInitLoading)
            ? <Component />
            : App.appConfig.renderSpinner({});
        }
      }
  
      return observer(App);
    };
  }