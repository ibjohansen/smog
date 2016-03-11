#!/bin/bash
npm run clean
mkdir public
cp -R ./dist ./public/dist
cp ./index.html ./public/index.html
gzip -fq9 ./public/dist/app.css
gzip -fq9 ./public/dist/favicon.ico
gzip -fq9c ./public/index.html > ./public/index.html.gz

NODE_ENV=production ./node_modules/.bin/webpack -p --config webpack.config.prod.js
rm ./public/dist/bundle.js
echo Done
