var async = require('async')
module.exports = function(data, callback) {
  if (!data.profile) {
    return callback();
  }
  var db = data.db
  var email = data.email
  db.view('user_profile/byEmail', {}, function (err, docs) {
    if (err) { return callback(err) }
    if (docs.length === 0) {
      return callback()
    }
    async.forEachSeries(
      docs,
      function (doc, cb) {
        var id = doc.value._id
        var rev = doc.value._rev
        db.remove(id, rev, cb)
      }, callback)
  })
}
