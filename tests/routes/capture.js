var app = require('../../app');
var request = require('supertest');

describe('/capture', function(){
  it('responds with a 400 if url contains non-whitelisted parameters', function(done){
    request(app)
      .get('/capture?type=pdf&resource=asdfQWER;')
      .expect(400, done);
  });

  it('responds with a 403 if signature is missing', function(done){
    request(app)
      .get('/capture?type=pdf&resource=asdfQWER')
      .expect(403, done);
  });

  it('responds with a png when type param is png', function(done){
    request(app)
      .get('/capture?type=png&resource=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbQ==&signature=nDfnz9KXpL+lOsR3fL8Wrx5mFL5AecL+stdIWMJNaps=')
      .expect('Content-Type', 'image/png')
      .expect(200, done);
  });

  it('responds with a pdf when type param is pdf', function(done){
    request(app)
      .get('/capture?type=pdf&resource=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbQ==&signature=nDfnz9KXpL+lOsR3fL8Wrx5mFL5AecL+stdIWMJNaps=')
      .expect('Content-Type', 'application/pdf')
      .expect(200, done);
  });

  it('responds with a string when format param is string and type is png', function(done){
    request(app)
      .get('/capture?type=png&format=string&resource=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbQ==&signature=nDfnz9KXpL+lOsR3fL8Wrx5mFL5AecL+stdIWMJNaps=')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });
});
