const express = require('express');
const router = express.Router();

const get_all_users = require('./users/get_all_users')
const create_student = require('./users/create_student')

//router.get('/authorize', messenger_platform.authorize);

router.get('/users', get_all_users);
router.post('/users', create_student);

module.exports = router;