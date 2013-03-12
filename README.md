# Create Test Users
Create test couch profiles for use in testing authenticated web services which use the [couch-profile](https://github.com/nisaacson/couch-profile) module

# Installation
```bash
npm install create-test-users
```

# Usage
```javascript
var inspect = require('eyespect').inspector()
var path = require('path')
var createTestUsers = require('create-test-users')
var jsonFilePath = path.join(__dirname, 'test/users.json')
var usersData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
var config = require('nconf').env().argv().defaults({
  bcrypt: {
    rounds: 12
  }
})

// make sure the created profiles password match the input data
var confirmPasswordsMatch = true
var data = {
  db: <cradle db connection here>,
  remove: true, // remove existing first users or not,
  config: config,
  usersData: usersData,
  confirmPasswordsMatch: confirmPasswordsMatch
}
createTestUsers(data, function(err, reply) {
  if (err) {
    inspect(err, 'error creating test users')
    return
  }
  inspect(reply, 'created test users successfully')
})
```
