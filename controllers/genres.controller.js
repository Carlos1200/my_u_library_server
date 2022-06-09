const pool = require("../db");

const getGenres = async (req, res, next) => {
  try {
    const genres = await pool.query("SELECT * FROM genres");
    res.status(200).json(genres.rows);
  } catch (error) {
    next(error);
  }
};

const createGenre = async (req, res, next) => {
  try {
    const { name } = req.body;
    const genre = await pool.query(
      "INSERT INTO genres(name) VALUES($1) RETURNING *",
      [name]
    );
    res.status(201).json(genre.rows[0]);
  } catch (error) {
    next(error);
  }
};

const updateGenre = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const genre = await pool.query(
      "UPDATE genres SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );
    res.status(200).json(genre.rows[0]);
  } catch (error) {
    next(error);
  }
};

const deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    const genre = await pool.query(
      "DELETE FROM genres WHERE id=$1 RETURNING *",
      [id]
    );
    res.status(200).json(genre.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getGenreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const genre = await pool.query("SELECT * FROM genres WHERE id=$1", [id]);
    res.status(200).json(genre.rows[0]);
  } catch (error) {
    next(error);
  }
};

const getGenreByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const genres = await pool.query(
      "SELECT * FROM genres WHERE LOWER(name) LIKE LOWER($1)",
      ["%" + name + "%"]
    );
    res.status(200).json(genres.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGenre,
  deleteGenre,
  getGenreById,
  getGenreByName,
  getGenres,
  updateGenre,
};
