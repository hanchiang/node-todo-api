// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MonogDB server:', err);
  }
  console.log('Connected to MongoDB server');

  // findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate(
  //   { _id: new ObjectID('5a4dbc7811e21559fa0d4d9e')}, 
  //   { 
  //     $set: {
  //       completed: true
  //     } 
  //   }, {
  //     returnOriginal: false
  //   })
  //   .then(result => console.log(result));

  db.collection('Users').findOneAndUpdate(
    { _id: new ObjectID('5a4dada911e21559fa0d4a8c')},
    {
      $set: {
        name: 'hansolo'
      },
      $inc: {
        age: -2
      },
    }, {
      returnOriginal: false
    })
    .then(result => console.log(result));

  db.close();
});