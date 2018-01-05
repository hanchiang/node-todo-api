const mongoose = require('mongoose');

mongoose.promise = global.Promise;  // Tell mongoose to use the built-in promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};