const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SearchModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const SearchSchema = new mongoose.Schema({
  search: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  limit: {
    type: Number,
    min: 0,
    required: true,
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

SearchSchema.statics.toAPI = (doc) => ({
  search: doc.search,
  limit: doc.limit,
});

SearchSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return SearchModel.find(search).select('search limit').lean().exec(callback);
};

SearchModel = mongoose.model('search', SearchSchema);

module.exports.SearchModel = SearchModel;
module.exports.SearchSchema = SearchSchema;