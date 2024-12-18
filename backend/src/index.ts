import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import FlightRoutes from './routes/FlightRoutes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; 
app.use(express.json());
app.use(cors());
app.use('/api', FlightRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});