const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  // Make sure database is empty before every test
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect(response => {
      // Test response return correct body text
      expect(response.body.text).toBe(text);
    })
    .end((err, response) => {
      if (err) {
        return done(err);
      }
      // Test todo added correctly to MongoDB
      Todo.find({text}).then(todos => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      })
      .catch(err => done(err));
    })
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, response) => {
      if (err) {
        return done(err);
      }

      Todo.find().then(todos => {
        expect(todos.length).toBe(2);
        done()
      })
      .catch(err => done(err));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect(response => {
      expect(response.body.todos.length).toBe(2);
    }).end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo with a id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toString()}`)
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(todos[0].text);
    }).end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const id = new ObjectID().toString();
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return 400 if is is invalid', (done) => {
    request(app)
    .get('/todos/123')
    .expect(400)
    .end(done);
  });
});