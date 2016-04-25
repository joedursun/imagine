var app = require('../../app');
var request = require('supertest');

describe('/capture', function(){
  it('responds with a 400 if url contains non-whitelisted parameters', function(done){
    request(app).get('/capture?type=pdf&resource=asdfQWER;').expect(400, done);
  });

  it('responds with a 403 if signature is missing', function(done){
    request(app).get('/capture?type=pdf&resource=asdfQWER').expect(403, done);
  });
});
