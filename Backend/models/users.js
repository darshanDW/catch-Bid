const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: { type: String },
    name: { type: String }


}


);

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
