const multer = require('multer');
const { storage } = require('../Config/config');

const upload = multer({ storage });

module.exports = upload;