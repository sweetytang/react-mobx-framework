const { RootStore } = require('./lib/store/RootStore');
const { BaseStore } = require('./lib/store/BaseStore');
const { appDecorator } = require('./lib/component/appDecorator');

module.exports = {
    BaseRootStore: RootStore,
    BaseStore,
    appDecorator
};