
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
  name: String,
  email: String,
  hashed_password: String,
  salt: String
})

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () { return this._password })

var validatePresenceOf = function (value) {
  return value && value.length
}

UserSchema.path('name').validate(function (name) {
 return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('hased_password').validate(function (hashed_password) {
  return hashed_password.length
}, 'Password cannot be blank')

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePrescenceOf(this.password)
    && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'))
  else
    next()
})


UserSchema.methods = {
  /**
* Authenticate - check if the passwords are the same
*
* @param {String} plainText
* @return {Boolean}
* @api public
*/

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
  * Make salt
  *
  * @return {String}
  */

  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
  * Encrypt password
  *
  * @param {String} password
  * @return {String}
  */

  encryptPassword: function(password) {
    if (!password) return ''
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  }
}


mongoose.model('User', UserSchema)
