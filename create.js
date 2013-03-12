var bcrypt = require('bcrypt-nodejs')
var removeIfProfile = require('./removeIfProfile')
var couchProfile = require('couch-profile')
module.exports = function create(data, cb) {
  var confirmPasswordsMatch = data.confirmPasswordsMatch
  var config = data.config
  var profile = data.profile
  var email = profile.email
  var db = data.db
  var createData = {
    email: email,
    password: profile.password,
    db: db,
    rounds: config.get('bcrypt:rounds')
  }
  var findData = {
    email: email,
    db: db
  }
  couchProfile.findProfile(findData, function (err, profileReply) {
    if (err) { return cb(err) }
    if (profileReply) {
      // allow caller to skip checking passwords since bcrypt is slow
      if (!confirmPasswordsMatch) {
        return cb(null, profileReply)
      }
      var result = bcrypt.compareSync(profile.password, profileReply.hash)
      if (result) {
        return cb(null, profileReply)
      }
    }
    var removeData = {
      db: db,
      profile: profileReply
    }
    removeIfProfile(removeData, function (err, reply) {
      if (err) { return cb(err) }
      couchProfile.getOrCreateProfile(createData, function (err, reply) {
        if (err) {
          return cb(err)
        }
        cb(null, reply)
      })
    })
  })
}
