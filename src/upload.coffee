# require 'form-data'
{Promise} = require 'es6-promise'
request = require 'request'
tmp = require 'tmp'
fs = require 'fs'

getTempFile = ->
  new Promise (resolve, reject) ->
    tmp.file (err, path, fd, callback) ->
      return reject(err) if err?
      resolve { path, callback }

module.exports = (image, channel, token) ->
  new Promise (resolve, reject) ->
    getTempFile()
    .then ({ path, callback }) ->
      fs.writeFileSync path, image, encoding: 'binary'
      url = 'https://slack.com/api/files.upload'
      r = request.post url, (err, res) ->
        return reject(err) if err?
        resolve()
      form = r.form()
      form.append 'file', fs.createReadStream(path)
      form.append 'token', token
      form.append 'channels', channel
    .catch (e) ->
      reject e
