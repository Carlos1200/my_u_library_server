const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwtGenerate = require("../helpers/jwtGenerate.helper");

const login = async (req, res,next) => {
    const {email, password} = req.body;
    try {
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (user.rows.length === 0) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const token = jwtGenerate(user.rows[0]);
        return res.status(200).json({
            message: "Login successful",
            token,
            user: user.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

const loggedIn = async (req, res,next) =>{
    const user=req.user;
    return res.status(200).json({
        message: "Login successful",
        user,
    });
} 

module.exports = {
    login,
    loggedIn
};