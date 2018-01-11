const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

/*
 * Todos test
 */
describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect(response => {
      // Test response return correct body text
      expect(response.body.todo.text).toBe(text);
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(response => {
      expect(response.body.todos.length).toBe(1);
    }).end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should get todo with a id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(todos[0].text);
    }).end(done);
  });

  it('should not return todo created by other user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const id = new ObjectID().toString();
    request(app)
    .get(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 400 if id is invalid', (done) => {
    request(app)
    .get('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(400)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    const id = todos[0]._id.toString();

    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(response => {
      expect(response.body.todo._id).toBe(id);
    })
    .end((err, response) => {
      if (err) {
        return done(err);
      }

      Todo.findById(id)
      .then(todo => {
        expect(todo).toBeFalsy();
        done();
      })
      .catch(err => done(err));
    })
  });

  it('should not remove a todo created by other user', (done) => {
    const id = todos[0]._id.toString();

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, response) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(err => done(err));
      })
  });

  it('should return 404 if todo is not found', (done) => {
    const id = new ObjectID().toString();

    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 400 if ID is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
})

describe('PATCH /todos/:id', () => {
  it('should set completedAt when todo is completed', (done) => {
    const id = todos[0]._id.toString();
    const body = {
      text: 'Updated text!',
      completed: true
    };

    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .send(body)    
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(body.text);
      expect(response.body.todo.completed).toBe(true);
      expect(typeof response.body.todo.completedAt).toBe('number');
    })
    .end(done);
  });

  it('should not update todo created by other user', (done) => {
    const id = todos[0]._id.toString();
    const body = {
      text: 'Updated text!',
      completed: true
    };

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(body)
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    const id = todos[1]._id.toString();
    const body = {
      text: 'Updated text2!',
      completed: false
    };

    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth', users[1].tokens[0].token)
    .send(body)
    .expect(200)
    .expect(response => {
      expect(response.body.todo.text).toBe(body.text);
      expect(response.body.todo.completed).toBe(false);
      expect(response.body.todo.completedAt).toBeFalsy();
    })
    .end(done);
  })

  it('should return 404 if todo is not found', (done) => {
    const id = new ObjectID().toString();
    const body = {
      text: 'Updated text3!',
      completed: false
    };

    request(app)
    .patch(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 400 if ID is invalid', (done) => {
    const body = {
      text: 'Updated text4!',
      completed: false
    };

    request(app)
      .patch('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
});

/*
 * Users test
 */ 
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect(response => {
      expect(response.body._id).toBe(users[0]._id.toString());
      expect(response.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@test.com';
    const password = 'password';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect(response => {
      expect(response.headers['x-auth']).toBeTruthy();
      expect(response.body.user._id).toBeTruthy();
      expect(response.body.user.email).toBe(email);
    })
    .end(err => {
      if (err) {
        return done(err);
      }
      User.findOne({email}).then(user => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      })
      .catch(err => done(err));
    })
  });

  it('should return validation if request is invalid', (done) => {
    const email = '123';
    const password = '21';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    const email = 'authenticated@test.com';
    const password = '123456789';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect(response => {
      expect(response.headers['x-auth']).toBeTruthy();
    })
    .end((err, response) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then(user => {
        expect(user.toObject().tokens[1]).toMatchObject({
          access: 'auth',
          token: response.headers['x-auth']
        });
        done();
      }).catch(err => done(err));
    })
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: '1234556789'
    })
    .expect(400)
    .expect(response => {
      expect(response.headers['x-auth']).toBeFalsy();
    })
    .end((err, response) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then(user => {
        expect(user.tokens.length).toBe(1);
        done();
      })
      .catch(err => done(err));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove token on log out', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, response) => {
      if (err) {
        return done(err);
      }

      User.findById(users[0]._id).then(user => {
        expect(user.tokens.length).toBe(0);
        done();
      })
      .catch(err => done(err));
    })
  });
});