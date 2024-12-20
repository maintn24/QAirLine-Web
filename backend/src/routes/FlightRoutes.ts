import express from 'express';
import { getAllFlights,addFlight,deleteFlight,getUserFlights,searchFlights,bookFlight,cancelBooking, CreateOffer, deleteOffer,addAircraft,getAllOffers,viewAndSummarizeBookings,getAllAircrafts,deleteAircraft,updateAircraft,editFlight } from '../controllers/FlightController';
import { getAllUsers,deleteUser } from '../controllers/UserController';
import {signIn} from '../controllers/User_Logging/Sign_in_Controller';
import {signUp} from '../controllers/User_Logging/Sign_up_Controller';

const router = express.Router();
// Chức năng Guest
    // Lấy list Offer
    router.get('/Offers/GetAllOffers',getAllOffers);
    // Xem thông tin tất cả các chuyến bay
    router.get('/Flights/GetAllFlights', getAllFlights);
// Chức năng User
    //Tìm chuyến bay
    router.post('/Flights/SearchFlight', searchFlights);
    //Đặt vé
    router.post('/Bookings/BookFlights', bookFlight);
    // Hủy vé trong thời hạn được hủy
    router.post('/Bookings/CancelBooking', cancelBooking);
    // Hiện thông tin chuyến bay của User
    router.post('/Flights/GetUserFlights', getUserFlights);
    // Đăng ký
    router.post('/auth/signup',signUp);
    // Đăng nhập
    router.post('/auth/signin',signIn);
// Chức năng Admin 
    // Xem thông tin tất cả User
    router.get('/User/GetAllUser',getAllUsers);
    // Xem và thống kê đặt vé của tất cả User
    router.post('/Bookings/ViewAndSummarize',viewAndSummarizeBookings); 
     // Xóa User 
    router.post('/User/DeleteUser',deleteUser);
    // Tạo Offer
    router.post('/Offers/CreateOffer', CreateOffer);  
    // Xóa Offer
    router.post('/Offers/DeleteOffer', deleteOffer);
    // Lấy thông tin tất cả tàu bay
    router.post('/Aircrafts/GetAll',getAllAircrafts);
    // Xóa tàu bay 
    router.post('/Aircrafts/Delete',deleteAircraft);
    // Sửa tàu bay
    router.post('/Aircrafts/Edit',updateAircraft);
    // Thêm tàu bay
    router.post('/Aircrafts/Add',addAircraft);
    // Thêm chuyến bay
    router.post('/Flights/Add',addFlight);
    // Xóa chuyến bay 
    router.post('/Flights/Delete',deleteFlight);
    // Sửa chuyến bay
    router.post('/Flights/Edit',editFlight);
export default router;
