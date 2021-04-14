const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let ChangeAccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const ChangeAccountSchema = new mongoose.Schema({
  

  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ChangeAccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
 
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

// ChangeAccountSchema.statics.findByUsername = (name, callback) => {
//   const search = {
//     username: name,
//   };

//   return AccountModel.findOne(search, callback);
// };

ChangeAccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

ChangeAccountSchema.statics.authenticate = (username, password, callback) => {
    ChangeAccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

ChangeAccountModel = mongoose.model('Change', ChangeAccountSchema);

module.exports.ChangeAccountModel = ChangeAccountModel;
module.exports.ChangeAccountSchema = ChangeAccountSchema;
