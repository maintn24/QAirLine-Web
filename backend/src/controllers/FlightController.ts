import { Request, Response } from 'express';
import connection from '../database/database';
import { OkPacket } from 'mysql2'; 
import { RowDataPacket } from 'mysql2/';
// CHỨC NĂNG USER
  //1. Xem Thông tin tất cả các chuyến bay 
export const getAllFlights = (req: Request, res: Response) => {
  const query = 'SELECT * FROM Flights';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results); 
  });
};
  //2. Tìm chuyến bay
export const searchFlights = (req: Request, res: Response): void => {
  // Lấy flightID từ body của request
  const { FlightID } = req.body;

  // Kiểm tra xem flightID có tồn tại không
  if (!FlightID) {
    res.status(400).json({ message: 'FlightID is required' });
    return;
  }

  // Truy vấn tìm chuyến bay theo flightID
  const query = 'SELECT * FROM Flights WHERE FlightID = ?';

  connection.query(query, [FlightID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
      return;
    }

    // Ép kiểu kết quả thành RowDataPacket[]
    const flightResults = results as RowDataPacket[];

    // Kiểm tra nếu không có chuyến bay nào được tìm thấy
    if (flightResults.length === 0) {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }

    // Trả về chuyến bay đầu tiên nếu có
    res.status(200).json(flightResults[0]);
  });
};

//3. Đặt vé
export const bookFlight = (req: Request, res: Response): void => {
  const { UserID, FlightID } = req.body;
  // Check 2 trường userID và flightID xem có hợp lệ không 
  if (!UserID || !FlightID) {
    res.status(400).json({ message: 'Missing required fields: userID or flightID' });
    return;
  }
  const flightQuery = 'SELECT * FROM Flights WHERE FlightID = ?';
  connection.query(flightQuery, [FlightID], (err, results) => {
    if (err) {
      console.error('Error querying flights:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
    const FlightResults = results as RowDataPacket[];
    if (FlightResults.length === 0) {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }

    const flight = FlightResults[0];

    //Check SeatsAvailable
    if (flight.SeatsAvailable <= 0) {
      res.status(400).json({ message: 'No seats available for this flight' });
      return;
    }
    const checkBookingQuery = 'SELECT * FROM Bookings WHERE UserID = ? AND FlightID = ?';
    connection.query(checkBookingQuery, [UserID, FlightID], (err, results) => {
      if (err) {
        console.error('Error checking existing booking:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      const bookingResults = results as RowDataPacket[];
      // Nếu đã đặt vé
      if (bookingResults.length > 0 && bookingResults[0].BookingStatus === 'confirmed') {
        res.status(400).json({ message: 'User has already confirmed booking for this flight' });
        return;
      }

      // Nếu vé đã bị hủy --> update trạng thái thành "confirmed"
      if (bookingResults.length > 0 && bookingResults[0].BookingStatus === 'cancelled') {
        const bookingID = bookingResults[0].BookingID;
        const updateBookingQuery = 'UPDATE Bookings SET BookingStatus = "confirmed", BookingDate = NOW() WHERE BookingID = ?';
        connection.query(updateBookingQuery, [bookingID], (err, results) => {
          if (err) {
            console.error('Error updating booking status:', err);
            res.status(500).json({ message: 'Failed to update booking status' });
            return;
          }
          // Update SeatAvailable
          const updateSeatsQuery = 'UPDATE Flights SET SeatsAvailable = SeatsAvailable - 1 WHERE FlightID = ?';
          connection.query(updateSeatsQuery, [FlightID], (err, results) => {
            if (err) {
              console.error('Error updating flight seats:', err);
              res.status(500).json({ message: 'Failed to update flight seat availability' });
              return;
            }

            // Trả message nếu đặt lại vé thành công 
            res.status(201).json({
              message: 'Booking re-confirmed successfully, flight re-booked',
              bookingID,
              FlightID,
              UserID,
            });
          });
        });
      } else {
        // Nếu chưa hủy vé trước đó, cho phép đặt vé mới (không trùng userID,flightID)
        const bookingQuery = 'INSERT INTO Bookings (UserID, FlightID) VALUES (?, ?)';
        connection.query(bookingQuery, [UserID, FlightID], (err, results) => {
          if (err) {
            console.error('Error creating booking:', err);
            res.status(500).json({ message: 'Failed to create booking' });
            return;
          }

          const bookingID = (results as OkPacket).insertId;

          // Update SeatsAvailable
          const updateFlightQuery = 'UPDATE Flights SET SeatsAvailable = SeatsAvailable - 1 WHERE FlightID = ?';
          connection.query(updateFlightQuery, [FlightID], (err, results) => {
            if (err) {
              console.error('Error updating flight seats:', err);
              res.status(500).json({ message: 'Failed to update flight seat availability' });
              return;
            }

            // Trả message nếu đặt vé thành công 
            res.status(201).json({
              message: 'Booking confirmed',
              bookingID,
              FlightID,
              UserID,
            });
          });
        });
      }
    });
  });
};
//4. Hủy vé
export const cancelBooking = (req: Request, res: Response): void => {
  const { userID, bookingID } = req.body;
  // Check userID,bookingID có tồn tại ko
  if (!userID || !bookingID) {
    res.status(400).json({ message: 'Missing required fields: userID or bookingID' });
    return;
  }
  const bookingQuery = 'SELECT * FROM Bookings WHERE BookingID = ? AND UserID = ?';
  connection.query(bookingQuery, [bookingID, userID], (err, results) => {
    if (err) {
      console.error('Error querying booking:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
    const bookingResults = results as RowDataPacket[];
    if (bookingResults.length === 0) {
      res.status(404).json({ message: 'Booking not found or does not belong to user' });
      return;
    }
    const booking = bookingResults[0];
    const flightID = booking.FlightID;

    // Check có còn đủ thời gian để hủy vé không ?
    const flightQuery = 'SELECT * FROM Flights WHERE FlightID = ?';
    connection.query(flightQuery, [flightID], (err, results) => {
      if (err) {
        console.error('Error querying flights:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      const flightResults = results as RowDataPacket[];
      if (flightResults.length === 0) {
        res.status(404).json({ message: 'Flight not found' });
        return;
      }
      const flight = flightResults[0];
      const departureTime = new Date(flight.DepartureTime);
      const currentTime = new Date();
      const timeDifference = departureTime.getTime() - currentTime.getTime();
      const MIN_CANCEL_TIME = 2 * 60 * 60 * 1000; // Tối thiếu 2 giờ trước khi cất cánh 
      if (timeDifference < MIN_CANCEL_TIME) {
        res.status(400).json({ message: 'Cannot cancel booking, less than 3 hours before flight' });
        return;
      }
      // Update trạng thái thành "Cancelled"
      const cancelBookingQuery = 'UPDATE Bookings SET BookingStatus = "cancelled" WHERE BookingID = ?';
      connection.query(cancelBookingQuery, [bookingID], (err, results) => {
        if (err) {
          console.error('Error canceling booking:', err);
          res.status(500).json({ message: 'Failed to cancel booking' });
          return;
        }

      //Update SeatsAvailable
        const updateSeatsQuery = 'UPDATE Flights SET SeatsAvailable = SeatsAvailable + 1 WHERE FlightID = ?';
        connection.query(updateSeatsQuery, [flightID], (err, results) => {
          if (err) {
            console.error('Error updating seats available:', err);
            res.status(500).json({ message: 'Failed to update seat availability' });
            return;
          }

          // Trả về thông báo thành công
          res.status(200).json({ message: 'Booking cancelled successfully' });
        });
      });
    });
  });
};
  //5. Theo dõi thông tin chuyến bay đã đặt của User
export const getUserFlights = (req: Request, res: Response): void => {
  const { userID } = req.body;  // Lấy userID từ request body
  if (!userID) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
    // Truy vấn từ Table Bookings và Flights
  const query = `
    SELECT 
      b.BookingID, b.BookingDate, b.BookingStatus, b.PaymentStatus, 
      f.FlightID, f.AircraftTypeID, f.Departure, f.Arrival, f.DepartureTime, f.ArrivalTime, f.Price, f.SeatsAvailable, f.Status AS FlightStatus
    FROM Bookings b
    JOIN Flights f ON b.FlightID = f.FlightID
    WHERE b.UserID = ?
  `;
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
      return;
    }

    // Không có results 
    if ((results as any).length === 0) {
      res.status(404).json({ message: 'No booking found for this user' });
      return;
    }

    // Có results
    res.status(200).json(results);
  });
};
//CHỨC NĂNG ADMIN
  //1. Tạo thông tin
  export const CreateOffer = (req: Request, res: Response): void => {
    const { title, content, type } = req.body;
    if (!title || !content || !type) {
      res.status(400).json({ message: 'Missing required fields: title, content, type' });
      return;
    }
    const query = 'INSERT INTO OFFER (Title, Content, Type) VALUES (?, ?, ?)';
    connection.query(query, [title, content, type], (err, results) => {
      if (err) {
        console.error('Error inserting notification:', err);
        res.status(500).json({ message: 'Failed to create Offer' });
        return;
      }
      res.status(201).json({
        message: 'Offer created successfully',
        postID: (results as any).insertId, // ID của bài đăng mới
      });
    });
  };
  //2. Đăng thông tin
export const GetOfferByID = (req: Request, res: Response): void => {
  const { postID } = req.body;
  if (!postID){
    res.status(400).json({ message: 'Missing required fields: postID' });
    return;
  }
  const query = 'SELECT * FROM OFFER WHERE PostID = ?';
  connection.query(query, [postID], (err, results) => {
    if (err) {
      console.error('Error fetching notification:', err);
      res.status(500).json({ message: 'Failed to fetch notification' });
      return;
    }
    const flightResults = results as RowDataPacket[];
    // Kiểm tra xem có kết quả hay không
    if (flightResults.length === 0) {
      res.status(404).json({ message: 'Offer not found' });
      return;
    }
    const flight = flightResults[0];
    // Trả về thông báo chi tiết
    res.status(200).json(flightResults[0]);
  });
};

//3. Nhập dữ liệu Tàu bay
 // Tính năng thêm tàu bay với kiểm tra trùng lặp
export const addAircraft = (req: Request, res: Response): void => {
  const { Model, Manufacturer, Capacity, RangeKm, Description } = req.body;

  // Kiểm tra xem các trường dữ liệu có đầy đủ hay không
  if (!Model || !Manufacturer || !Capacity || !RangeKm) {
    res.status(400).json({
      message: 'Missing required fields: Model, Manufacturer, Capacity, or RangeKm',
    });
    return;
  }

  // Truy vấn kiểm tra xem tàu bay đã tồn tại hay chưa
  const checkQuery = `
    SELECT * FROM Aircrafts 
    WHERE Model = ? AND Manufacturer = ?
  `;

  connection.query(checkQuery, [Model, Manufacturer], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
      });
      return;
    }

    // Nếu tìm thấy tàu bay trùng lặp
    if ((results as RowDataPacket[]).length > 0) {
      res.status(400).json({
        message: 'Aircraft with the same Model and Manufacturer already exists',
      });
      return;
    }

    // Nếu không trùng lặp, thêm tàu bay mới
    const insertQuery = `
      INSERT INTO Aircrafts (Model, Manufacturer, Capacity, RangeKm, Description) 
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(insertQuery, [Model, Manufacturer, Capacity, RangeKm, Description], (err, results) => {
      if (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({
          message: 'Internal Server Error',
          error: err.message,
        });
        return;
      }

      const aircraftID = (results as OkPacket).insertId;

      // Trả thông báo thành công
      res.status(201).json({
        message: 'Aircraft added successfully',
        aircraftID,
      });
    });
  });
};


//4. Xóa thông tin 
export const deleteOffer = (req: Request, res: Response): void => {
  const { postID } = req.body;  // Lấy postID từ body của request

  // Kiểm tra xem postID có tồn tại không
  if (!postID) {
    res.status(400).json({ message: 'postID is required' });
    return;
  }

  // Truy vấn xóa thông tin offer (Notification) theo postID
  const query = 'DELETE FROM OFFER WHERE PostID = ?';

  connection.query(query, [postID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
      return;
    }

    // Kiểm tra xem offer có bị xóa hay không
    const result = results as OkPacket;
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Offer not found' });
      return;
    }

    // Trả về thông báo thành công nếu xóa thành công
    res.status(200).json({ message: 'Offer deleted successfully' });
  });
};
  //5. Nhập dữ liệu chuyến bay mới
export const addFlight = (req: Request, res: Response): void => {
    // cần body
  const { AircraftTypeID, Departure, Arrival, DepartureTime, ArrivalTime, Price, SeatsAvailable, Status } = req.body;
    // Check hợp lệ data?
  if (!AircraftTypeID || !Departure || !Arrival || !DepartureTime || !ArrivalTime || !Price || !SeatsAvailable || !Status) {
    res.status(400).json({ message: "Missing required fields" }); // Trả về lỗi nếu thiếu dữ liệu
    return;
  }
    // Query SQL thêm chuyến bay mới
  const query = 'INSERT INTO Flights (AircraftTypeID, Departure, Arrival, DepartureTime, ArrivalTime, Price, SeatsAvailable, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    // Truy vấn INSERT
  connection.query(query, [AircraftTypeID, Departure, Arrival, DepartureTime, ArrivalTime, Price, SeatsAvailable, Status], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message }); // Trả về lỗi nếu có lỗi truy vấn
      return;
    }
    const flightID = (results as OkPacket).insertId;
    res.status(201).json({ message: 'Flight added successfully', flightID }); // Trả thông báo thành công 
  });
};
  // Xóa chuyến bay - demo
export const deleteFlight = (req: Request, res: Response): void => {
    // Cần body
  const { flightID } = req.body;
    // Check xem FlightID có hợp lệ không ?
  if (!flightID) {
   res.status(400).json({ message: 'FlightID is required' });
  }
  const query = 'DELETE FROM Flights WHERE FlightID = ?';
    // Truy vấn DELETE
  connection.query(query, [flightID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }

    // Chuyến bay có bị xóa hay không
    const result = results as OkPacket;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    const vietnamTime = new Date();
    vietnamTime.setHours(vietnamTime.getHours()); // Thêm 7 giờ để chuyển sang UTC+7
    const timestamp = vietnamTime.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    // Trả thông báo xóa thành công
    return res.status(200).json({ 
      message: 'Flight deleted successfully', // Thông báo chung về việc xóa chuyến bay
      timestampMessage: `Flight deleted at ${timestamp}` // Thông báo timestamp riêng biệt
    });
  });
};

