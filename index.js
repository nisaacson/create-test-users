var assert = require('assert')
var fs = require('fs')
var path = require('path')
var confirmIfNeeded = require('./confirmIfNeeded')
var create = require('./create')
var async = require('async')

var rk = require('required-keys')
module.exports = function(data, callback) {
  var db
  var keys = ['remove', 'db', 'config', 'usersData', 'confirmPasswordsMatch']
  var err = rk.nonNullSync(data, keys)
  if (err) { return callback(err) }
  var jsonFilePath = data.jsonFilePath
  if (!data.usersData.length === 0) {
    return callback({
      message: 'error creating test users',
      error: 'usersData.length is 0',
      stack: new Error().stack
    })
  }
  var usersData = data.usersData
  db = data.db
  var config = data.config
  async.forEachSeries(
    usersData,
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
