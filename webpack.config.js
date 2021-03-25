const path = require('path');

module.exports = env => {
    const isDev = env.NODE_ENV !== 'production';
    return {
        mode: isDev ? 'development' : 'production',
        stats: {
            modules: false,
        },
        devtool: isDev ? 'eval-cheap-source-map' : false,
        entry: {
            app: './resources/ts/app.tsx',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'public/js'),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-modules-typescript-loader' },
                        { loader: 'css-loader', options: { modules: true } },
                        { loader: 'sass-loader' },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        { loader: 'css-modules-typescript-loader' },
                        { loader: 'css-loader', options: { modules: false } },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: './../assets/',
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: {
                leaflet_css: __dirname + '/node_modules/leaflet/dist/leaflet.css',
                leaflet_marker: __dirname + '/node_modules/leaflet/dist/images/marker-icon.png',
                leaflet_marker_2x:
                    __dirname + '/node_modules/leaflet/dist/images/marker-icon-2x.png',
                leaflet_marker_shadow:
                    __dirname + '/node_modules/leaflet/dist/images/marker-shadow.png',
            },
        },
    };
};
