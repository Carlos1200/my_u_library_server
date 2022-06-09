const pool = require("../db");

const getAuthors = async (req, res, next) => {
  try {
    const authors = await pool.query("SELECT * FROM authors");
    res.status(200).json(authors.rows);
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const { name } = req.body;
    const author = await pool.query(
      "INSERT INTO authors(name) VALUES($1) RETURNING *",
      [name]
    );
    res.status(201).json(author.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const author = await pool.query(
      "UPDATE authors SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );
    res.status(200).json(author.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await pool.query(
      "DELETE FROM authors WHERE id=$1 RETURNING *",
      [id]
    );
    res.status(200).json(author.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await pool.query("SELECT * FROM authors WHERE id=$1", [id]);
    res.status(200).json(author.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getAuthorByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const author = await pool.query(
        "SELECT * FROM authors WHERE LOWER(name) LIKE LOWER($1)",
        ["%" + name + "%"]
    );
    res.status(200).json(author.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  getAuthorByName,
  getAuthors,
  updateAuthor,
};
