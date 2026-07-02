const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectBD = require('./config/db');
const userRoute = require('./routes/user.route');
const questionRoute = require('./routes/question.route');
const reponseRoute = require('./routes/reponse.route');

dotenv.config();
const app = express();
connectBD();



app.use(cors({
  origin: [
    "http://localhost:5173"
  ]
  
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon serveur');
});

app.use('/api/auth', userRoute);
app.use('/api/questions', questionRoute);
app.use('/api/reponses', reponseRoute);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});