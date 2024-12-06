// routes/flightRoutes.ts
import express from 'express';
import { getAllFlights,addFlight,deleteFlight,getUserFlights,searchFlights,bookFlight,cancelBooking,createNotification,getNotificationByID } from '../controllers/FlightController';

const router = express.Router();
// Chức năng User
    //Xem thông tin tất cả các chuyến bay
    router.get('/flights', getAllFlights);
    //Tìm chuyến bay
    router.post('/search', searchFlights);
    //Đặt vé
    router.post('/booking', bookFlight);
    // Hủy vé trong thời hạn được hủy
    router.post('/remove_booking', cancelBooking);
    // Hiện thông tin chuyến bay của User
    router.post('/find_flight', getUserFlights);
// Chức năng Admin    
    //Tạo thông tin
    router.post('/post_notification', createNotification);
    //Hiển thị 1 thông tin
    router.post('/notification', getNotificationByID);
    //Thêm chuyến bay
    router.post('/addflight',addFlight);
    //Xóa chuyến bay 
    router.post('/deleteflight',deleteFlight);
export default router;
