const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
            '@primary-color': '#931111',
            '@font-size-base': '16px',
            '@font-size-sm' : '14px',
            '@animation-duration-slow': '0.2s',
            '@border-radius-base': '3px',
            '@border-radius-sm': '2px',
            '@font-family' : 'Assistant, sans-serif',
            '@font-family-no-number': 'Assistant, sans-serif',
            '@border-color-base': '#b4b1ae',
            '@table-row-hover-bg': 'none'
        },
    }),
  );

