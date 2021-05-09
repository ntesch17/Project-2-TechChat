const models = require('../models');

const { Search } = models;

// Gains all the files uploaded.
const getAllFiles = (req, res) => {
  Search.FileModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with gaining all IDs.' });
    }

    return res.status(200).json({ search: docs });
  });
};

// Renders the meme page across users to send inmages to each other.
const memePage = (req, res) => {
  Search.FileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with the meme page.' });
    }

    return res.render('app5', {
      csrfToken: req.csrfToken(),
      search: docs,
      subscribed: req.session.account.subscribed,
      username: req.session.account.username,
    });
  });
};

// A simple controller to render the upload.handlebars page.
const uploadPage = (req, res) => {
  Search.FileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred with the upload page.' });
    }

    return res.render('app4', {
      csrfToken: req.csrfToken(),
      search: docs,
      subscribed: req.session.account.subscribed,
      username: req.session.account.username,
    });
  });
};

// Our upload handler.
const uploadFile = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const { sampleFile } = req.files;

  sampleFile.owner = req.session.account._id;

  console.log(req.session.account);
  // Once we have the file, we want to create a mongo document based on that file
  // that can be stored in our database.
  const fileDoc = new Search.FileModel(sampleFile);

  // Once we have that mongo document, we can save it into the database.
  const savePromise = fileDoc.save();

  // The promises 'then' event is called if the document is successfully stored in
  // the database. If that is the case, we will send a success message to the user.
  savePromise.then(() => {
    // res.status(201).json({ redirect: `/retrieve?fileName=${req.files}` });
    res.status(201).json({ message: 'Upload Successful! ' });
  });

  // The promises 'catch' event is called if there is an error when adding the document
  // to the database. If that is the case, we want to log the error and send a 400 status
  // back to the user.
  savePromise.catch((error) => {
    console.dir(error);
    res.status(400).json({ error: 'Something went wrong uploading' });
  });

  // Finally we will return the savePromise to prevent eslint errors.
  return savePromise;
};

// Our retrieval handler.
const retrieveFile = (req, res) => {
  // When making a GET request to /retrieve, the user should be providing a query parameter
  // of fileName to provide the name of the file in question. If it doesn't exist, send back
  // an error.
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing File ID! ' });
  }

  // If we do have the file name, we want to find that file in the database. We can do this
  // by using the findOne function that exists in all mongoose models. We will pass in the
  // fileName as 'name' in our search object. The callback function will accept an error and
  // a document. The error will be populated if something goes wrong. The doc will be populated
  // if a file with that name is found. We will return to prevent eslint errors.
  return Search.FileModel.findOne({ _id: req.query._id }, (error, doc) => {
    // If there is an error, log it and send a 400 back to the client.
    if (error) {
      console.dir(error);
      return res.status(400).json({ error: 'An error occured retrieving the file. ' });
    }

    // If no file with that name is found, but the search is successful, an error will not be
    // thrown. Instead, we will simply not recieve and error or a doc back. In that case, we
    // want to tell the user that the file they were looking for could not be found.
    if (!doc) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Finally, if the search was successful, we want to send back our document. Here, we will
    // use the built in response writeHead and end functions to send the data back to the user.
    res.writeHead(200, { 'Content-Type': doc.mimetype, 'Content-Length': doc.size });
    return res.end(doc.data);
  });
};

// Gains the file ids of the user that uploaded an image.
const getFileIDs = (req, res) => {
  Search.FileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.dir(err);
      return res.status(400).json({ error: 'An error occured retrieving the IDs. ' });
    }
    return res.status(200).json(docs);
  });
};

// Deletes the message from the database.
const deleteMeme = (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Meme ID is required.' });
  }
  return Search.FileModel.deleteOne({ _id: req.query._id }, (err) => {
    console.log('Data deleted'); // Success

    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.status(200).json({ redirect: '/files' });
  });
};

// Finally, export everything.
module.exports.uploadPage = uploadPage;
module.exports.uploadFile = uploadFile;
module.exports.retrieveFile = retrieveFile;
module.exports.getFileIDs = getFileIDs;
module.exports.getAllFiles = getAllFiles;
module.exports.memePage = memePage;
module.exports.deleteMeme = deleteMeme;
