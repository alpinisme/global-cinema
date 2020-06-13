const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/app.tsx', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/landing.scss', 'public/css')
    .sass('resources/sass/styles.scss', 'public/css')
    .webpackConfig({
        module: {
            rules: [
                // {
                //     test: /\.css$/,
                //     include: /\/js\//,
                //     use: [
                //         { loader: 'style-loader' },

                //         { loader: 'css-modules-typescript-loader' },
                //         { loader: 'css-loader', options: { modules: true } }
                //     ]
                // },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
    });
