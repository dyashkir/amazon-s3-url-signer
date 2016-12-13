var join = require('path').join;
var crypto = require('crypto');

exports.urlSigner = function(key, secret, options){
  options = options || {};
  var endpoint = options.host || 's3.amazonaws.com';
  var port = options.port || '80';
  var protocol = options.protocol || 'http';
  var subdomain = options.useSubdomain === true;

  var hmacSha1 = function (message) {
    return crypto.createHmac('sha1', secret)
                  .update(message)
                  .digest('base64');
  };

  var url = function (fname, bucket) {
      var portstr = ((port === '') || ((protocol === 'http') && (port == 80)) || ((protocol === 'https') && (port == 443))) ? '' : ':'+port;
      if (subdomain) {
        return protocol + '://'+ bucket + "." + endpoint + portstr + (fname[0] === '/'?'':'/') + fname;
      } else {
        return protocol + '://'+ endpoint + portstr + '/' + bucket + (fname[0] === '/'?'':'/') + fname;
      }
  };

  return {
    getUrl : function(verb, fname, bucket, expiresInMinutes, contentType){
      var expires = new Date();

      expires.setMinutes(expires.getMinutes() + expiresInMinutes);

      var epo = Math.floor(expires.getTime()/1000);

      var str = verb + '\n\n';
      if (contentType) {
        str = str+contentType;
      }
      str = str + '\n' + epo + '\n' + '/' + bucket + (fname[0] === '/'?'':'/') + fname;

      var hashed = hmacSha1(str);

      var urlRet = url(fname, bucket) +
        '?Expires=' + epo +
        '&AWSAccessKeyId=' + key +
        '&Signature=' + encodeURIComponent(hashed);

      return urlRet;

    }
  };

};
