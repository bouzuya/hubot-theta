// Description
//   A Hubot script to capture image data using RICOH THETA
//
// Configuration:
//   None
//
// Commands:
//   hubot theta - capture image data using RICOH THETA
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var Theta, config, parseConfig, upload;

Theta = require('ricoh-theta');

upload = require('../upload');

parseConfig = require('hubot-config');

config = parseConfig('theta', {
  slackToken: null,
  slackChannelId: null
});

module.exports = function(robot) {
  var capturing, ref, response, theta;
  theta = new Theta();
  capturing = false;
  response = null;
  if ((ref = robot.brain) != null) {
    ref.on('close', function() {
      return 'brain closed';
    });
  }
  theta.on('connect', function() {
    return robot.logger.debug('hubot-theta: connected');
  });
  theta.on('objectAdded', function(objectId) {
    robot.logger.debug('hubot-theta: object added');
    return theta.getPicture(objectId, function(err, picture) {
      if (err != null) {
        robot.logger.error('hubot-theta: error');
        robot.logger.error(err);
        return;
      }
      robot.logger.debug('hubot-theta: get picture');
      response.send('hubot-theta: uploading...');
      upload(picture, config.slackChannelId, config.slackToken);
      return capturing = false;
    });
  });
  theta.connect();
  return robot.respond(/theta$/i, function(res) {
    res.send('please wait...');
    capturing = true;
    if (!theta.isOpen) {
      robot.logger.error('hubot-theta: error');
      robot.logger.error('hubot-theta: !connected');
      capturing = false;
      return;
    }
    return theta.capture(function(err) {
      if (err != null) {
        robot.logger.error('hubot-theta: error');
        robot.logger.error(err);
        capturing = false;
        return;
      }
      robot.logger.debug('hubot-theta: captured');
      return response = res;
    });
  });
};
