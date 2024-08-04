const { RootStore } = require('./dist/RootStore');
const { BaseStore } = require('./dist/BaseStore');
const { appDecrator } = require('./dist/appDecorator');

module.exports = {
    BaseRootStore: RootStore,
    BaseStore,
    appDecrator
};