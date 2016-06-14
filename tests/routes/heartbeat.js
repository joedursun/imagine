var app = require('../../app');
var request = require('supertest');

describe('/heartbeat', function(){
  it('returns "ok!" with a 200 status code', function(done){
    request(app).get('/heartbeat').expect(200, 'ok!', done());
  });
});
