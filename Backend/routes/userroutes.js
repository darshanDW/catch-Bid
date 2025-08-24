const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const Items = require('../models/items');
const Bids = require('../models/bids');
const { Socket } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// router.post('/login', async (req, res) => {
//     console.log(2)
//     try {
//         console.log(req.body)
//         const { email, name } = req.body;
//         if (!email) {
//             return res.status(400).json({ error: "Email is required" });
//         }
//         const user = await Users.findOne({ email: email });
//         console.log(user);
//         if (user) {
//             res.status(200).json({ response: user });
//         }
//         if (!user) {
//             const response = await new Users({ email: email, name: name }).save(); // Ensure Users model is used correctly
//             console.log(response);
//             res.status(200).json({ response: response });
//         }
//     } catch (err) {
//         console.error("Internal error:", err);
//         res.status(500).json({ err: "Internal error" });
//     }
// });
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


router.get('/bids/:itemId',async(req, res) => {

try {
    const itemId = req.params.itemId;
    if (!itemId) {
        return res.status(400).json({ error: "Item ID is required" });
    }
    const response = await Bids.find({ item_id: itemId }).limit(5).sort({ timestamp: -1 });
    if (response) {
        res.status(200).json({ response: response });
    }
} catch (err) {
    console.error("Internal error:", err);
    res.status(500).json({ err: "Internal error" });
}


})
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
    console.log("data", data);
    if (!data || !data.itemId) {
        return res.status(400).json({ msg: "Missing itemId" });
    }

    try {
        const response = await Items.findByIdAndDelete(data.itemId);
        if (response) {
            res.status(200).json({ response });
        } else {
            res.status(404).json({ msg: "Item not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Internal error" });
    }
});


// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({ email, password: hashedPassword, name });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Signin route
router.post('/signin', async (req, res) => {

    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(user);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id, name: user.name, email: user.email });
    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch item details by item_id
router.get('/Item/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
    const item = await Items.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
console.log(item.bid_interval);
        res.status(200).json({ response: item });
    } catch (err) {
        console.error('Error fetching item:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
