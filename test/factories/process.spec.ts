import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';

import myProcess from 'factories/process';


describe('[Factory] MyProcess', () => {
  describe('getUptime()', () => {
    it('should return a string', () => {
      expect(myProcess.getUptime()).to.be.a('string');
    });

    it('should return a value noted as seconds', () => {
      expect(myProcess.getUptime()).to.include('seconds');
    });

    it('should return a string whose first value is a number', () => {
      const uptime = myProcess.getUptime();
      const [ time, label ] = uptime.split(' ');

      expect(Number(time)).to.be.a('number');
    });
  });
});