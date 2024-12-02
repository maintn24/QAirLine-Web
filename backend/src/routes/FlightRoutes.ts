// routes/flightRoutes.ts
import express from 'express';
import { getAllFlights,addFlight,deleteFlight } from '../controllers/flightController';

const router = express.Router();

//Hiện tất cả chuyến bay
router.get('/flights', getAllFlights);
//Thêm chuyến bay
router.post('/addflights',addFlight);
//Xóa chuyến bay 
router.post('/deleteflights',deleteFlight);
export default router;
