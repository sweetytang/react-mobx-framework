const { RootStore } = require('./dist/RootStore');
const { BaseStore } = require('./dist/BaseStore');
const { appDecorator } = require('./dist/appDecorator');

module.exports = {
    BaseRootStore: RootStore,
    BaseStore,
    appDecorator
};