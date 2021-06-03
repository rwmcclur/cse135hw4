const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const dbName = 'userData';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const collections = ['staticData', 'clickEvents'];
const session = require('express-session');

app.use(express.json());

app.use(session({ secret: 'Morty' }));

// Returns every entry in the specified collection
app.get('/:collection', cors(), (req, res) => {
    // Check to make sure given collection variable is valid
    if (!collections.includes(`${req.params.collection}`)) {
      res.status(400).send('Unrecognized Collection');
    }
  
    // Connect to MongoDB
    client.connect(function (err) {
      assert.strictEqual(null, err); // Make sure there were no errors
      console.log('Connected successfully to server');
  
      // Grab the specified collection from the dbName we defined above
      const db = client.db(dbName);
      const collection = db.collection(`${req.params.collection}`);
  
      // Searching for empty parameters will return the whole collection
      collection.find({}).toArray((err, docs) => {
        assert.strictEqual(null, err); // Make sure there were no errors
        res.send(docs); // Send back the resulting documents
      });
    });
});

// Returns the specified entry if found
app.get('/:collection/:id', cors(), (req, res) => {
  // Check to make sure given collection variable is valid
  if (!collections.includes(`${req.params.collection}`)) {
    res.status(400).send('Unrecognized Collection');
  }
  // Connect to MongoDB
  client.connect(function (err) {
    assert.strictEqual(null, err); // Make sure there were no errors
    console.log('Connected successfully to server');

    // Grab the specified collection from the dbName we defined above
    const db = client.db(dbName);
    const collection = db.collection(`${req.params.collection}`);

    // Make sure there was an id given and it's of the correct length
    if (req.params.id && req.params.id.length == 24) {
      // Find a single entry matching the given parameters
      collection.findOne({ _id: ObjectID(req.params.id) }, (err, doc) => {
        assert.strictEqual(null, err); // Make sure there were no errors
        res.send(doc); // Send back the resulting documents
      });
    } else {
      // If there was no id / it's of the wrong length, send back a 400 code
      res.status(400).send('Malformed Query Key');
    }
  });
});


// Adds the given entry/entries to the specified collection
app.post('/:collection', cors(), (req, res) => {

  // Check to make sure given collection variable is valid
  if (!collections.includes(`${req.params.collection}`)) {
    res.status(400).send('Unrecognized Collection');
  }

  // Function to call if request is malformed, sends back a 400 code
  function _malformedRequest() {
    return res.status(400).send('Data Received is Malformed');
  }

  // Make sure incoming data is formed correctly and has a body
  if (!Array.isArray(req.body)) {
    return _malformedRequest();
  }

  // Make sure all of the values in the array are formatted correctly
  let keysToCheck = [];
  if (req.params.collection == 'clickEvents') {
    keysToCheck = ['client', 'page'];
  } else if (req.params.collection == 'staticData') {
    keysToCheck = [
      'outerWidth','outerHeight','innerWidth', 
      'innerHeight','userAgent','language'
    ];
  }
  req.body.forEach(entry => {
    for (const key in entry) {
      if (!keysToCheck.includes(key)) {
        return _malformedRequest();
      }
    }
  });

  // Connect to MongoDB
  client.connect(function (err) {
    assert.strictEqual(null, err); // Check to make sure there were no errors
    console.log('Connected successfully to server');

    // Grab the specified collection from the dbName we defined above
    const db = client.db(dbName);
    const collection = db.collection(`${req.params.collection}`);

    // Add SessionID to each entry
    req.body.forEach(entry => {
      entry['sessionID'] = req.sessionID;
    });

    // Insert every entry from req.body
    collection.insertMany(req.body).then(results => {
      if (results) {
        return res.send({
          insertedCount: results.insertedCount,
          insertedIds: results.insertedIds
        });
      } else {
        return res.status(500).send('Error inserting entry');
      }
    });
  });
});


// For options request, send 204 ok no data
app.options('/', cors(), function(req, res) {
    res.status(204).end();
});

// For everything else, send 405 method not allowed
app.all('/', cors(), function(req, res) {
    res.status(405).end();
});

app.listen(port, function () {
    console.log(`Example app listening at http://localhost:3000`);
});