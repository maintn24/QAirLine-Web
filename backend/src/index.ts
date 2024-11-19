import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.get('/', (req, res) => {
    res.send('QAirlines Backend');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

/*
mongoose.connect(process.env.MONGODB_URI!, {
    dbName: 'QAirline',
    bufferCommands: true,
})
    .then(() => {
        console.log('Connecting to MongoDB!');
        app.listen(3001, () => {
            console.log("server running on http://localhost:3001");
        });
    })
    .catch(() => console.log('Connection failed'));
*/