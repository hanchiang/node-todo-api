const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc';
bcrypt.genSalt(10, (err, salt) => {
  console.log(salt);
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashedPassword = '$2a$10$8iape2AXuNGzDXgHQV8/2etNwEHMmBlpsGJ79eunRYFHgNaRMFL26';
bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log(result);
});

// let data = {
//   id: 10
// };

// let token = jwt.sign(data, '123abc')
// console.log(token);

// let decoded = jwt.verify(token, '123abc');
// console.log('Decoded:', decoded);


// let message = 'I am user one';
// let hash = SHA256(message).toString();
// console.log('Message:', message);
// console.log('Hash:', hash);

// let data = {
//   id: 4
// };

// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };


// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed');
// }