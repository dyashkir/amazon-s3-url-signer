var join = require('path').join;
var crypto = require('crypto');

exports.urlSigner = function(key, secret){

  var endpoint = 's3.amazonaws.com';
  var port = '80';

  var hmacSha1 = function (message) {
    return crypto.createHmac('sha1', secret)
                  .update(message)
                  .digest('base64');
  };

  var url = function (fname, bucket) {
    return 'http://'+ bucket + '.' + endpoint + (fname[0] === '/'?'':'/') + fname;
  };

  return {
    getUrl : function(verb, fname, bucket, expiresInMinutes){
      var expires = new Date();

      expires.setMinutes(expires.getMinutes() + expiresInMinutes);

      var epo = Math.floor(expires.getTime()/1000);

      var str = verb + '\n\n\n' + epo + '\n' + '/' + bucket + (fname[0] === '/'?'':'/') + fname;

      var hashed = hmacSha1(str);

      var urlRet = url(fname, bucket) + 
        '?Expires=' + epo +
        '&AWSAccessKeyId=' + key +
        '&Signature=' + encodeURIComponent(hashed);

      return urlRet;

    }
  };
  
};
