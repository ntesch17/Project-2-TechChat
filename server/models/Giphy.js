// Pull in mongoose and create our empty file model object.
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let FileModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
// Create our schema. This is based on the data pulled in by express-fileupload.
// We can assume all of this data is required, as there will be an error from
// fileupload before we create anything in this database. You could explicitly
// define everything as required though.
const FileSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    set: setName,
  },

  name: { // The name of our file as a string. We want this to be unique.
    type: String,
  },

  data: { // The data of our file. This is stored as a byte array.
    type: Buffer,
  },

  size: { // The size of our file in bytes.
    type: Number,
  },

  encoding: { // The encoding type of the image in the byte array.
    type: String,
  },

  tempFilePath: { // The temp file path.
    type: String,
  },

  truncated: { // If our file has been cut off.
    type: Boolean,
  },

  mimetype: { // The type of data being stored.
    type: String,
  },

  md5: { // The md5 hash of our file.
    type: String,
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

// Sending the name and username to the API.
FileSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  username: doc.username,
});

// Finding by owner of the uploader.
FileSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return FileModel.find(search).select('owner').lean().exec(callback);
};

// Once we have setup the schema, we want to create our model.
FileModel = mongoose.model('FileModel', FileSchema);

// Export the model and schema.
module.exports.FileModel = FileModel;
module.exports.FileSchema = FileSchema;
