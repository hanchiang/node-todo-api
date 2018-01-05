const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// POST /todos
app.post('/todos', (request, response) => {
  const todo = new Todo({
    text: request.body.text
  });

  todo.save()
  .then(doc => response.send(doc))
  .catch(err => response.status(400).send(err));
});

// GET /todos
app.get('/todos', (request, response) => {
  const todos = Todo.find().then(todos => response.send({todos}))
    .catch(err => response.status(400).send(err));
});

// GET /todos/:id
app.get('/todos/:id', (request, response) => {
  const id = request.params.id;
  if (!ObjectID.isValid(id)) {
    response.status(400).send('ID is invalid');
  }

  Todo.findById(id)
  .then(todo => {
    if (!todo) {
      response.status(404).send('ID not found');
    }
    response.send({todo});
  })
  .catch(err => response.status(404).send());
});


app.listen(port, () => console.log('Server is running on port ' + port));

module.exports = {
  app
};