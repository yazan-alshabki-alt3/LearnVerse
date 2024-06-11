const { Router } = require("express");
const router = Router();
const dictionaryController = require("../controllers/dictionary.js");

// ============= dictionary words =============
router.post(
  "/",
  dictionaryController.searchDefinition
);
module.exports = router;
