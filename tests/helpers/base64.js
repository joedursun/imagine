var should = require('chai').should();
var subject = require('../../helpers/base64').base64;

describe('Base64', function(){
  describe('#decode', function(){
    var encodedString = 'aHR0cDovL3JlZGRpdC5jb20vP2Zvbz1iYXI='

    it('returns the base64 decoded string', function(){
      subject.decode(encodedString).should.equal('http://reddit.com/?foo=bar');
    });
  });
});
