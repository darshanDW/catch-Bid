const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
    itemname: {
        type: String
    },
    itemimage: {
        type: String
    },
      
    current_price: {
        type: Number,
        default: function () { return this.starting_price },
    },
    starting_price: { type: Number },
    bid_interval: {
        type: Number,
        default: 10
    },
    end_date: { type: Date },
    Status: {
        type: String,
        default: "on"
    },
    winner: {
        type: String,
        default: ""
    },
    user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]



});

const Items = mongoose.model('Items', itemsSchema);

module.exports = Items;
