const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const Items = require('../models/items');
const Bids = require('../models/bids');
const { Socket } = require('socket.io');
router.post('/login', async (req, res) => {
    console.log(2)
    try {
        console.log(req.body)
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const user = await Users.findOne({ email: email });
        console.log(user);
        if (user) {
            res.status(200).json({ response: user });
        }
        if (!user) {
            const response = await new Users({ email: email, name: name }).save(); // Ensure Users model is used correctly
            console.log(response);
            res.status(200).json({ response: response });
        }
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
