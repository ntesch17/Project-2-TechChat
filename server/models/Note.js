const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let NoteModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
// const setName = (name) => _.escape(name).trim();

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

NoteSchema.statics.toAPI = (doc) => ({
  note: doc.note,
});

NoteSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return NoteModel.find(search).select('note').lean().exec(callback);
};

NoteModel = mongoose.model('Note', NoteSchema);

module.exports.NoteModel = NoteModel;
module.exports.NoteSchema = NoteSchema;
