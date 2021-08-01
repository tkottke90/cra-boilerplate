import { expect } from 'chai';

import environment from 'factories/environment';
import myLogger from 'factories/logger';

describe('[Factory] MyLogger', () => {

  it('should register the "LOG_LEVEL" environment variable', () => {
    expect(!!environment.get('LOG_LEVEL')).to.be.true;
  });


});