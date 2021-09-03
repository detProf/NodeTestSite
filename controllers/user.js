const path = require('path');
const User = require('../models/userdata');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

let upload = multer({ storage: storage });

// returns all users from 'user/', GET
const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// returns specific user from 'user/:username', GET
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (user !== undefined) {
            if (Date(user.idInfo.expiration) < Date.now && Date(user.medRecInfo.expiration) < Date.now)
                res.status(200).json({
                    error: "Expired Documents",
                    message: `${user.username}'s ID has expired! User medical recommendation has expired!`,
                    user
                });

            else if (Date(user.idInfo.expiration) < Date.now)
                res.status(200).json({
                    error: "Expired Document",
                    message: `${user.username}'s ID has expired!`,
                    user
                });

            else if (Date(user.medRecInfo.expiration) < Date.now)
                res.status(200).json({
                    error: "Expired Document",
                    message: `${user.username}'s medical recommendation has expired!`,
                    user
                });

            else
                res.status(200).json(user);
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// adds a user to the DB from 'user/add/', POST
const addUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ userId: req.body.username });
        if (existingUser === null) {
            const newUser = new User({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                birthDate: req.body.birthDate,
                idInfo: {
                    number: req.body.idInfo_number,
                    expiration: req.body.idInfo_expiration,
                    stateProvince: req.body.idInfo_stateProvince,
                    imgPath: req.files[0].path + "_" + req.files[0].originalname
                },
                medRecInfo: {
                    number: req.body.medRecInfo_number,
                    issuer: req.body.medRecInfo_issuer,
                    expiration: req.body.medRecInfo_expiration,
                    stateProvince: req.body.medRecInfo_stateProvince,
                    imgPath: req.files[1].path + "_" + req.files[1].originalname
                }
            })

            await newUser.save();
            upload.array("files");

            res.status(201).json(newUser);
        }
        res.status(200).json({ message: "Username is taken!" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// updates user data from 'user/' + JSON body, PATCH
const updateUser = async (req, res) => {
    const updateId = req.body.username;
    try {
        await User.findOneAndUpdate(
            { username: updateId },
            { useFindAndModify: false },
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                birthDate: req.body.birthDate,
                idInfo: {
                    number: req.body.idInfo_number,
                    expiration: req.body.idInfo_expiration,
                    stateProvince: req.body.idInfo_stateProvince,
                    imgPath: req.files[0].path + "_" + req.files[0].originalname
                },
                medRecInfo: {
                    number: req.body.medRecInfo_number,
                    issuer: req.body.medRecInfo_issuer,
                    expiration: req.body.medRecInfo_expiration,
                    stateProvince: req.body.medRecInfo_stateProvince,
                    imgPath: req.files[1].path + "_" + req.files[1].originalname
                }
            })
        res.status(202).json({ message: `Updated user: ${updateId}!` });

    } catch (error) {
        res.status(418).json({ message: error.message });
    }
}

// removes a user from the db 'user/remove/' + username Param, DELETE
const deleteUser = async (req, res) => {
    const deleteId = req.param('username');
    try {
        await User.findOneAndRemove(
            { username: deleteId },
            { useFindAndModify: false });
        res.status(200).json({ message: `Deleted user: ${deleteId}!` });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// TODO: fix this up with the front end
const uploadImage = async (req, res) => {
    const uploadId = req.body.username;
    try {
        const userData = await User.findOne({ username: uploadId });
        userData.medRecInfo.imgPath = `\\uploads\\${req.file.originalname}`;

        res.status(200).json({ message: `Successfully uploaded ${req.file.originalname} to '${__dirname}${userData.medRecInfo.imgPath}'` });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.uploadImage = uploadImage;