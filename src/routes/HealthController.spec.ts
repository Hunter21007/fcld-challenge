import * as request from 'supertest';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { app as appPromise } from '../index';
import Environment from '../environment/Environment';

chai.use(chaiAsPromised);
chai.should();

let req: request.SuperTest<request.Test>;

describe('Health Controller', () => {
  before(() =>
    appPromise.then(app => {
      req = request.agent(app.listen(null));
    })
  );

  describe('Health Endpoint', () => {
    describe('GET /health', () => {
      it('Should return health info', done => {
        req.get('/health').expect(200, (err, res) => {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          (<Object>res.body.appInfo).should.not.be.null;
          (<Object>res.body.env).should.equal(Environment.getName());
          done();
        });
      });
    });
  });
});
