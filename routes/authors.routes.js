const {Router} = require("express");
const {check,param} = require("express-validator");
const fieldValidation = require("../middlewares/fieldValidation.middleware");

const {
    createAuthor,
    deleteAuthor,
    getAuthorById,
    getAuthorByName,
    getAuthors,
    updateAuthor,
}=require("../controllers/authors.controller");

const router = Router();

router.post('/',[
    check('name').notEmpty().withMessage("Name is required"),
    fieldValidation
],createAuthor);

router.get('/',getAuthors);

router.get('/:id',[
    param('id').isInt().withMessage("Id must be an integer"),
    fieldValidation
],getAuthorById);

router.put('/:id',[
    check('name').notEmpty().withMessage("Name is required"),
    param('id').isInt().withMessage("Id must be an integer"),
    fieldValidation
],updateAuthor);

router.delete('/:id',[
    param('id').isInt().withMessage("Id must be an integer"),
    fieldValidation
],deleteAuthor);

router.get('/name/:name',[
    param('name').isString().withMessage("Name must be a string"),
    fieldValidation
],getAuthorByName);


module.exports = router;