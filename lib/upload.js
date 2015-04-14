// require 'form-data'
var Promise, fs, getTempFile, request, tmp;

Promise = require('es6-promise').Promise;

request = require('request');

tmp = require('tmp');

fs = require('fs');

getTempFile = function() {
  return new Promise(function(resolve, reject) {
    return tmp.file(function(err, path, fd, callback) {
      if (err != null) {
        return reject(err);
      }
      return resolve({
        path: path,
        callback: callback
      });
    });
  });
};

module.exports = function(image, channel, token) {
  return new Promise(function(resolve, reject) {
    return getTempFile().then(function(arg) {
      var callback, form, path, r, url;
      path = arg.path, callback = arg.callback;
      fs.writeFileSync(path, image, {
        encoding: 'binary'
      });
      url = 'https://slack.com/api/files.upload';
      r = request.post(url, function(err, res) {
        if (err != null) {
          return reject(err);
        }
        return resolve();
      });
      form = r.form();
      form.append('file', fs.createReadStream(path));
      form.append('token', token);
      return form.append('channels', channel);
    })["catch"](function(e) {
      return reject(e);
    });
  });
};
