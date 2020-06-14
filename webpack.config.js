const path = require('path');

module.exports = env => {
    const isDev = env.NODE_ENV !== 'production';
    console.log('isDev? ', isDev);
    return {
        mode: isDev ? 'development' : 'production',
        entry: { app: './resources/js/app.tsx' },
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
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    };
};
