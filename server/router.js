const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getNote', mid.requiresLogin, controllers.Note.getNote);
  app.get('/getChat', mid.requiresLogin, controllers.Chat.getChat);
  app.get('/getFriendsList', mid.requiresLogin, controllers.Chat.getFriendsList);
  app.post('/addFriend', mid.requiresLogin, controllers.Chat.makeFriend);
  app.get('/friends', mid.requiresLogin, controllers.Chat.friendsPage);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePage);


  app.post('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.changeLogin);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/note', mid.requiresLogin, controllers.Note.notePage);
  app.post('/note', mid.requiresLogin, controllers.Note.make);
  app.get('/chat', mid.requiresLogin, controllers.Chat.chatPage);
  app.post('/chat', mid.requiresLogin, controllers.Chat.make);
  //app.get('/search', mid.requiresLogin, controllers.Search.chatPage);
  //app.post('/search', mid.requiresLogin, controllers.Search.make);

  // Setup Gif Page
  app.get('/files', mid.requiresLogin, controllers.Search.uploadPage);

  // Setup post requests to /upload.
  app.post('/upload', mid.requiresLogin, controllers.Search.uploadFile);

  // Setup get requests to /retrieve
  app.get('/retrieve',mid.requiresLogin, controllers.Search.retrieveFile);

  app.delete('/deleteMessage', mid.requiresLogin, controllers.Chat.deleteMessage);
  app.delete('/deleteNote', mid.requiresLogin, controllers.Note.deleteNote);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/*', controllers.Account.notFound);
};

module.exports = router;
