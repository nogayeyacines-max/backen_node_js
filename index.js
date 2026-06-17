const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectBD = require('./config/db');
const userRoute = require('./routes/user.route');

dotenv.config();
const app = express();
connectBD();

app.use(cors({ origin:
    [
"http://localhost:5173/", //url_react
"https://front-node-one.vercel.app" // url_vercel
    ] 
}));  
app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Bienvenue sur mon serveur');
});

app.use('/api/auth', userRoute);

app.listen(PORT, () => {
    console.log(`serveur demarre sur http://localhost:${PORT}`);
});