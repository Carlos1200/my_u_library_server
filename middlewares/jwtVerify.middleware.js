const pool = require("../db");
const jwt = require('jsonwebtoken');

const jwtVerify = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({
            message: 'No token, authorization denied'
        });
    }
    try {
        const {id}= jwt.verify(token, process.env.JWT_SECRET);
        const user = pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        if (user.rows.length === 0) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        if(user.rows[0].role !== 'Librarian'){
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        next();

    } catch (err) {
        res.status(401).json({
            message: 'Token is not valid'
        });
    }
}

module.exports = jwtVerify;
