# Description
#   A Hubot script to capture image data using RICOH THETA
#
# Configuration:
#   HUBOT_SLACK_CHANNEL_ID
#   HUBOT_SLACK_TOKEN
#
# Commands:
#   hubot theta - capture image data using RICOH THETA
#
# Author:
#   bouzuya <m@bouzuya.net>
#
Theta = require 'ricoh-theta'
upload = require '../upload'
parseConfig = require 'hubot-config'

config = parseConfig 'theta',
  slackToken: null
  slackChannelId: null

module.exports = (robot) ->
  theta = new Theta()
  capturing = false
  response = null

  robot.brain?.on 'close', ->
    'brain closed'

  theta.on 'connect', ->
    robot.logger.debug 'hubot-theta: connected'

  theta.on 'objectAdded', (objectId) ->
    robot.logger.debug 'hubot-theta: object added'
    theta.getPicture objectId, (err, picture) ->
      if err?
        robot.logger.error 'hubot-theta: error'
        robot.logger.error err
        return
      robot.logger.debug 'hubot-theta: get picture'

      response.send 'hubot-theta: uploading...'
      upload picture, config.slackChannelId, config.slackToken
      capturing = false

  theta.connect() # '192.168.1.1'

  robot.respond /theta$/i, (res) ->
    res.send 'please wait...'
    capturing = true
    unless theta.isOpen
      robot.logger.error 'hubot-theta: error'
      robot.logger.error 'hubot-theta: !connected'
      capturing = false
      return
    theta.capture (err) ->
      if err?
        robot.logger.error 'hubot-theta: error'
        robot.logger.error err
        capturing = false
        return
      robot.logger.debug 'hubot-theta: captured'

      # see object added
      response = res
