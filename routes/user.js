const express = require('express');

const multer = require('multer');

const userCon = require('../controllers/user');
const router = express.Router();

express().use(express.json());
express().use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

let upload = multer({ storage: storage });

// TODO: clean these routes
router.get('/', userCon.getUsers);
router.get('/:username', userCon.getUser);
router.post('/', upload.any(), userCon.addUser);
router.patch('/', userCon.updateUser);
router.delete('/', userCon.deleteUser);

router.post('/upload', upload.any(), userCon.uploadImage);

module.exports = router;