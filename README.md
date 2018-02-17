# fcld-challenge

Code Challenge for Fashion Cloud

## Development

use npm scripts to work with code:

* npm start: runs the code with ts-node
* npm run test: performs tests
* npm run cover: produces coverage reports
* npm run build: produces production build placed into `build` folder

* run `docker build -t app-name .` to produce docker image, after `npm run build`

## Configuration

configuration is done via https://github.com/lorenwest/node-config

* see `src/config/index` for schema details
* use `src/config/default.json` to provide default config
* create `src/config/production.json` to provide production config
