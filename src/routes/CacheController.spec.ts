import * as request from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { app as appPromise } from '../index';
import Environment from '../environment/Environment';
import CacheService from '../services/CacheService';
import { SERVICE } from '../config/index';
import { random } from '../utils/random';
import { CacheEntry } from '../data';
import { seed } from '../services/CacheService.spec';

chai.use(chaiAsPromised);
chai.should();

let req: request.SuperTest<request.Test>;
const service = new CacheService();

describe('Cache Controller', () => {
  before(() =>
    appPromise.then(app => {
      req = request.agent(app.listen(null));
    })
  );

  describe('/cache Endpoint', () => {
    describe('GET /cache', () => {
      before(async () => {
        await seed();
      });

      it('Should return all stored keys and data cache', done => {
        req.get('/cache').expect(200, (err, res) => {
          (<Object>res.body).should.haveOwnProperty('data');
          const data = <CacheEntry[]>res.body.data;
          data.length.should.be.greaterThan(19); // we have created 20 objects on the top
          done();
        });
      });
    });

    describe('GET /cache/keys', () => {
      it('Should return all stored keys from cache', done => {
        req.get('/cache/keys').expect(200, (err, res) => {
          (<Object>res.body).should.haveOwnProperty('data');
          const data = <string[]>res.body.data;
          data.length.should.be.greaterThan(19); // we have created 20 objects on the top
          data.find(d => d == 'key15').should.not.be.null;
          done();
        });
      });
    });

    describe('GET /cache/:key', () => {
      before(async () => {
        await service.delAll();
      });

      it('Should return random key on cache miss', done => {
        req.get('/cache/key1').expect(200, (err, res) => {
          (<Object>res.body).should.haveOwnProperty('data');
          const data = <CacheEntry>res.body.data;
          data.key.should.equal('key1');
          data.data.length.should.equal(128);
          done();
        });
      });

      it.skip('Should return random key if ttl expired', done => {
        done();
      });

      it.skip('Should return existing key on cache hit', done => {
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
