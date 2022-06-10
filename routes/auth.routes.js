const {Router} = require('express');
const {check} = require('express-validator');

const {login,loggedIn} = require('../controllers/auth.controller');
const jwtVerify = require('../middlewares/jwtVerify.middleware');
const router = Router();

router.post('/', [
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
],login);

router.get('/',[
    jwtVerify
],loggedIn);



module.exports = router;