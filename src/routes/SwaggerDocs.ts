import swaggerJSDoc = require('swagger-jsdoc');
import * as express from 'express';
import * as swaggerUI from 'swagger-ui-express';

const DIR = 'routes';

/**
 * TODO: Make host address configurable
 */
export default class SwaggerDocs {
  swaggerDoc() {
    const cwd = process.cwd();
    const srcRoot = __dirname
      .replace(cwd, '')
      .replace(DIR, '')
      .replace(/\//, '');

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
      apis: [`./${srcRoot}${DIR}/*.ts`, `./${srcRoot}../model/*.ts`]
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

    const options = {
      explorer: true,
      swaggerUrl: 'http://localhost:3000/swagger.json'
    };
    app.use('/swagger', swaggerUI.serve, swaggerUI.setup(null, options));
  }
}
