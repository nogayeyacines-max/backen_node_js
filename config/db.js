const mongoose = require('mongoose');

// fonction de connexion à MongoDB
const connectBD = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO);

        console.log('MongoDB connecté');
    } catch (error) {
        console.log('Erreur MongoDB');
        console.log(error);

        process.exit(1);
    }
};

module.exports = connectBD;