require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

/*
 * Todos API
 */ 
// POST /todos
app.post('/todos', (request, response) => {
  const todo = new Todo({
    text: request.body.text
  });

  todo.save()
  .then(todo => response.send({todo}))
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
  .catch(err => response.status(400).send());
});

// DELETE /todos/:id
app.delete('/todos/:id', (request, response) => {
  const id = request.params.id;
  if (!ObjectID.isValid(id)) {
    response.status(400).send('ID is invalid');
  }

  Todo.findByIdAndRemove(id)
  .then(todo => {
    if (!todo) {
      response.status(404).send('ID not found');
    }
    response.send({todo});
  })
  .catch(err => response.status(400).send());
});

// PATCH /todos/:id
app.patch('/todos/:id', (request, response) => {
  const id = request.params.id;
  if (!ObjectID.isValid(id)) {
    response.status(400).send('ID is invalid');
  }

  let body = _.pick(request.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then(todo => {
    if (!todo) {
      return response.status(404).send('ID not found');
    }
    response.send({todo});
  })
  .catch(err => response.status(400).send(err));
});

/*
 * Users API
 */ 
// POST /users - returns a token when user sign up
app.post('/users', (request, response) => {
  const user = new User({
    email: request.body.email,
    password: request.body.password
  });

  user.save().then(user => {
    return user.generateAuthToken();
  })
  .then(token => {
    response.header('x-auth', token).send({user});
  })
  .catch(err => response.status(400).send(err));
});



// GET /users/me
app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user);
});


app.listen(port, () => console.log('Server is running on port ' + port));

module.exports = {
  app
};