const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

const id = '5a4ee4bef017401aa491fb33';

if (!ObjectID.isValid(id)) {
  return console.log('ID not valid');
}

Todo.find({
  _id: id
}).then(todos => {
  console.log('Todos:', todos)
})
//.catch(err => console.log(err));

Todo.findOne({
  _id: id
}).then(todo => console.log('Todo:', todo))
//.catch(err => console.log(err));

Todo.findById(id).then(todo => {
  if (!todo) {
    return console.log('Todo not found');
  }
  console.log('Todo by id:', todo)
})
.catch(err => console.log(err));