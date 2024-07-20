const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const Items = require('../models/items');
const Bids = require('../models/bids');
const { Socket } = require('socket.io');
router.post('/login', async (req, res) => {

    try {
        const { email, name } = req.body; // Corrected to req.body instead of req.body()
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const response = await new Users({ email: email, name: name }).save(); // Ensure Users model is used correctly
        res.status(200).json({ response: response });
    } catch (err) {
        console.error("Internal error:", err);
        res.status(500).json({ err: "Internal error" });
    }
});
router.get('/lists', async (req, res) => {
    try {


        const response = await Items.find();
        if (response) {
            res.status(200).json({ response: response });
        }
    } catch (err) {
        console.error("Internal error:", err);
        console.log(err);
        res.status(500).json({ err: "Internal error" });
    }
});
router.post('/bid', async (req, res) => {
    try {

        const { amount, user_id, item_id } = req.body;
        const user = await Users.findById(user_id);
        const item = await Items.findById(item_id);
        if (user && item) {

            const bid = await new Bids({ amount, user_id, item_id, name: user.name }).save();
            const x = await Items.findByIdAndUpdate(item_id, { current_price: amount });

            res.status(200).json({ response: bid, k: amount });
        }
        else {
            res.status(400).json({ msg: "not gettinguser ot item" })
        }
    } catch (err) {
        console.error("Internal error:", err);
        res.status(500).json({ msg: "Internal server error" });
    };
});


router.post('/bidlist/:id', async (req, res) => {
    try {
        const { user_id } = req.body;
        const item_id = req.params.id;
        const bids = await Bids.find({ item_id: item_id }).sort({ 'timestamp': -1 }).limit(5);
        const user = await Users.findById(user_id);
        if (!user) {
            return res.status(400).json({ msg: "user id not get" })
        }
        res.status(200).json({ response: bids });

    } catch (err) {
        console.error("Internal error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
});
router.get('/mybid/:t', async (req, res) => {
    const user_id = req.params.t;
    try {


        let response = await Items.find({ user_id: user_id });
        if (response) {
            res.status(200).json({ response: response });
        }
    } catch (err) {
        console.error("Internal error:", err);
        console.log(err);
        res.status(500).json({ err: "Internal error" });
    }
});


router.delete('/del', async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ msg: "data not get" })

    }
    try {
        const response = await Items.findByIdAndDelete(data._id);
        if (response) {
            res.status(200).json({ response: response });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Internal error" });

    }
})
module.exports = router;
