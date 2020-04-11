const mongoose = require('mongoose');

const URI = 'mongodb://localhost/dbcrud';

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const connection = mongoose.connection;

connection.openUri('open', () => {
  console.log('DB is connected');
});