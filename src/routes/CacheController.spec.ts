import * as request from 'supertest';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { app as appPromise } from '../index';
import Environment from '../environment/Environment';

chai.use(chaiAsPromised);
chai.should();

let req: request.SuperTest<request.Test>;

describe('Cache Controller', () => {
  before(() =>
    appPromise.then(app => {
      req = request.agent(app.listen(null));
    })
  );

  describe('/cache Endpoint', () => {
    describe.skip('GET /cache', () => {
      it('Should return all stored keys and data cache', done => {
        done();
      });
    });

    describe.skip('GET /cache/keys', () => {
      it('Should return all stored keys from cache', done => {
        done();
      });
    });

    describe.skip('GET /cache/{key}', () => {
      it('Should return random key on cache miss', done => {
        req.get('/health').expect(200, (err, res) => {
          done();
        });
      });

      it('Should return random key if ttl expired', done => {
        done();
      });

      it('Should return existing key on cache hit', done => {
        done();
      });
    });

    describe.skip('POST /cache/{key}', () => {
      it('Should create new data with given key and return it back', done => {
        done();
      });
      it('Should replace the oldest object if cache limit exeeded', done => {
        done();
      });
    });

    describe.skip('PUT /cache/{key}', () => {
      it('Should update data with given key and return it back', done => {
        done();
      });
      it('Should return an error if key was not found in the cache', done => {
        done();
      });
    });

    describe.skip('DELETE /cache/{key}', () => {
      it('Should remove the data with given key from cache', done => {
        done();
      });
      it('Should silently ignore if the key is not present in the cache', done => {
        done();
      });
    });

    describe.skip('DELETE /cache', () => {
      it('Should remove all data from cache', done => {
        done();
      });
      it('Should silently ignore cache is empty', done => {
        done();
      });
    });
  });
});
