require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');

const { urlRouter } = require("./routes/urlRoutes");
const { authRouter } = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
    origin: [
        'https://tsltest.vercel.app',
        'http://localhost:3000',
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use("", urlRouter);
app.use("/auth", authRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => { console.log(`Backend Hosted on: http://localhost:${PORT}`) });
    console.log("Connection Successfully Established to the Database!!")
}
main();