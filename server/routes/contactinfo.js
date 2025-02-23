const express = require('express');
const {updateContactInfo, createContactInfo} = require('../controllers/ContactInfo');
const {auth} = require('../middlewares/Auth');
const router = express.Router();
// add middle ware here
// router.put('/updatecontacts/:id', auth, updateContactInfo);
router.put('/update/:id', updateContactInfo);
router.post('/create/', auth, createContactInfo);
module.exports = router;
