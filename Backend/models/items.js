const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
    itemname: {
        type: String
    },
    itemimage: {
        type: String
    },
      
    
    starting_price: { type: Number },
current_price: {
        type: Number,
        default: function () { return this.starting_price },
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



},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }}
);
  itemsSchema.virtual('bid_interval').get(function () {
    const price = this.current_price;

    if (price < 1000) return 10;
    if (price < 5000) return 50;
    if (price < 10000) return 100;
    if (price < 50000) return 500;
    return 1000;
});
const Items = mongoose.model('Items', itemsSchema);

module.exports = Items;
