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
    });

    it('Should throw error if ttl not expired', async () => {
      const act = async () =>
        await service.create({ key: 'key1', data: 'hello-world' });
      act.should.throw;
    });

    it('Should owerwrite cache data if ttl expired', async () => {
      await service.create({
        key: 'key2',
        data: 'hello-world',
        ttl: now() - 1000
      });
      const res = await service.create({ key: 'key2', data: 'hello-world' });
      res.should.not.be.null;
    });
  });
});
