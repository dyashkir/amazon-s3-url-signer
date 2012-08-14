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

