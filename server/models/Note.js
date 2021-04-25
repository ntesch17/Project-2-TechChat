const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let NoteModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

// Note schema with attributes associated.
const NoteSchema = new mongoose.Schema({
  note: {
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
NoteSchema.statics.toAPI = (doc) => ({
  note: doc.note,
});

// Searching by the owner of the note response.
NoteSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return NoteModel.find(search).select('note').lean().exec(callback);
};

// Creates note model.
NoteModel = mongoose.model('Note', NoteSchema);

module.exports.NoteModel = NoteModel;
module.exports.NoteSchema = NoteSchema;
