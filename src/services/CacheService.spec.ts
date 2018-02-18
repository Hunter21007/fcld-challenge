import * as request from 'supertest';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { app as appPromise } from '../index';
import Environment from '../environment/Environment';
import CacheService from './CacheService';
import { CacheEntry } from '../model';
import { now } from '../utils/date';
import { random } from '../utils/random';

chai.use(chaiAsPromised);
chai.should();

export async function seed() {
  const service = new CacheService();
  for (let i = 0; i < 20; i++) {
    await service.save({
      key: `key${i}`,
      data: random()
    });
  }
}

describe('CacheService', () => {
  const service = new CacheService();

  describe('ensureCollection', () => {
    it('Should create the colection and ensure required indexes', async () => {
      const col = await service.ensureCollection();
      col.should.not.be.null;
      col.collectionName.should.equal(CacheEntry.name);
    });
  });

  describe('save', () => {
    it('Should create cache data', async () => {
      const res = await service.save({ key: 'key1', data: 'hello-world' });
      res.should.not.be.null;
      res.ttl.should.be.greaterThan(now());
    });

    it('Should owerwrite cache data and update ttl', async () => {
      const res = await service.save({ key: 'key1', data: 'hello-world' });
      res.should.not.be.null;
      res.ttl.should.be.greaterThan(now());
    });
  });

  describe('get', () => {
    it('Should return the object by key', async () => {
      await service.save({ key: 'key1', data: 'hello-world' });
      const res = await service.get('key1');

      res.should.not.be.null;
      res.key.should.equal('key1');
      res.ttl.should.be.greaterThan(now());
    });
  });

  describe('delAll', () => {
    before(async () => {
      await seed();
    });

    it('Should wipe all chache data from datastore', async () => {
      let test = await service.getAll();
      test.length.should.be.greaterThan(10);
      await service.delAll();
      test = await service.getAll();
      test.length.should.equal(0);
    });
  });
});
