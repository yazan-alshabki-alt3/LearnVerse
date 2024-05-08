const { Router } = require("express");
const router = Router();
const translateController = require("../controllers/translate.js");
const { translate_validator } = require("../middlewares/validator.js");
const { validationHandler } = require("../helpers/validation.js");

// ============= Translate Text And Get The Voice =============
router.post(
  "/",
  validationHandler(translate_validator),
  translateController.translateText
);
module.exports = router;
