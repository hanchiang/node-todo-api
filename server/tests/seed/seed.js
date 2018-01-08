const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'authenticated@test.com',
  password: 'password1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId.toString(), access: 'auth'}, 'abc123')
  }]
}, {
  _id: userTwoId,
  email: 'authenticated2@test.com',
  password: 'password2',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId.toString(), access: 'auth' }, 'abc123')
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 123,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  // Make sure database is empty before every test
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // Run the save middleware to hash password
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());

};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};