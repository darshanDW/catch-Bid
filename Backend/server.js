const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
app.use(cors());
app.use(express.json());
ObjectId = require('mongodb').ObjectId;
const path = require('path');
const Items = require('./models/items');
const Users = require('./models/users');
const cloudinary = require('./utili/cloudinary');
const Bids = require('./models/bids');
const PORT = process.env.PORT || 3000;

const userroutes = require('./routes/userroutes');

app.use('/User', userroutes);
app.use("/uploads", express.static('uploads'));

const multer = require('multer');
const storage = multer.diskStorage({

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/uploads', upload.single('avatar'), async function (req, res) {
    console.log(req.body);

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        const link = uploadResult.secure_url;
        console.log(link);

        const { user_id, end_date, itemname, starting_price } = req.body;
console.log(user_id)
        const response = await new Items({
            user_id: new ObjectId(user_id),
            itemname: itemname,
            starting_price: starting_price,
            end_date: end_date,
            itemimage: link
        }).save();

        res.status(200).json({ response: response });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "internal problem" });
    }
});

const server = app.listen(PORT, () => {
    console.log(PORT);
});

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('join_room', (data) => {
        console.log("User joined room:", data);
        const { item_id } = data;
        socket.join(item_id);
        socket.send("Connected to room");

        socket.on('bid', async (data) => {
            console.log("Bid data received:", data);
            try {
                // Parse and validate the incoming data
                const { user_id, item_id, amount } = JSON.parse(data);
                if (!user_id || !item_id || !amount) {
                    console.error("Invalid bid data:", data);
                    return;
                }

                // Fetch user and item data in parallel
                const [user, item] = await Promise.all([
                    Users.findById(user_id).select('name'),
                    Items.findById(item_id).select('current_price')
                ]);

                if (!user || !item) {
                    console.error("User or Item not found:", { user_id, item_id });
                    return;
                }

                // Save the bid and update the item concurrently
                const [bid] = await Promise.all([
                    new Bids({ amount, user_id, item_id, name: user.name }).save(),
                    Items.findByIdAndUpdate(item_id, { current_price: amount })
                ]);

                // Emit the updated bid to the relevant room
                io.to(item_id).emit('getbid', { bid, currentPrice: amount });
            } catch (err) {
                console.error("Error processing bid:", err);
            }
        });


        socket.on('Message', async (data) => {
            console.log(1)
            try {
                const { user_id, item_id } = data;
console.log(user_id)
                // Input validation
                if (!user_id || !item_id) {
                    socket.emit('error', { message: 'Invalid input: user_id and item_id are required' });
                    return;
                }

                // Parallelize database queries for better performance
                const [user, bids] = await Promise.all([
                    Users.findById(user_id),
                    Bids.find({ item_id }).sort({ timestamp: -1 }).limit(5)
                ]);
                // Check if user exists
                if (!user) {
                    socket.emit('user_not_found', { message: 'User not found', user_id });
                    return;
                }

                // Emit response based on bid results
                if (bids.length > 0) {
                    socket.emit('bids_retrieved', { bids });
                } else {
                    socket.emit('no_bids_found', { message: 'No bids found for this item', item_id });
                }
            } catch (err) {
                console.error('Internal error:', err);
                socket.emit('error', { message: 'Internal server error', error: err.message });
            }
        });

    });
});
