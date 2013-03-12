var assert = require('assert')
var fs = require('fs')
var path = require('path')
var confirmIfNeeded = require('./confirmIfNeeded')
var create = require('./create')
var async = require('async')

var rk = require('required-keys')
module.exports = function(data, callback) {
  var db
  var keys = ['remove', 'db', 'config', 'jsonFilePath', 'confirmPasswordsMatch']
  var err = rk.nonNullSync(data, keys)
  if (err) { return callback(err) }
  var jsonFilePath = data.jsonFilePath
  var exists = fs.existsSync(jsonFilePath)
  if (!exists) {
    return callback({
      message: 'error creating test users',
      error: 'json file does not exist at the path you specified',
      stack: new Error().stack
    })
  }
  var usersJson = fs.readFileSync(jsonFilePath, 'utf8')
  var users = JSON.parse(usersJson)
  db = data.db
  var config = data.config
  async.forEachSeries(
    users,
    function (profile, cb) {
      var createData = {
        config: config,
        profile: profile,
        db: db,
        confirmPasswordsMatch: data.confirmPasswordsMatch
      }
      create(createData, function (err, reply) {
        if (err) { return cb(err) }
        var confirmData = {
          db: db,
          profile: reply
        }
        confirmIfNeeded(confirmData, function (err, reply) {
          cb(err, reply)
        })
      })
    }, function (err) {
      if (err) { return callback(err) }
      callback()
    }
  )
}
