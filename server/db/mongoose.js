const mongoose = require('mongoose');

mongoose.promise = global.Promise;  // Tell mongoose to use the built-in promise
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};