const { Router } = require("express");
const router = Router();
const grammarCheckerController = require("../controllers/grammarChecker.js");

//  ======================  Grammar Checker ====================
router.post("/", grammarCheckerController.checkText);
module.exports = router;
