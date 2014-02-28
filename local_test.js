var s3 = require('./index');

var putUrl = s3.urlSigner(123, 'abc', {
  host: 'localhost',
    port: 1234
}).getUrl('GET', 'toto.json', 'my_bucket', 600);
console.log(putUrl);
