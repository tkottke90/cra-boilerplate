import { expect } from 'chai';
import sinon from 'sinon';

import environment from 'factories/environment';

describe('[Factory] Environment', () => {
  
  describe('addEnvironmentVariable()', () => {
    before(() => {
      process.env.TEST_PORT = '4000';
      process.env.TEST_HOST = 'localhost';
      process.env.TEST_SALT = '10';
      process.env.TEST_BOOL = 'true';
      process.env.TEST_OBJ = "{\"config\":\"value\"}"
    });

    it('should accept a EnvironmentVariable config with just an "environmentName"', () => {
      const port = environment.addEnvironmentVariable({ environmentName: 'TEST_PORT' });

      expect(port).to.eq('4000');
    });

    it('should accept a EnvironmentVariable config with an "environmentName" and "defaultValue"', () => {
      const defaultValue = '/sockets'
      const socket = environment.addEnvironmentVariable({ environmentName: 'SOCKET', defaultValue });

      expect(socket).to.eq(defaultValue);
    });

    it('should accept a EnvironmentVariable config with an "environmentName", "defaultValue", and "live" properties', () => {
      const port = environment.addEnvironmentVariable({ environmentName: 'PORT', defaultValue: '5000', live: true });

      expect(port).to.eq('5000');
    });

    it('should store the environment variable name as the value when none is found AND no default is provided', () => {
      const environmentName = 'SOCKET_PORT';
      const socketPort = environment.addEnvironmentVariable({ environmentName });

      expect(socketPort).to.eq(environmentName)
    });

    it('should return a string when no \'type\' is provided', () => {
      const host = environment.addEnvironmentVariable({ environmentName: 'TEST_HOST' });

      expect(host).to.be.a('string');
      expect(host).not.to.be.a('number');
      expect(host).not.to.be.a('boolean');
      expect(host).not.to.be.a('object');
    });

    it('should return a string when \'type\' is string', () => {
      const host = environment.addEnvironmentVariable({ environmentName: 'TEST_HOST' });

      expect(host).to.be.a('string');
    });

    it('should return a number when \'type\' is number', () => {
      const salt = environment.addEnvironmentVariable({ environmentName: 'TEST_SALT', type: 'number' });

      expect(salt).to.be.a('number');
    });

    it('should return a boolean when \'type\' is boolean', () => {
      const bool = environment.addEnvironmentVariable({ environmentName: 'TEST_BOOL', type: 'boolean' });

      expect(bool).to.be.a('boolean');
    });

    it('should return a json when \'type\' is json', () => {
      const obj = environment.addEnvironmentVariable({ environmentName: 'TEST_OBJ', type: 'json' });

      expect(obj).to.be.an('object');
    });

    after(() => {
      delete process.env.TEST_PORT;
      delete process.env.TEST_HOST;
      delete process.env.TEST_SALT;
      delete process.env.TEST_BOOL;
      delete process.env.TEST_OBJ;
    })
  });

  describe('get()', () => {
    // Tests a validly configured env variable
    it('should return environment value of "4000" when passed "TEST_PORT"', () => {
      const port = environment.get('TEST_PORT');

      expect(port).to.eq('4000');
    })

    // Tests a default configured env variable
    it('should return default value of "/sockets" when passed "SOCKET"', () => {
      const port = environment.get('/sockets');
      
      expect(port).to.eq('');
    })

    // Tests a missing env variable
    it('should return variable name of "SOCKET_PORT" when passed "SOCKET_PORT"', () => {
      const port = environment.get('SOCKET_PORT');
      
      expect(port).to.eq('SOCKET_PORT');
    })

  });

});