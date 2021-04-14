const models = require('../models');
const { AccountModel } = require('../models/Account');

const { Chat } = models;
const { Account } = models;

const getAllChats = (req, res) => {
  Chat.ChatModel.find({}, (err, docs) => res.json({ chat: docs }));
};

const chatPage = (req, res) => {
  Chat.ChatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), chat: docs });
  });
};

const makeChat = (req, res) => {
  if (!req.body.response) {
    return res.status(400).json({ error: 'RAWR! A response is required' });
  }

  const chatData = {
    response: req.body.response,
    username: req.session.account.username,
    owner: req.session.account._id,
  };

  console.log(req.session.account);

  const newChat = new Chat.ChatModel(chatData);

  const chatPromise = newChat.save();

  chatPromise.then(() => res.json({ redirect: '/chat' }));

  chatPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured.' });
  });
  return chatPromise;
};

const deleteMessage = (req, res) => {
  if(req.query._id){
    Chat.ChatModel.deleteOne({ _id: req.query._id }, (err) => {
      console.log("Data deleted"); // Success

      if(err){
        console.log(err);
      }
    });
  }
}


const getFriendsList = (req, res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    //Error handling
    let friends = [];
    let friendPromises = [];
    for(let i = 0; i < doc.friendsList.length; i++){
      friendPromises.push(AccountModel.findOne({ _id: doc.friendsList[i] }, (err, doc) => {
        //error handling
        let friend = {
          username: doc.username,
          friendList: doc.friendsList,
        }

        friends.push(friend);
      }));
    }
  })
  Promise.all(friendsPromises).then(() => {
    //send friends array response
    res.json({friends});
  }).catch((err) => {
    //error handling
  });
}
module.exports.chatPage = chatPage;
module.exports.getChat = getAllChats;
module.exports.make = makeChat;
module.exports.deleteMessage = deleteMessage;
module.exports.getFriendsList = getFriendsList;