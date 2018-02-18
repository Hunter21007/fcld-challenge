import * as request from 'supertest';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { app as appPromise } from '../index';
import Environment from '../environment/Environment';
import CacheService from '../services/CacheService';
import { SERVICE } from '../config/index';
import { random } from '../utils/random';
import { CacheEntry } from '../model';
import { seed } from '../services/CacheService.spec';
import { now } from '../utils/date';

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

      it('Should return random key if ttl expired', done => {
        service
          .save({
            key: 'exp1',
            data: 'expired one',
            ttl: now() - 100 // this will be exipred one
          })
          .then(orig => {
            req.get('/cache/exp1').expect(200, (err, res) => {
              (<Object>res.body).should.haveOwnProperty('data');
              const data = <CacheEntry>res.body.data;
              data.key.should.equal('exp1');
              data.data.length.should.equal(128);
              done();
            });
          });
      });

      it('Should return existing key on cache hit', done => {
        service
          .save({
            key: 'ext1',
            data: 'safe-hit'
          })
          .then(orig => {
            req.get('/cache/ext1').expect(200, (err, res) => {
              (<Object>res.body).should.haveOwnProperty('data');
              const data = <CacheEntry>res.body.data;
              data.key.should.equal('ext1');
              data.data.should.equal('safe-hit');
              done();
            });
          });
      });

      it('Should return update ttl on cache hit', done => {
        service
          .save({
            key: 'ext1',
            data: 'safe-hit'
          })
          .then(orig => {
            req.get('/cache/ext1').expect(200, (err, res) => {
              (<Object>res.body).should.haveOwnProperty('data');
              const data = <CacheEntry>res.body.data;
              data.key.should.equal('ext1');
              data.data.should.equal('safe-hit');
              data.ttl.should.be.greaterThan(orig.ttl);
              done();
            });
          });
      });
    });

    describe('POST /cache', () => {
      before(async () => {
        await service.delAll();
      });

      it('Should create new data with given key and return it back', done => {
        req
          .post('/cache')
          .send({
            key: 'crt1',
            data: 'crt-data1'
          })
          .expect(200, (err, res) => {
            (<Object>res.body).should.haveOwnProperty('data');
            const data = <CacheEntry>res.body.data;
            data.key.should.equal('crt1');
            data.data.should.equal('crt-data1');
            data.ttl.should.be.greaterThan(now());
            done();
          });
      });

      it.skip('Should replace the oldest object if cache limit exeeded', done => {
        done();
      });
    });

    describe('PUT /cache/:key}', () => {
      it('Should update data with given key and return it back', done => {
        service
          .save({
            key: 'put1',
            data: 'put-data'
          })
          .then(orig => {
            req
              .put('/cache/put1')
              .send({
                data: 'put-data1'
              })
              .expect(200, (err, res) => {
                (<Object>res.body).should.haveOwnProperty('data');
                const data = <CacheEntry>res.body.data;
                data.key.should.equal('put1');
                data.data.should.equal('put-data1');
                data.ttl.should.be.greaterThan(now());
                done();
              });
          });
      });
      it('Should return an error if key was not found in the cache', done => {
        req
          .put('/cache/putnone123')
          .send({
            data: 'put-putnone123'
          })
          .expect(200, (err, res) => {
            (<Object>res.body).should.haveOwnProperty('error');
            const error = res.body.error;
            error.message.should.equal(
              'Entry with key putnone123 was not found in datastore'
            );
            done();
          });
      });
    });

    describe('DELETE /cache/:key', () => {
      it('Should remove the data with given key from cache', done => {
        service
          .save({
            key: 'del1',
            data: 'del-data'
          })
          .then(orig => {
            req.delete('/cache/del1').expect(200, (err, res) => {
              (<Object>res.body).should.haveOwnProperty('data');
              const data = <number>res.body.data;
              data.should.equal(1);
              done();
            });
          });
      });
      it('Should silently ignore if the key is not present in the cache', done => {
        req.delete('/cache/del4').expect(200, (err, res) => {
          (<Object>res.body).should.haveOwnProperty('data');
          const data = <number>res.body.data;
          data.should.equal(0);
          done();
        });
      });
    });

    describe('DELETE /cache', () => {
      before(async () => {
        await seed();
      });

      it('Should remove all data from cache', done => {
        req.delete('/cache').expect(200, (err, res) => {
          (<Object>res.body).should.haveOwnProperty('data');
          const data = <number>res.body.data;
          data.should.be.greaterThan(19);
          done();
        });
      });

      it('Should silently ignore cache is empty', done => {
        req.delete('/cache').expect(200, (err, res) => {
          (<Object>res.body).should.haveOwnProperty('data');
          const data = <number>res.body.data;
          data.should.equal(0);
          done();
        });
      });
    });
  });
});
