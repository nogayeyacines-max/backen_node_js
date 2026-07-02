const Reponse = require("../models/reponse.model");
const Question = require("../models/question.model");

// POST /api/questions/:questionId/reponses
exports.ajouterReponse = async (req, res) => {
  try {
    const { contenu } = req.body;
    if (!contenu) {
      return res.status(400).json({ message: "Le contenu est obligatoire" });
    }

    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question introuvable" });
    }

    const reponse = new Reponse({
      contenu,
      question: question._id,
      auteur: req.user.id,
    });

    await reponse.save();

    const populated = await reponse.populate("auteur", "nom email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// PUT /api/reponses/:id
exports.modifierReponse = async (req, res) => {
  try {
    const reponse = await Reponse.findById(req.params.id);
    if (!reponse) return res.status(404).json({ message: "Réponse introuvable" });
    if (reponse.auteur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Tu ne peux modifier que tes propres réponses" });
    }

    const { contenu } = req.body;
    if (!contenu) return res.status(400).json({ message: "Contenu requis" });

    reponse.contenu = contenu;
    await reponse.save();

    const populated = await reponse.populate("auteur", "nom email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// DELETE /api/reponses/:id
exports.supprimerReponse = async (req, res) => {
  try {
    const reponse = await Reponse.findById(req.params.id);
    if (!reponse) return res.status(404).json({ message: "Réponse introuvable" });
    if (reponse.auteur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Tu ne peux supprimer que tes propres réponses" });
    }

    await reponse.deleteOne();
    res.json({ message: "Réponse supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// PUT /api/reponses/:id/vote
exports.voterReponse = async (req, res) => {
  try {
    const reponse = await Reponse.findById(req.params.id);
    if (!reponse) return res.status(404).json({ message: "Réponse introuvable" });

    const { value } = req.body;
    if (value !== 1 && value !== -1) {
      return res.status(400).json({ message: "Valeur de vote invalide" });
    }

    const dejaVote = reponse.votedBy.find((v) => v.user.toString() === req.user.id);

    if (dejaVote) {
      reponse.votes -= dejaVote.value;
      dejaVote.value = value;
      reponse.votes += value;
    } else {
      reponse.votedBy.push({ user: req.user.id, value });
      reponse.votes += value;
    }

    await reponse.save();
    res.json(reponse);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// POST /api/reponses/:id/commentaires
exports.commenterReponse = async (req, res) => {
  try {
    const reponse = await Reponse.findById(req.params.id);
    if (!reponse) return res.status(404).json({ message: "Réponse introuvable" });

    const { contenu } = req.body;
    if (!contenu) return res.status(400).json({ message: "Contenu requis" });

    const commentaire = {
      contenu,
      auteur: req.user.id,
    };

    reponse.commentaires.push(commentaire);
    await reponse.save();

    const populated = await reponse.populate("commentaires.auteur", "nom email");
    const dernierCommentaire = populated.commentaires[populated.commentaires.length - 1];

    res.status(201).json(dernierCommentaire);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};