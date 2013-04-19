##Amazon S3 url signer

Module to sign urls to allow access to the private resources in the S3

###To install

    npm install amazon-s3-url-signer

###Use example

    var sig= require('amazon-s3-url-signer');

    var bucket1 = sig.urlSigner('my key', 'my secret');
    var bucket1 = sig.urlSigner('my key2', 'my secret2');
    
    var url1 = bucket1.getUrl('GET', 'somefile.png', 'mybucket', 10); //url expires in 10 minutes
    var url2 = bucket2.getUrl('PUT', '/somedir/somefile.png', 'mybucketonotheraccount', 10); //url expires in 100 minutes

###Local test

If you want to test without an s3 acount you can use <https://github.com/jubos/fake-s3>.

    sudo apt-get install rubygems
    sudo gem install fakes3  --no-rdoc --no-ri
    mkdir s3_files
    fakes3 -r s3_files -p 1234

Now a fakes3 server is started.
Now we will generate an S3 URL, and push a file to it.

    var s3 = require('./index');

    var putUrl = s3.urlSigner(123, 'abc', {
      host: 'mymachine.me',
      port: 1234
    }).getUrl('PUT', 'toto.json', 'my_bucket', 600);
    console.log(putUrl);

The generated S3 url is:

    http://mymachine.me:1234/my_bucket/toto.json?Expires=1352966881&AWSAccessKeyId=123&Signature=FDs%2Buf0hXskY1%2BUj4A7S4wHFx20%3D

Now you can use this URL with curl

    curl --upload-file package.json "http://mymachine.me:1234/my_bucket/toto.json?Expires=1352966881&AWSAccessKeyId=123&Signature=FDs%2Buf0hXskY1%2BUj4A7S4wHFx20%3D"

Or with request

    var fs = require('fs');
    var request = require('request');
    fs.createReadStream('file.json').pipe(request.put("http://mymachine.me:1234/my_bucket/toto.json?Expires=1352966881&AWSAccessKeyId=123&Signature=FDs%2Buf0hXskY1%2BUj4A7S4wHFx20%3D"))

Or with any http client you like :)

Thank to @Filirom1 for local server changes
