import request from 'supertest';

import app from 'classes/application';

describe('Application', () => {
  it('should start an express server without error', (done) => {
    request(app.express).get('/healthcheck').expect(200, done);
  })
});