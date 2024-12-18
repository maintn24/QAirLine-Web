import express from 'express';
import { getAllFlights,addFlight,deleteFlight,getUserFlights,searchFlights,bookFlight,cancelBooking, CreateOffer, deleteOffer,addAircraft,getAllOffers } from '../controllers/FlightController';
import { getAllUsers,deleteUser } from '../controllers/UserController';
import {signIn} from '../controllers/User_Logging/Sign_in_Controller';
import {signUp} from '../controllers/User_Logging/Sign_up_Controller';

const router = express.Router();
// Chức năng User
    // Lấy list Offer
    router.get('/Offers/GetAllOffers',getAllOffers);
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
    // Xem thông tin tất cả User
    router.get('/User/GetAllUser',getAllUsers);
    // Xóa User 
    router.post('/User/DeleteUser',deleteUser);
    //Tạo thông tin
    router.post('/Offers/CreateOffer', CreateOffer); 
    //Nhập dữ liệu tàu bay
    router.post('/Aircrafts/Add',addAircraft);
    //Xóa thông tin
    router.post('/Offers/DeleteOffer', deleteOffer);
    //Thêm chuyến bay
    router.post('/Flights/AddFlight',addFlight);
    //Xóa chuyến bay 
    router.post('/Flights/DeleteFlight',deleteFlight);
export default router;
