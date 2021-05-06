const models = require('../models');

const { Note } = models;

// Renders the note page for a user.
const notePage = (req, res) => {
  Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with the note page.' });
    }

    return res.render('app2', {
      csrfToken: req.csrfToken(),
      note: docs,
      subscribed: req.session.account.subscribed,
      username: req.session.account.username,
    });
  });
};

// Creates a note based on the note entered by the user.
const makeNote = (req, res) => {
  if (!req.body.note) {
    return res.status(400).json({ error: 'A note is required!' });
  }

  const noteData = {
    note: req.body.note,
    owner: req.session.account._id,
  };

  const newNote = new Note.NoteModel(noteData);

  const notePromise = newNote.save();

  notePromise.then(() => res.status(200).json({ redirect: '/note' }));

  notePromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occured with creating note.' });
  });
  return notePromise;
};

// Obtains the note subitted by the user and is displayed to just that user.
const getNote = (request, response) => {
  const req = request;
  const res = response;

  return Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured with displaying note.' });
    }

    return res.status(200).json({ note: docs });
  });
};

// Deletes the note from the database.
const deleteNote = (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Note ID Required.' });
  }

  return Note.NoteModel.deleteOne({ _id: req.query._id }, (err) => {
    console.log('Data deleted'); // Success

    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with deleting a note.' });
    }
    return res.status(200).json({ redirect: '/note' });
  });
};

module.exports.notePage = notePage;
module.exports.getNote = getNote;
module.exports.make = makeNote;
module.exports.deleteNote = deleteNote;
