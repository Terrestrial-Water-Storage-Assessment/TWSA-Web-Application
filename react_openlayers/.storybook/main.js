const path = require('path');

module.exports = {
    stories: ['../docs/**/*.stories.[tj]s'],
    addons: [
        '@storybook/addon-notes/register'
    ],
    webpackFinal: async (config, {configType}) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Make whatever fine-grained changes you need
        config.module.rules.push({
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'less-loader',
                    options: {
                        //modifyVars: CustomAntThemeModifyVars(),
                        javascriptEnabled: true // Less version > 3.0.0
                    }
                }],
            include: path.resolve(__dirname, '../'),
        });

        // Return the altered config
        return config;
    },
};