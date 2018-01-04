const mongoose = require('mongoose');

mongoose.promise = global.Promise;  // Tell mongoose to use the built-in promise
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};