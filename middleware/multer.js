const multer = require('multer')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.originalUrl.startsWith('/user')) {
            cb(null, './uploads/user');
        }
        if (req.originalUrl.startsWith('/task')) {
            cb(null, './uploads/task');
        }
        if (req.originalUrl.startsWith('/subtask')) {
            cb(null, './uploads/subtask');
        }
    },
    filename: (req, file, cb) => {
        cb(null, crypto.randomBytes(15).toString('hex') + '.jpg')
    }
})

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 7 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Wrong filetype uploaded'))
        }
    },
})
