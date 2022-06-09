const { Router } = require("express");
const { check, param } = require("express-validator");
const fieldValidation = require("../middlewares/fieldValidation.middleware");

const {
  createGenre,
  deleteGenre,
  getGenreById,
  getGenreByName,
  getGenres,
  updateGenre,
} = require("../controllers/genres.controller");

const router = Router();

router.post(
  "/",
  [check("name").notEmpty().withMessage("Name is required"), fieldValidation],
  createGenre
);

router.get("/", getGenres);

router.get(
  "/:id",
  [param("id").isInt().withMessage("Id must be an integer"), fieldValidation],
  getGenreById
);

router.put(
  "/:id",
  [
    check("name").notEmpty().withMessage("Name is required"),
    param("id").isInt().withMessage("Id must be an integer"),
    fieldValidation,
  ],
  updateGenre
);

router.delete(
  "/:id",
  [param("id").isInt().withMessage("Id must be an integer"), fieldValidation],
  deleteGenre
);

router.get(
  "/name/:name",
  [
    param("name").isString().withMessage("Name must be a string"),
    fieldValidation,
  ],
  getGenreByName
);

module.exports = router;
