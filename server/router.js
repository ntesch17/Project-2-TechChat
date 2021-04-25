const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // Gains token per user interaction.
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  // Setup Notes page.
  app.get('/getNote', mid.requiresLogin, controllers.Note.getNote);
  app.get('/note', mid.requiresLogin, controllers.Note.notePage);
  app.post('/note', mid.requiresLogin, controllers.Note.make);
  app.delete('/deleteNote', mid.requiresLogin, controllers.Note.deleteNote);

  // Setup Chat page.
  app.get('/getChat', mid.requiresLogin, controllers.Chat.getChat);
  app.get('/chat', mid.requiresLogin, controllers.Chat.chatPage);
  app.post('/chat', mid.requiresLogin, controllers.Chat.make);
  app.delete('/deleteMessage', mid.requiresLogin, controllers.Chat.deleteMessage);

  // Setup Friends page.
  app.get('/getFriendsList', mid.requiresLogin, controllers.Chat.getFriendsList);
  app.post('/addFriend', mid.requiresLogin, controllers.Chat.makeFriend);
  app.get('/friends', mid.requiresLogin, controllers.Chat.friendsPage);

  // Settup loggin page.
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // Setup logout.
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // Setup Signup page.
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // Setup Password change page.
  app.get('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePage);
  app.post('/change', mid.requiresSecure, mid.requiresLogin, controllers.Account.changeLogin);

  // Setup Gif Page.
  app.get('/files', mid.requiresLogin, controllers.Search.uploadPage);
  app.get('/memes', mid.requiresLogin, controllers.Search.memePage);
  app.get('/getFileIds', mid.requiresLogin, controllers.Search.getFileIDs);
  app.get('/getFileAllIds', mid.requiresLogin, controllers.Search.getAllFiles);

  // Setup post requests to /upload.
  app.post('/upload', mid.requiresLogin, controllers.Search.uploadFile);

  // Setup get requests to /retrieve.
  app.get('/retrieve', mid.requiresLogin, controllers.Search.retrieveFile);

  // Default page.
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // Setup 404 page.
  app.get('/*', controllers.Account.notFound);
};

module.exports = router;
