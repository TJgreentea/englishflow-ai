const express = require("express");
const {
  getAllWords,
  getWordById,
  getDailyWords,
  getWordFamilyGroup,
} = require("../controllers/vocabularyController");

const router = express.Router();

router.get("/", getAllWords);
router.get("/daily", getDailyWords);
router.get("/:id/family-group", getWordFamilyGroup);
router.get("/:id", getWordById);

module.exports = router;
