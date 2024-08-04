const path = require('path');

const rootPath = path.resolve(__dirname, '../..');

const resolvePath = (route) => {
    return path.join(rootPath, route);
}

module.exports = {
    resolvePath
}
