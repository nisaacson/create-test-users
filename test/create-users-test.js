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
  this.timeout('10s')
  this.slow('5s')
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
    var jsonFilePath = path.join(__dirname, 'users.json')
    var usersData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
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
      usersData: usersData,
      confirmPasswordsMatch: confirmPasswordsMatch
    }
    createTestUsers(data, function(err) {
      should.not.exist(err)
      var userData = usersData[0]
      var email = userData.email
      should.exist(email, 'email not found')
      db.view('user_profile/byEmail', {key: email}, function (err, docs) {
        should.not.exist(err)
        should.exist(docs)
        docs.length.should.eql(1)
        var profile = docs[0].value
        profile.email.should.eql(userData.email)
        profile.hash.should.not.eql(userData.password)
        done()
      })
    })
  })
})
