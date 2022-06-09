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

module.exports = {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
};
