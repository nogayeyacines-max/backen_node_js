const mongoose = require("mongoose");

const commentaireSchema = new mongoose.Schema(
  {
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contenu: { type: String, required: true },
  },
  { timestamps: true }
);

const reponseSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contenu: { type: String, required: true },
    votes: { type: Number, default: 0 },
    votedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, enum: [1, -1] },
      },
    ],
    commentaires: [commentaireSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reponse", reponseSchema);