const { hash } = require('bcrypt');
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },


}


);

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
