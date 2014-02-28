var should = require('should')
    , request = require('request')
    , fs = require('fs')
    , spawn = require('child_process').spawn

var local = 'localhost:1234';

var s3 = require('../index');
var signer = null; 

describe('amazon-s3-url-signer', function(){
  var fakes = null;

  before(function(done){
    signer = s3.urlSigner(123, 'abc', {
      host: 'localhost',
      port: 1234,
      protocol: 'http'
    });

    //start fake s3
    fakes = spawn('fakes3', '-r test/s3_files -p 1234'.split(' '))
    
    fakes.stdout.on('data', function (data) {
      console.log(''+ data);
    });
    fakes.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });
    fakes.stderr.on('data', function (data) {
      var log_line = data + '';
      console.log(log_line);
      if (log_line.match(/WEBrick::HTTPServer#start/)){
        done();
      }
    });

  })

  after(function(done){
    fakes.kill('SIGKILL');//normal sigterm does not work on fakes
    done();
  })

  it('amazon local test server should respond', function(done){
    request('http://' + local + '/', 
      function(err, res, body){
        res.statusCode.should.eql(200);
        done();
      });
  });

  it('should exist', function(done){
    should.exist(signer);
    done();
  })
  it('should generate a valid PUT url', function(done){
    var purl = signer.getUrl('PUT', 'toto.json', 'my_bucket', 600);
    purl.should.be.type('string');
    console.log(purl);

    fs.createReadStream('package.json').pipe(request.put(purl, function(err, res){
      should.not.exist(err);
      res.statusCode.should.eql(200);
      done();
    }))
  })

  it('should generate a valid GET url', function(done){
    var purl = signer.getUrl('GET', 'toto.json', 'my_bucket', 600);
    purl.should.be.type('string');
    request.get(purl, function(err, res, body){
      should.not.exist(err);
      res.statusCode.should.eql(200);
      should.exist(JSON.parse(body))
      done();
    })
  })
});
