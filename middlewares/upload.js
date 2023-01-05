const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${Math.floor((Math.random() * 10000))}${path.extname(file.originalname)}`
        )
    }
})

const upload = multer({
    storage
})

module.exports = upload