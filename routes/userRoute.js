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
const {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    deleteUserValidator,
}= require('../utils/validators/userValidator')

router.route('/').get(getUsers).post(createUserValidator,createUser);
router.route('/:id').get(getUserValidator,getUser).put(updateUserValidator,updateUser).delete(deleteUserValidator,deleteUser)

module.exports = router;