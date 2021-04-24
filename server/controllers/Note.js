const models = require('../models');

const { Note } = models;

const notePage = (req, res) => {
  Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app2', { csrfToken: req.csrfToken(), note: docs });
  });
};

const makeNote = (req, res) => {
  if (!req.body.note) {
    return res.status(400).json({ error: 'RAWR! A note is required' });
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

    return res.status(400).json({ error: 'An error occured.' });
  });
  return notePromise;
};

const getNote = (request, response) => {
  const req = request;
  const res = response;

  return Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.status(200).json({ note: docs });
  });
};

const deleteNote = (req) => {
  if (req.query._id) {
    Note.NoteModel.deleteOne({ _id: req.query._id }, (err) => {
      console.log('Data deleted'); // Success

      if (err) {
        console.log(err);
      }
    });
  }
};

module.exports.notePage = notePage;
module.exports.getNote = getNote;
module.exports.make = makeNote;
module.exports.deleteNote = deleteNote;
