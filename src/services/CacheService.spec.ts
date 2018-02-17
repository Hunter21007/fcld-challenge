import * as request from 'supertest';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { app as appPromise } from '../index';
import Environment from '../environment/Environment';
import CacheService from './CacheService';
import { CacheEntry } from '../data';
import { now } from '../utils/date';

chai.use(chaiAsPromised);
chai.should();

describe('CacheService', () => {
  const service = new CacheService();

  describe('ensureCollection', () => {
    it('Should create the colection and ensure required indexes', async () => {
      const col = await service.ensureCollection();
      col.should.not.be.null;
      col.collectionName.should.equal(CacheEntry.name);
    });
  });

  describe('create', () => {
    it('Should create cache data', async () => {
      const res = await service.create({ key: 'key1', data: 'hello-world' });
      res.should.not.be.null;
      res.ttl.should.be.greaterThan(now());
    });

    it('Should owerwrite cache data and update ttl', async () => {
      const res = await service.create({ key: 'key1', data: 'hello-world' });
      res.should.not.be.null;
      res.ttl.should.be.greaterThan(now());
    });
  });
});
