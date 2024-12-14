// routes/flightRoutes.ts
import express from 'express';
import { getAllFlights,addFlight,deleteFlight,getUserFlights,searchFlights,bookFlight,cancelBooking, CreateOffer, GetOfferByID, deleteOffer } from '../controllers/FlightController';
import {signIn} from '../controllers/User_Logging/Sign_in_Controller'
import {signUp} from '../controllers/User_Logging/Sign_up_Controller'

const router = express.Router();
// Chức năng User
    //Xem thông tin tất cả các chuyến bay
    router.get('/Flights/GetAllFlights', getAllFlights);
    //Tìm chuyến bay
    router.post('/Flights/SearchFlight', searchFlights);
    //Đặt vé
    router.post('/Bookings/BookFlights', bookFlight);
    // Hủy vé trong thời hạn được hủy
    router.post('/Bookings/CancelBooking', cancelBooking);
    // Hiện thông tin chuyến bay của User
    router.post('/Flights/GetUserFlights', getUserFlights);

    router.post('/auth/signup',signUp);
    router.post('/auth/signin',signIn);
// Chức năng Admin    
    //Tạo thông tin
    router.post('/Offer/CreateOffer', CreateOffer);
    //Hiển thị 1 thông tin
    router.post('/Offer/GetOfferById', GetOfferByID);
    //Xóa thông tin
    router.post('/Offer/DeleteOffer', deleteOffer);
    //Thêm chuyến bay
    router.post('/Flights/AddFlight',addFlight);
    //Xóa chuyến bay 
    router.post('/Flights/DeleteFlight',deleteFlight);
export default router;
