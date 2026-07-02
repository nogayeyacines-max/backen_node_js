const express = require("express");
const router = express.Router();
const {
  voterReponse,
  commenterReponse,
  modifierReponse,
  supprimerReponse,
} = require("../controller/reponseController");
const { protect } = require("../middlewares/user.middleware");

router.put("/:id", protect, modifierReponse);
router.delete("/:id", protect, supprimerReponse);
router.put("/:id/vote", protect, voterReponse);
router.post("/:id/commentaires", protect, commenterReponse);

module.exports = router;