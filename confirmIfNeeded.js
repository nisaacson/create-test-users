module.exports = function confirmIfNeeded(data, cb) {
  var profile = data.profile
  var db = data.db
  if (profile.confirmed) {
    return cb(null, data.profile)
  }
  profile.confirmed = true
  var id = profile._id
  var rev = profile._rev
  delete profile._rev
  db.save(id, rev, profile, function (err, reply) {
    profile._rev = reply._rev
    cb(null, profile)
  })
}
