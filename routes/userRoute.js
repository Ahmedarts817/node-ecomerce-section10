const express = require('express')
const router = express.Router();

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage
} = require('../services/userService')

router.route('/users').get(getUsers).post(uploadUserImage,resizeImage,createUser);
router.route('/users/id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router;