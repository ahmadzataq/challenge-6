const multer = require('multer');
const path = require('path');

const filename = (req, file, callback) => {
    let fileName = Date.now() + path.extname(file.originalname);
    callback(null, fileName);
};

const generateFileFilter = (mimetypes) => {
    return (req, file, callback) => {
        if (mimetypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            let err = new Error(`Only ${mimetypes} are allowed to upload!`);
            callback(err, false);
        }
    };
};

module.exports = {
    artimg: multer({
        fileFilter: generateFileFilter([
            'image/png',
            'image/jpg',
            'image/jpeg'
        ]),
        onError: (err, next) => {
            next(err);
        }
    })
};