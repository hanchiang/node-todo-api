const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

// Middleware
app.use(bodyParser.json());

app.post('/todos', (request, response) => {
  console.log(request.body);

  const todo = new Todo({
    text: request.body.text
  });

  todo.save()
  .then(doc => response.send(doc))
  .catch(err => response.status(400).send(err));
});


app.listen(3000, () => console.log('Server is running on port 3000'));

module.exports = {
  app
};