const request = require('supertest');
const expect = require('expect');

const { app } = require('../server');
const { Todo } = require('../models/todo');

beforeEach((done) => {
  // Make sure database is empty before every test
  Todo.remove({})
  .then(() => done());
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
      Todo.find().then(todos => {
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
        expect(todos.length).toBe(0);
        done()
      })
      .catch(err => done(err));
    });
  });
});