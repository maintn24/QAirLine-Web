import express from "express";
import dotenv from "dotenv";
import flightRoutes from './routes/FlightRoutes';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; 
app.use(express.json());
app.use('/api', flightRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});