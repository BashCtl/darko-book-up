// Method for upload file
const multer = require("multer");

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match('\.(jpg|jpeg|png)$')) {
            return callback(new Error('Please upload jpg, jepg, or png file!'))
        }
        callback(undefined, true)
    }
})

module.exports = upload
