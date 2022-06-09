const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwtGenerate = (user) => {
    const token = jwt.sign({
        id: user.id,
    }, process.env.JWT_SECRET, {
        expiresIn: '2h',
    });

    return token;
}

module.exports = jwtGenerate;