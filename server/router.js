const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getNote', mid.requiresLogin, controllers.Note.getNote);
  app.get('/getChat', mid.requiresLogin, controllers.Chat.getChat);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/change', mid.requiresSecure, mid.requiresLogin, controllers.Change.changePage);
  app.post('/change', mid.requiresSecure, mid.requiresLogin, controllers.Change.changeLogin);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/note', mid.requiresLogin, controllers.Note.notePage);
  app.post('/note', mid.requiresLogin, controllers.Note.make);
  app.get('/chat', mid.requiresLogin, controllers.Chat.chatPage);
  app.post('/chat', mid.requiresLogin, controllers.Chat.make);
  app.post('/chat', mid.requiresLogin, controllers.Chat.make);
  app.delete('/deleteMessage', mid.requiresLogin, controllers.Chat.deleteMessage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
