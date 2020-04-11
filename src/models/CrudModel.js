const mongoose = require('mongoose');

const CrudSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
})

const Crud = mongoose.model('crud', CrudSchema);
module.exports = Crud;