express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
const path = require('path');
app.use(bodyParser.json()); // req.bodys
const Items = require('./models/items');
const Users = require('./models/users');
const cloudinary = require('./utili/cloudinary');
const Bids = require('./models/bids');
const pORT = process.env.PORT || 3000;


const userroutes = require('./routes/userroutes');

app.use('/User', userroutes);
app.use("/uploads", express.static('uploads'));

const multer = require('multer')
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});


const upload = multer({ storage: storage })


app.post('/uploads', upload.single('avatar'), async function (req, res) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
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



        const response = await new Items({ user_id: user_id, itemname: itemname, starting_price: starting_price, end_date: end_date, itemimage: link }).save();


        res.status(200).json({ response: response, });


    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "internal problem" })

    }


});

const server = app.listen(pORT, () => {
    console.log(pORT);
});
const io = require("socket.io")(server, {
    cors: {

        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on('connection', Socket => {
    Socket.send("ghii");
    Socket.on('Message', async (data) => {
        console.log(data);
        try {

            const user_id = data.user_id;
            const item_id = data.id;
            const bids = await Bids.find({ item_id: item_id }).sort({ 'timestamp': -1 }).limit(5);
            console.log(bids);
            const user = await Users.findById(user_id);
            if (!user) {
                Socket.emit('not');

            }
            if (bids) {
                Socket.emit('recieve', bids)
            }
        } catch (err) {
            console.error("Internal error:", err);
            Socket.send("problem")
        }
    })
});
