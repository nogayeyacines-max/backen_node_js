const express = require('express');
const {inscription , connexion} = require('../controller/user.controller');
const User = require('../models/user.model');

const router = express.Router();

router.post("/inscription" , inscription);
router.post("/connexion" , connexion);

// Route temporaire pour vérifier les utilisateurs
router.get("/users", async (req, res) => {
    const users = await User.find({}, { password: 0 });
    res.json(users);
});

module.exports = router;