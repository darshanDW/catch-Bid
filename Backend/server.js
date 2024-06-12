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
    cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error"
            })
        }

        res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result
        })
    })
    try {
        const link = result.secure_url;


        const { user_id, end_date, itemname, starting_price } = req.body;



        const response = await new Items({ user_id: user_id, itemname: itemname, starting_price: starting_price, end_date: end_date, itemimage: link }).save();


        res.status(200).json({ response: response });


    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "internal problem" })

    }


});

app.listen(3001, () => {
    console.log(pORT);
})