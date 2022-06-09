const { Router } = require("express");
const { check, param } = require("express-validator");
const fieldValidation = require("../middlewares/fieldValidation.middleware");
const jwtVerify = require("../middlewares/jwtVerify.middleware");

const {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  updateBook,
} = require("../controllers/books.controller");

const router = Router();

router.post(
  "/",
  [
    jwtVerify,
    check("title").notEmpty().withMessage("Title is required"),
    check("authorId").notEmpty().withMessage("Author is required"),
    check("authorId").isArray().withMessage("Author must be an array"),
    check("authorId.*").isInt().withMessage("Author must be an integer"),
    check("genreId").notEmpty().withMessage("Genre is required"),
    check("genreId").isArray().withMessage("Genre must be an array"),
    check("genreId.*").isInt().withMessage("Genre must be an integer"),
    check("published_year")
      .notEmpty()
      .withMessage("Published year is required"),
    check("published_year")
      .isInt()
      .withMessage("Published year must be an integer"),
    check("stock").notEmpty().withMessage("Number in stock is required"),
    check("stock").isInt().withMessage("Number in stock must be an integer"),
    check("stock")
      .isInt({ min: 0 })
      .withMessage("Number in stock must be greater than 0"),
    fieldValidation,
  ],
  createBook
);

router.get("/", getBooks);

router.get(
  "/:id",
  [param("id").isInt().withMessage("Id must be an integer")],
  getBook
);

router.put(
  "/:id",
  [
    jwtVerify,
    param("id").isInt().withMessage("Id must be an integer"),
    check("title").notEmpty().withMessage("Title is required"),
    check("authorId").notEmpty().withMessage("Author is required"),
    check("authorId").isArray().withMessage("Author must be an array"),
    check("authorId.*").isInt().withMessage("Author must be an integer"),
    check("genreId").notEmpty().withMessage("Genre is required"),
    check("genreId").isArray().withMessage("Genre must be an array"),
    check("genreId.*").isInt().withMessage("Genre must be an integer"),
    check("published_year")
      .notEmpty()
      .withMessage("Published year is required"),
    check("published_year")
      .isInt()
      .withMessage("Published year must be an integer"),
    check("stock").notEmpty().withMessage("Number in stock is required"),
    check("stock").isInt().withMessage("Number in stock must be an integer"),
    check("stock")
      .isInt({ min: 0 })
      .withMessage("Number in stock must be greater than 0"),
    fieldValidation,
  ],
  updateBook
);

router.delete(
  "/:id",
  [jwtVerify, param("id").isInt().withMessage("Id must be an integer")],
  deleteBook
);

module.exports = router;
