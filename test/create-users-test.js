var inspect = require('eyespect').inspector()
var should = require('should');
var dbLib = require('./db')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var configFilePath = path.join(__dirname, 'config.json')
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({file: configFilePath})
var createTestUsers = require('../index')
describe('Create Test Users', function () {
  var db
  before(function (done) {
    dbLib(config, function (err, dbReply) {
      should.not.exist(err)
      should.exist(dbReply)
      db = dbReply
      done()
    })
  })
  it('should create test users', function (done) {
    var jsonFilePath = path.join(__dirname, 'test/users.json')
    var config = require('nconf').env().argv().defaults({
      bcrypt: {
        rounds: 12
      }
    })

    // make sure the created profiles password match the input data
    var confirmPasswordsMatch = true
    var data = {
      db: db,
      remove: true, // remove existing first users or not,
      config: config,
      jsonFilePath: jsonFilePath,
      confirmPasswordsMatch: confirmPasswordsMatch
    }
    createTestUsers(data, function(err, reply) {
      should.not.exist(err)
      should.exist(reply)
      reply.length.should.eql(2)
      inspect(reply, 'created test users successfully')
      done()
    })
  })
})
