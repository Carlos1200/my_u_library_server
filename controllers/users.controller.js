const pool = require("../db");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res, next) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.status(200).json(users.rows);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, role } = req.body;
    const userReq=req.user;

    if(userReq.role!=='Librarian'){
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    //creating a default password
    const password = "password";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await pool.query(
      "INSERT INTO users(first_name,last_name,email,role,password) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [first_name, last_name, email, role,hashedPassword]
    );
    res.status(200).json(user.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, role } = req.body;
    const user = await pool.query(
      "UPDATE users SET first_name=$1,last_name=$2,email=$3,role=$4 WHERE id=$5 RETURNING *",
      [first_name, last_name, email, role, req.params.id]
    );
    res.status(200).json(user.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userReq=req.user;

    if(userReq.role!=='Librarian'){
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const user = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [
      req.params.id,
    ]);
    res.status(200).json(user.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id=$1", [
      req.params.id,
    ]);
    res.status(200).json(user.rows[0]);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userCtx = req.user; 
    const user = await pool.query(
      "SELECT * FROM users WHERE id=$1",
      [userCtx.id]
    );
    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const userUpdate = await pool.query(
      "UPDATE users SET password=$1 WHERE id=$2 RETURNING *",
      [hashedPassword, userCtx.id]
    );
    res.status(200).json(userUpdate.rows[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  changePassword,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
};
