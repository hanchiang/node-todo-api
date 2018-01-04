// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MonogDB server:', err);
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({ _id: ObjectID('5a4cf59196f8b81f1c4b2621')})
  // .toArray()
  // .then(docs => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // })
  // .catch(err => console.log('Unable to fetch todo:', err));

  // db.collection('Todos').find()
  //   .count()
  //   .then((count) => {
  //     console.log('Number of todos:', count);
  //   })
  //   .catch(err => console.log('Unable to fetch todo:', err));

  db.close();
});