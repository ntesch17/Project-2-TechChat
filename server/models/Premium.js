const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//const _ = require('underscore');

let PremiumModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
//const setName = (name) => _.escape(name).trim();

// Chat schema with attributes associated.
const PremiumSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// Sending to the api the needed attributes.
PremiumSchema.statics.toAPI = (doc) => ({
    email: doc.email,
 
});

// Searching by the owner of the chat response.
PremiumSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return PremiumModel.find(search).select('email').lean().exec(callback);
};

// Create chat model.
PremiumModel = mongoose.model('Premium', PremiumSchema);

module.exports.PremiumModel = PremiumModel;
module.exports.PremiumSchema = PremiumSchema;
