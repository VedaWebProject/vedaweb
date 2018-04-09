const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

const path = require('path');
const fs  = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './ant-custom-vars.less'), 'utf8'));

module.exports = function override(config, env) {
    //themeVariables["@icon-url"] = "'/fonts/iconfont'";
    config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], config);
    config = rewireLess.withLoaderOptions({
        modifyVars: themeVariables
    })(config, env);

    return config;
};