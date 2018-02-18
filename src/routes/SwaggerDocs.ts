import swaggerJSDoc = require('swagger-jsdoc');
import * as express from 'express';
import * as swaggerUI from 'swagger-ui-express';
import { getSrcRoot } from '../utils/path';

/** This must be directory relative to src */
const DIR = 'routes';

/**
 * TODO: Make host address configurable
 */
export default class SwaggerDocs {
  swaggerDoc() {
    const srcRoot = getSrcRoot(__dirname, DIR);

    // options for the swagger docs
    const options = {
      swaggerDefinition: {
        info: {
          title: 'Cache API',
          version: '1.0.0',
          description: 'Provides a cache api'
        },
        host: 'localhost:3000',
        basePath: '/'
      },
      // path to the API docs
      apis: [
        `./${srcRoot}${DIR}/*.ts`,
        `./${srcRoot}model/*.ts`,
        `./${srcRoot}${DIR}/*.js`,
        `./${srcRoot}model/*.js`
      ]
    };

    // initialize swagger-jsdoc
    const swaggerSpec = swaggerJSDoc(options);
    return swaggerSpec;
  }

  map(app: express.Express) {
    const getDocs = () => this.swaggerDoc();
    app.get('/swagger.json', function(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(getDocs(/* pass uri so the host can be resolved properly */));
    });

    app.use('/swagger', swaggerUI.serve, (req, res) => {
      const options = {
        explorer: true,
        swaggerUrl: `${req.protocol}://${req.get('host')}/swagger.json`
      };
      swaggerUI.setup(null, options)(req, res);
    });
  }
}
