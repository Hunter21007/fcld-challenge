import * as request from 'supertest';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { random } from './random';

chai.use(chaiAsPromised);
chai.should();

describe('utils', () => {
  describe('random', () => {
    it('should return random string', () => {
      const res = random();
      res.length.should.equal(128);
    });
  });
});
