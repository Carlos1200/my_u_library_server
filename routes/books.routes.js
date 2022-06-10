const { Router } = require("express");
const { check, param,query } = require("express-validator");
const fieldValidation = require("../middlewares/fieldValidation.middleware");
const jwtVerify = require("../middlewares/jwtVerify.middleware");

const {
  checkOutBook,
  createBook,
  deleteBook,
  getBook,
  getBooks,
  getBooksByFilter,
  getBorrowedUser,
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
  "/filter",
  [
    query("title").optional().isString().withMessage("Title must be a string"),
    query("authorName").optional().isString().withMessage("Author name must be a string"),
    query("genreName").optional().isString().withMessage("Genre name must be a string"),
    fieldValidation
  ],
  getBooksByFilter
);

router.get(
  "/borrow",
  getBorrowedUser
)

router.get(
  "/:id",
  [param("id").isInt().withMessage("Id must be an integer")],
  getBook
);

router.put(
  "/borrow/:id",
  [
    jwtVerify,
    param("id").isInt().withMessage("Id must be an integer"),
    fieldValidation,
  ],checkOutBook
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
