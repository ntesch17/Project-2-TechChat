const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let ChatModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

// Chat schema with attributes associated.
const ChatSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    set: setName,
  },

  response: {
    type: String,
    
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
ChatSchema.statics.toAPI = (doc) => ({
  response: doc.response,
  username: doc.username,
});

// Searching by the owner of the chat response.
ChatSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return ChatModel.find(search).select('response').lean().exec(callback);
};

// Create chat model.
ChatModel = mongoose.model('Chat', ChatSchema);

module.exports.ChatModel = ChatModel;
module.exports.ChatSchema = ChatSchema;
