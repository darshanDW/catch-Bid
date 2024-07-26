const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const path = require('path');
app.use(bodyParser.json());
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

        const response = await new Items({
            user_id: user_id,
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
    socket.on('join_room', (data) => {
        const { item_id } = data;
        socket.join(item_id);
        socket.send("Connected to room");

        socket.on('bid', async (data) => {
            console.log(data);
            const dat = JSON.parse(data);
            try {
                const user = await Users.findById(dat.user_id);
                const item = await Items.findById(dat.item_id);
                if (user && item) {
                    const bid = await new Bids({ amount: dat.amount, user_id: dat.user_id, item_id: dat.item_id, name: user.name }).save();
                    await Items.findByIdAndUpdate(dat.item_id, { current_price: dat.amount });

                    io.to(dat.item_id).emit('getbid', { bid, k: dat.amount });
                    console.log(3);
                }
            } catch (err) {
                console.error("Internal error:", err);
            }
        });

        socket.on('Message', async (data) => {
            try {
                const user_id = data.user_id;
                const item_id = data.item_id;

                const bids = await Bids.find({ item_id: item_id }).sort({ 'timestamp': -1 }).limit(5);
                const user = await Users.findById(user_id);
                if (!user) {
                    socket.emit('user_not_found', { message: 'User not found', user_id });
                    return;
                }

                if (bids.length > 0) {
                    socket.emit('bids_retrieved', { bids });
                } else {
                    socket.emit('no_bids_found', { message: 'No bids found for this item', item_id });
                }
            } catch (err) {
                console.error("Internal error:", err);
                socket.emit('error', { message: 'Internal server error', error: err.message });
            }
        });
    });
});
