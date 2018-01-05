const { User } = require('../models/user');

let authenticate = (request, response, next) => {
  const token = request.header('x-auth');

  User.findByToken(token).then(user => {
    if (!user) {
      return Promise.reject();
    }
    request.user = user;
    request.token = token;
    next();
  })
    .catch(err => response.status(401).send(err));
};

module.exports = {
  authenticate
};