const { Router } = require("express");
const { check, param } = require("express-validator");

const fieldValidation = require("../middlewares/fieldValidation.middleware");
const jwtVerify = require("../middlewares/jwtVerify.middleware");

const {
  changePassword,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} = require("../controllers/users.controller");

const router = Router();

router.post(
  "/",
  [
    jwtVerify,
    check("first_name").notEmpty().withMessage("First name is required"),
    check("last_name").notEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("role").notEmpty().withMessage("Role is required"),
    check("role").isIn(["Student", "Librarian"]).withMessage("Role is invalid"),
    fieldValidation,
  ],
  createUser
);

router.get("/", getUsers);

router.get(
  "/:id",
  [param("id").isInt().withMessage("Id must be an integer"), fieldValidation],
  getUserById
);

router.put(
  "/password",
  [
    jwtVerify,
    check("oldPassword").notEmpty().withMessage("Old password is required"),
    check("newPassword").notEmpty().withMessage("New password is required"),
    fieldValidation,
  ],
  changePassword
);

router.put(
  "/:id",
  [
    check("first_name").notEmpty().withMessage("First name is required"),
    check("last_name").notEmpty().withMessage("Last name is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("role").notEmpty().withMessage("Role is required"),
    check("role").isIn(["Student", "Librarian"]).withMessage("Role is invalid"),
    param("id").isInt().withMessage("Id must be an integer"),
    fieldValidation,
  ],
  updateUser
);



router.delete(
  "/:id",
  [
    jwtVerify,
    param("id").isInt().withMessage("Id must be an integer"),
    fieldValidation,
  ],
  deleteUser
);

module.exports = router;
