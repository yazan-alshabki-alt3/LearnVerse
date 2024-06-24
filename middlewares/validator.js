const { body } = require("express-validator");

const {
  existingEmail,
  titleCase,
  validatePhoto,
  validateVideo,
  existingCategory,
} = require("../helpers/validation.js");

const register_user_validator = [
  body("firstName")
    .exists()
    .withMessage("First Name is required")
    .notEmpty()
    .withMessage("First Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),

  body("lastName")
    .exists()
    .withMessage("Last Name is required")
    .notEmpty()
    .withMessage("Last Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),

  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid")
    .custom(existingEmail),


  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];


const login_user_validator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];


const update_user_validator = [
  body("firstName")
    .exists()
    .withMessage("First Name is required")
    .notEmpty()
    .withMessage("First Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),
  body("lastName")
    .exists()
    .withMessage("Last Name is required")
    .notEmpty()
    .withMessage("Last Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),
  body("photo")
    .custom(validatePhoto)
    .withMessage("Photo is required with correct type"),
];

const translate_validator = [
  body("language")
    .exists()
    .withMessage("language Name is required")
    .notEmpty()
    .withMessage("language cannot be empty")
    .trim(),
  body("text")
    .exists()
    .withMessage("text is required")
    .notEmpty()
    .withMessage("text cannot be empty")
    .trim(),
];


const add_update_course_validator = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .trim()
    .customSanitizer(titleCase),
  body("level")
    .exists()
    .withMessage("Level is required")
    .notEmpty()
    .withMessage("Level cannot be empty"),
  body("description")
    .exists()
    .withMessage("Description is required")
    .notEmpty()
    .withMessage("Description cannot be empty")
]

const add_update_question_validator = [

  body("level")
    .exists()
    .withMessage("Level is required")
    .notEmpty()
    .withMessage("Level cannot be empty"),
  body("question")
    .exists()
    .withMessage("Question is required")
    .notEmpty()
    .withMessage("Question cannot be empty"),
  body("A")
    .exists()
    .withMessage("A is required")
    .notEmpty()
    .withMessage("A cannot be empty"),
  body("B")
    .exists()
    .withMessage("B is required")
    .notEmpty()
    .withMessage("B cannot be empty"),
  body("C")
    .exists()
    .withMessage("C is required")
    .notEmpty()
    .withMessage("C cannot be empty"),
  body("D")
    .exists()
    .withMessage("D is required")
    .notEmpty()
    .withMessage("D cannot be empty"),
  body("answer")
    .exists()
    .withMessage("answer is required")
    .notEmpty()
    .withMessage("answer cannot be empty"),

]


const add_video_validator = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim()
    .customSanitizer(titleCase),

  body("courseId")
    .exists()
    .withMessage("CourseId is required")
    .notEmpty()
    .withMessage("CourseId cannot be empty")
    .trim(),
  body("video")
    .custom(validateVideo)
    .withMessage("Video is required with correct type"),
];

const update_video_validator = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim(),
  body("videoId")
    .exists()
    .withMessage("Video Id is required")
    .notEmpty()
    .withMessage("Video Id cannot be empty")
    .trim(),
  body("video")
    .custom(validateVideo)
    .withMessage("Video is required with correct type"),
];
const add_vocabulary_validator = [
  body("A")
    .exists()
    .withMessage("A is required")
    .notEmpty()
    .withMessage("A cannot be empty"),
  body("B")
    .exists()
    .withMessage("B is required")
    .notEmpty()
    .withMessage("B cannot be empty"),
  body("C")
    .exists()
    .withMessage("C is required")
    .notEmpty()
    .withMessage("C cannot be empty"),
  body("D")
    .exists()
    .withMessage("D is required")
    .notEmpty()
    .withMessage("D cannot be empty"),
  body("answer")
    .exists()
    .withMessage("answer is required")
    .notEmpty()
    .withMessage("answer cannot be empty"),
  body("categoryId")
    .exists()
    .withMessage("category Id is required")
    .notEmpty()
    .withMessage("category Id cannot be empty")
    .trim(),
  body("photo")
    .custom(validatePhoto)
    .withMessage("Photo is required with correct type"),

]
const update_vocabulary_validator = [
  body("A")
    .exists()
    .withMessage("A is required")
    .notEmpty()
    .withMessage("A cannot be empty"),
  body("B")
    .exists()
    .withMessage("B is required")
    .notEmpty()
    .withMessage("B cannot be empty"),
  body("C")
    .exists()
    .withMessage("C is required")
    .notEmpty()
    .withMessage("C cannot be empty"),
  body("D")
    .exists()
    .withMessage("D is required")
    .notEmpty()
    .withMessage("D cannot be empty"),
  body("answer")
    .exists()
    .withMessage("answer is required")
    .notEmpty()
    .withMessage("answer cannot be empty"),
  body("vocabularyId")
    .exists()
    .withMessage("vocabulary Id is required")
    .notEmpty()
    .withMessage("vocabulary Id cannot be empty")
    .trim(),
  body("photo")
    .custom(validatePhoto)
    .withMessage("Photo is required with correct type"),
]

const add_category_validator = [
  body("name")
    .exists()
    .withMessage("name is required")
    .notEmpty()
    .withMessage("name cannot be empty")
    .trim()
    .customSanitizer(titleCase)
    .custom(existingCategory),
]
module.exports = {
  update_user_validator, // user
  login_user_validator, // user
  register_user_validator, // user
  translate_validator, // translate
  add_update_course_validator, // course 
  add_update_question_validator, // question 
  add_video_validator, // add video 
  update_video_validator, // update video
  add_vocabulary_validator, // add vocabulary
  update_vocabulary_validator, // update vocabulary
  add_category_validator // add category
};