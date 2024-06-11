const mongoose = require('mongoose');

const bidsSchema = new mongoose.Schema({

    amount: {
        type: Number,
    },
    user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    item_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Items'
    }],
    timestamp: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    }

});

const Bids = mongoose.model('Bids', bidsSchema);

module.exports = Bids;
