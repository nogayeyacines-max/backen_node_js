const Question = require("../models/question.model");
const Reponse = require("../models/reponse.model");
const User = require("../models/user.model");

// GET /api/questions
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate("auteur", "nom email") 
            .sort({ createdAt: -1 }); 

        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// GET /api/questions/:id
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("auteur", "nom email")
      .populate("meilleureReponse");

    if (!question) {
      return res.status(404).json({ message: "Question introuvable" });
    }

    const reponses = await Reponse.find({ question: question._id })
      .populate("auteur", "nom email")
      .sort({ createdAt: -1 });

    res.json({ question, reponses });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// POST /api/questions
exports.creerQuestion = async (req, res) => {
  try {
    const { titre, description, tags } = req.body;

    if (!titre || !description) {
      return res.status(400).json({ message: "Le titre et la description sont obligatoires" });
    }

    const question = new Question({
      titre,
      description,
      tags: Array.isArray(tags)
        ? tags
        : (tags || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      auteur: req.user.id,
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// PUT /api/questions/:id
exports.modifierQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question introuvable" });
    if (question.auteur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Tu ne peux modifier que tes propres questions" });
    }

    const { titre, description, tags } = req.body;
    if (titre) question.titre = titre;
    if (description) question.description = description;
    if (tags) {
      question.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    }

    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// DELETE /api/questions/:id
exports.supprimerQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question introuvable" });
    if (question.auteur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Tu ne peux supprimer que tes propres questions" });
    }

    await Reponse.deleteMany({ question: question._id });
    await question.deleteOne();

    res.json({ message: "Question supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// PUT /api/questions/:id/vote


// PUT /api/questions/:id/meilleure-reponse
exports.marquerMeilleureReponse = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question introuvable" });
    if (question.auteur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Seul l'auteur de la question peut choisir la meilleure réponse" });
    }

    const { reponseId } = req.body;
    question.meilleureReponse = reponseId;

    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};