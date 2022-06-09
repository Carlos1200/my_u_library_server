const {Router} = require('express');
const {check} = require('express-validator');

const {login} = require('../controllers/auth.controller');
const router = Router();

router.post('/', [
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
],login);



module.exports = router;