const express = require("express");
const router = express.Router();

const {
  getQuestions,
  getQuestionById,
  creerQuestion,
  modifierQuestion,
  supprimerQuestion,
  
  marquerMeilleureReponse,
} = require("../controller/questionController");

const { ajouterReponse } = require("../controller/reponseController");
const { protect } = require("../middlewares/user.middleware");

router.get("/", getQuestions);
// router.get("/:id", getQuestionById);
router.post("/", protect, creerQuestion);
router.put("/:id", protect, modifierQuestion);
router.delete("/:id", protect, supprimerQuestion);

router.put("/:id/meilleure-reponse", protect, marquerMeilleureReponse);
router.post("/:questionId/reponses", protect, ajouterReponse);

module.exports = router;