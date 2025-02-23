const express = require('express');
const {updateUser , getCurrentUser} = require('../controllers/User');
const {auth} = require('../middlewares/Auth');
const router = express.Router();

router.put('/update/:id', auth, updateUser);

module.exports = router;
