// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MonogDB server:', err);
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'})
  // .then(result => {
  //   console.log(result);
  // })
  // .catch(err => console.log('Unable to delete many todos:', err));

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'})
  // .then(result => {
  //   console.log(result);
  // })
  // .catch(err => console.log('Unable to delete todo:', err));

  // findOneAndDelete
  db.collection('Todos').findOneAndDelete({completed: false})
  .then(result => console.log(result))
  .catch(err => console.log('Unable to delete:', err));

  db.close();
});