
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: "dqmn9cswk", 
    api_key: "817661878923174", 
    api_secret: "ngj8eq0NZeocBEOfRe8V9Prkz8w" // Click 'View Credentials' below to copy your API secret
});
module.exports = cloudinary;