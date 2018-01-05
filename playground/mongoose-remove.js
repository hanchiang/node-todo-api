const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

// Todo.remove({}).then(result => console.log(result));

// Todo.findByIdAndRemove('5a4f08c04fe87c680a70a4f1').then(todo => {
//   console.log(todo);
// });

// Todo.findOneAndRemove({ _id: '5a4f09074fe87c680a70a50c'})
// .then(todo => console.log(todo));