const mongoose = require('mongoose');

const connectBD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);  // ✅ URL_MONGO → MONGO_URI

        console.log('MongoDB connecté');
    } catch (error) {
        console.log('Erreur MongoDB');
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectBD;