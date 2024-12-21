import { Request, Response } from 'express';
import connection from '../database/database';
import { OkPacket } from 'mysql2'; 
import { RowDataPacket } from 'mysql2/';

 // Kiểm tra UserID có tồn tại và có phải Admin không
 const checkUserIsAdmin = (userID: number, callback: (isAdmin: boolean, error?: any) => void): void => {
  const query = 'SELECT Role FROM Users WHERE UserID = ?';
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Error checking user role:', err);
      callback(false, err);
      return;
    }

    const userResults = results as RowDataPacket[];
    if (userResults.length === 0 || userResults[0].Role !== 'Admin') {
      callback(false); // Không tồn tại hoặc không phải Admin
    } else {
      callback(true); // Là Admin
    }
  });
};
// Kiểm tra FlightID có tồn tại
const checkFlightExists = (flightID: number, callback: (exists: boolean, error?: any) => void): void => {
  const query = 'SELECT FlightID FROM Flights WHERE FlightID = ?';
  connection.query(query, [flightID], (err, results) => {
    if (err) {
      console.error('Error checking flight existence:', err);
      callback(false, err);
      return;
    }
    const flightResults = results as RowDataPacket[];
    callback(flightResults.length > 0);
  });
};
// Kiểm tra UserId có tồn tại hay không
const checkUserExists = (userID: number, callback: (exists: boolean, error?: any) => void): void => {
  const query = 'SELECT UserID FROM Users WHERE UserID = ?';
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err);
      callback(false, err);
      return;
    }
    const userResults = results as RowDataPacket[];
    callback(userResults.length > 0);
  });
};
// Kiểm tra PostID có tồn tại hay không
const checkPostExists = (postID: number, callback: (exists: boolean, error?: any) => void): void => {
  const query = 'SELECT PostID FROM Offers WHERE PostID = ?';
  connection.query(query, [postID], (err, results) => {
    if (err) {
      console.error('Error checking post existence:', err);
      callback(false, err);
      return;
    }

    const postResults = results as RowDataPacket[];
    callback(postResults.length > 0);
  });
};


//Chức năng Guest 
//1. Lấy danh sách Offers
export const getAllOffers = (req: Request, res: Response): void => {
  const query = 'SELECT PostID,Title,Content,PostDate FROM Offers';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
      return;
    }
    // Nếu không có kết quả
    if ((results as any).length === 0) {
      res.status(404).json({ message: 'No offers found' });
      return;
    }
    // Trả về tất cả các offers
    res.status(200).json(results);
  });
};
//2. Xem Thông tin tất cả các chuyến bay 
export const getAllFlights = (req: Request, res: Response) => {
  const query = `
    SELECT 
      f.FlightID, 
      a.Model AS AircraftModel, 
      f.Departure, 
      f.Arrival, 
      f.DepartureTime, 
      f.ArrivalTime, 
      f.Price, 
      f.SeatsAvailable, 
      f.Status
    FROM Flights f
    JOIN Aircrafts a ON f.AircraftTypeID = a.AircraftID
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
};
// CHỨC NĂNG USER
  //1.Tìm chuyến bay 
  export const searchFlights = (req: Request, res: Response): void => {
    const { FlightID } = req.body;
   
    checkFlightExists(FlightID, (exists, error) => {
      if (error) {
        res.status(500).json({ message: 'Error checking flight existence', error: error.message });
        return;
      }
      if (!exists) {
        res.status(404).json({ message: 'Flight not found' });
        return;
      }
    // Kiểm tra FlightID
    if (!FlightID) {
      res.status(400).json({ message: 'FlightID is required' });
      return;
    }
      // Truy vấn chi tiết chuyến bay nếu tồn tại
      const query = `
        SELECT 
          f.FlightID, f.Departure, f.Arrival, f.DepartureTime, f.ArrivalTime, f.Price, f.SeatsAvailable, f.Status, 
          a.Model AS AircraftModel 
        FROM Flights f
        JOIN Aircrafts a ON f.AircraftTypeID = a.AircraftID
        WHERE f.FlightID = ?
      `;
  
      connection.query(query, [FlightID], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.stack);
          res.status(500).json({ message: 'Internal Server Error', error: err.message });
          return;
        }
  
        const flightResults = results as RowDataPacket[];
  
        // Trả về chuyến bay đầu tiên nếu có
        res.status(200).json(flightResults[0]);
      });
    });
  };
  
//2. Đặt vé 
export const bookFlight = (req: Request, res: Response): void => {
  const { UserID, FlightID } = req.body;

  if (!UserID || !FlightID) {
    res.status(400).json({ message: 'Missing required fields: userID or flightID' });
    return;
  }

  // Kiểm tra userID
  const userQuery = 'SELECT * FROM Users WHERE UserID = ?';
  connection.query(userQuery, [UserID], (err, userResults) => {
    if (err) {
      res.status(500).json({ message: 'Internal server error', error: err.message });
      return;
    }

    // Ép kiểu userResults thành RowDataPacket[]
    const users = userResults as RowDataPacket[];
    if (users.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Kiểm tra flightID
    const flightQuery = 'SELECT * FROM Flights WHERE FlightID = ?';
    connection.query(flightQuery, [FlightID], (err, flightResults) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
        return;
      }

      const flights = flightResults as RowDataPacket[];
      if (flights.length === 0) {
        res.status(404).json({ message: 'Flight not found' });
        return;
      }

      // Kiểm tra booking
      const bookingQuery = `
        SELECT * FROM Bookings 
        WHERE UserID = ? AND FlightID = ?
      `;
      connection.query(bookingQuery, [UserID, FlightID], (err, bookingResults) => {
        if (err) {
          res.status(500).json({ message: 'Internal server error', error: err.message });
          return;
        }

        const bookings = bookingResults as RowDataPacket[];

        if (bookings.length > 0 && bookings[0].BookingStatus === 'confirmed') {
          res.status(400).json({ message: 'You already have a confirmed booking for this flight' });
          return;
        }

        // Logic đặt vé mới
        const insertQuery = 'INSERT INTO Bookings (UserID, FlightID) VALUES (?, ?)';
        connection.query(insertQuery, [UserID, FlightID], (err, insertResults) => {
          if (err) {
            res.status(500).json({ message: 'Failed to create booking', error: err.message });
            return;
          }
          // Update SeatsAvailable
              const updateSeatsQuery = 'UPDATE Flights SET SeatsAvailable = SeatsAvailable - 1 WHERE FlightID = ?';
              connection.query(updateSeatsQuery, [FlightID], (err) => {
                if (err) {
                  console.error('Error updating flight seats:', err);
                  res.status(500).json({ message: 'Failed to update flight seat availability' });
                  return;
                }
              })

          const newBookingID = (insertResults as OkPacket).insertId;

          res.status(201).json({
            message: 'Booking confirmed',
            bookingID: newBookingID,
            UserID,
            FlightID,
          });
        });
      });
    });
  });
};


// 3. Hủy vé
export const cancelBooking = (req: Request, res: Response): void => {
  const { userID, bookingID } = req.body;

  if (!userID || !bookingID) {
    res.status(400).json({ message: 'Missing required fields: userID or bookingID' });
    return;
  }

  // Kiểm tra bookingID có tồn tại và thuộc về userID
  const bookingQuery = `
    SELECT b.BookingID, b.FlightID, b.BookingStatus 
    FROM Bookings b 
    WHERE b.BookingID = ? AND b.UserID = ?
  `;
  connection.query(bookingQuery, [bookingID, userID], (err, bookingResults) => {
    if (err) {
      console.error('Error querying booking:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
      return;
    }

    const bookings = bookingResults as RowDataPacket[];

    if (bookings.length === 0) {
      res.status(404).json({ message: 'Booking not found or does not belong to user' });
      return;
    }

    const booking = bookings[0];

    // Nếu vé đã bị hủy
    if (booking.BookingStatus === 'cancelled') {
      res.status(400).json({ message: 'Booking is already cancelled' });
      return;
    }

    // Cập nhật trạng thái Booking thành "cancelled"
    const cancelQuery = 'UPDATE Bookings SET BookingStatus = "cancelled" WHERE BookingID = ?';
    connection.query(cancelQuery, [bookingID], (err) => {
      if (err) {
        console.error('Error cancelling booking:', err);
        res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
        return;
      }

      // Tăng số ghế trống trong bảng Flights
      const updateSeatsQuery = 'UPDATE Flights SET SeatsAvailable = SeatsAvailable + 1 WHERE FlightID = ?';
      connection.query(updateSeatsQuery, [booking.FlightID], (err) => {
        if (err) {
          console.error('Error updating seats available:', err);
          res.status(500).json({ message: 'Failed to update seat availability' });
          return;
        }

        res.status(200).json({ message: 'Booking cancelled successfully and seat availability updated', bookingID });
      });
    });
  });
};


  //4. Theo dõi thông tin chuyến bay đã đặt 
  export const getUserFlights = (req: Request, res: Response): void => {
    const { userID } = req.body;
  
    // Kiểm tra userID có được gửi từ request hay không
    if (!userID) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }
    // Kiểm tra userID có tồn tại không
    checkUserExists(userID, (exists, error) => {
      if (error) {
        res.status(500).json({ message: 'Error checking user existence', error: error.message });
        return;
      }
  
      if (!exists) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      // Truy vấn thông tin chuyến bay đã đặt
      const query = `
        SELECT 
        b.BookingID, b.BookingDate, b.BookingStatus, b.PaymentStatus, 
        f.FlightID, f.Departure, f.Arrival, f.DepartureTime, f.ArrivalTime, f.Price, f.SeatsAvailable, f.Status AS FlightStatus,
        a.Model AS AircraftModel
      FROM Bookings b
      JOIN Flights f ON b.FlightID = f.FlightID
      JOIN Aircrafts a ON f.AircraftTypeID = a.AircraftID
      WHERE b.UserID = ?
      `;
      connection.query(query, [userID], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.stack);
          res.status(500).json({ message: 'Internal Server Error', error: err.message });
          return;
        }
  
        // Không có kết quả
        if ((results as any).length === 0) {
          res.status(404).json({ message: 'No booking found for this user' });
          return;
        }
  
        // Trả về kết quả
        res.status(200).json(results);
      });
    });
  };
  
//CHỨC NĂNG ADMIN
  //1. Tạo thông tin
  export const CreateOffer = (req: Request, res: Response): void => {
    const { title, content, userID } = req.body;

   // Kiểm tra xem UserID có tồn tại và là admin hay không ?
   checkUserIsAdmin(userID, (isAdmin, error) => {
    if (error) {
      res.status(500).json({
        message: 'Error checking user role',
        error: error.message,
      });
      return;
    }

    if (!isAdmin) {
      res.status(403).json({
        message: 'Permission denied: User does not exist or is not an admin',
      });
      return;
    }
    // Kiểm tra đầu vào
    if (!title || !content || !userID) {
      res.status(400).json({ message: 'Missing required fields: title, content, or UserID' });
      return;
    }
      // Kiểm tra xem người dùng có phải là admin hay không
      const adminQuery = 'SELECT Role FROM Users WHERE UserID = ?';
      connection.query(adminQuery, [userID], (err, results: any) => {
        if (err) {
          console.error('Error checking user role:', err);
          res.status(500).json({ message: 'Failed to verify user role' });
          return;
        }
        // Kiểm tra kết quả trả về có hợp lệ không và người dùng có Role là Admin
        if (!Array.isArray(results) || results.length === 0 || results[0].Role !== 'Admin') {
          res.status(403).json({ message: 'Permission denied: User is not an admin' });
          return;
        }
        // Thực hiện tạo Offer nếu người dùng là admin
        const query = 'INSERT INTO Offers (Title, Content) VALUES (?, ?)';
        connection.query(query, [title, content], (err, results: any) => {
          if (err) {
            console.error('Error inserting offer:', err);
            res.status(500).json({ message: 'Failed to create Offer' });
            return;
          }

          const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
          res.status(201).json({
            message: 'Offer created successfully',
            timestamp
          });
        });
      });
    });
  };

//2. Thêm tàu bay 
export const addAircraft = (req: Request, res: Response): void => {
  const { Model, Manufacturer, Capacity, RangeKm, Description, UserID } = req.body;

  // Kiểm tra đầu vào
  if (!Model || !Manufacturer || !Capacity || !RangeKm || !UserID) {
    res.status(400).json({
      message: 'Missing required fields: Model, Manufacturer, Capacity, RangeKm, or UserID',
    });
    return;
  }

  // Kiểm tra UserID có tồn tại và có phải Admin không
  checkUserIsAdmin(UserID, (isAdmin, error) => {
    if (error) {
      res.status(500).json({
        message: 'Error checking user role',
        error: error.message,
      });
      return;
    }

    if (!isAdmin) {
      res.status(403).json({
        message: 'Permission denied: User does not exist or is not an admin',
      });
      return;
    }

    // Kiểm tra xem máy bay đã tồn tại chưa
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

      if ((results as RowDataPacket[]).length > 0) {
        res.status(400).json({
          message: 'Aircraft with the same Model and Manufacturer already exists',
        });
        return;
      }

      // Thêm máy bay mới
      const insertQuery = `
        INSERT INTO Aircrafts (Model, Manufacturer, Capacity, RangeKm, Description) 
        VALUES (?, ?, ?, ?, ?)
      `;

      connection.query(insertQuery, [Model, Manufacturer, Capacity, RangeKm, Description, UserID], (err, results) => {
        if (err) {
          console.error('Error executing query:', err.stack);
          res.status(500).json({
            message: 'Internal Server Error',
            error: err.message,
          });
          return;
        }

        const aircraftID = (results as OkPacket).insertId;
        const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        res.status(201).json({
          message: 'Aircraft added successfully',
          aircraftID,
          timestamp,
        });
      });
    });
  });
};


  //3. Xóa Offer
  export const deleteOffer = (req: Request, res: Response): void => {
    const { postID, UserID } = req.body;
  
    // Kiểm tra đầu vào
    if (!postID || !UserID) {
      res.status(400).json({ message: 'Missing required fields: postID or UserID' });
      return;
    }
  
    // Kiểm tra UserID có phải Admin hay không
    checkUserIsAdmin(UserID, (isAdmin, error) => {
      if (error) {
        res.status(500).json({ message: 'Error checking user role', error: error.message });
        return;
      }
  
      if (!isAdmin) {
        res.status(403).json({ message: 'Permission denied: User is not an admin' });
        return;
      }
  
      // Kiểm tra PostID có tồn tại không
      checkPostExists(postID, (exists, error) => {
        if (error) {
          res.status(500).json({ message: 'Error checking post existence', error: error.message });
          return;
        }
  
        if (!exists) {
          res.status(404).json({ message: 'Post not found' });
          return;
        }
  
        // Thực hiện xóa Offer
        const query = 'DELETE FROM Offers WHERE PostID = ? AND CreatedBy = ?';
        connection.query(query, [postID, UserID], (err, results) => {
          if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ message: 'Internal Server Error', error: err.message });
            return;
          }
  
          const result = results as OkPacket;
  
          if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Offer not found or user does not have permission' });
            return;
          }
  
          res.status(200).json({ message: 'Offer deleted successfully' });
        });
      });
    });
  };
  
  //4. Thêm Chuyến bay
  export const addFlight = (req: Request, res: Response): void => {
    const { model, departure, arrival, departureTime, arrivalTime, price, seatsAvailable, status, userID } = req.body;

    // Kiểm tra đầu vào
    if (!model || !departure || !arrival || !departureTime || !arrivalTime || !price || !seatsAvailable || !status || !userID) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    // Kiểm tra userID có tồn tại và có phải Admin không
    checkUserIsAdmin(userID, (isAdmin, error) => {
        if (error) {
            res.status(500).json({ message: 'Error checking user role', error: error.message });
            return;
        }

        if (!isAdmin) {
            res.status(403).json({ message: 'Permission denied: User does not exist or is not an admin' });
            return;
        }

        // Lấy AircraftTypeID từ model
        const getAircraftQuery = 'SELECT AircraftID FROM Aircrafts WHERE Model = ?';
        connection.query(getAircraftQuery, [model], (err, results) => {
            if (err) {
                console.error('Error fetching aircraft:', err.stack);
                res.status(500).json({ message: 'Internal Server Error', error: err.message });
                return;
            }

            if ((results as RowDataPacket[]).length === 0) {
                res.status(404).json({ message: 'Aircraft model not found' });
                return;
            }

            const AircraftTypeID = (results as RowDataPacket[])[0].AircraftID;

            // Thêm chuyến bay mới
            const query = `
                INSERT INTO Flights (AircraftTypeID, Departure, Arrival, DepartureTime, ArrivalTime, Price, SeatsAvailable, Status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(
                query,
                [AircraftTypeID, departure, arrival, departureTime, arrivalTime, price, seatsAvailable, status],
                (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err.stack);
                        res.status(500).json({ message: 'Internal Server Error', error: err.message });
                        return;
                    }

                    const flightID = (results as OkPacket).insertId;

                    res.status(201).json({ message: 'Flight added successfully', flightID });
                }
            );
        });
    });
};

  
  //5. Xóa chuyến bay
  export const deleteFlight = (req: Request, res: Response): void => {
    const { flightID, UserID } = req.body;
    // Kiểm tra đầu vào
    if (!flightID || !UserID) {
      res.status(400).json({ message: 'Missing required fields: flightID or UserID' });
      return;
    }
  
    // Kiểm tra userID có phải Admin hoặc tồn tại hay không ?
    checkUserIsAdmin(UserID, (isAdmin, error) => {
      if (error) {
        res.status(500).json({
          message: 'Error checking user role',
          error: error.message,
        });
        return;
      }
  
      if (!isAdmin) {
        res.status(403).json({
          message: 'Permission denied: User does not exist or is not an admin',
        });
        return;
      }
  
      // Kiểm tra flightID có tồn tại không
      checkFlightExists(flightID, (exists, error) => {
        if (error) {
          res.status(500).json({ message: 'Error checking flight existence', error: error.message });
          return;
        }
  
        if (!exists) {
          res.status(404).json({ message: 'Flight not found' });
          return;
        }
  
        // Thực hiện xóa chuyến bay
        const query = 'DELETE FROM Flights WHERE FlightID = ? ';
        connection.query(query, [flightID, UserID], (err, results) => {
          if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ message: 'Internal Server Error', error: err.message });
            return;
          }
  
          const result = results as OkPacket;
  
          if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Flight not found or user does not have permission' });
            return;
          }
  
          // Lấy timestamp
          const vietnamTime = new Date();
          vietnamTime.setHours(vietnamTime.getHours());
          const timestamp = vietnamTime.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  
          res.status(200).json({
            message: 'Flight deleted successfully',
            timestampMessage: `Flight deleted at ${timestamp}`,
          });
        });
      });
    });
  };
  
  // 6. Chức năng xem và thống kê đặt vé của tất cả khách hàng
  export const viewAndSummarizeBookings = (req: Request, res: Response): void => {
  const { userID } = req.body;

  // Kiểm tra UserID có được gửi hay không
  if (!userID) {
    res.status(400).json({ message: 'UserID is required' });
    return;
  }

  // Kiểm tra xem UserID có phải là Admin hoặc tồn tại hay không
  checkUserIsAdmin(userID, (isAdmin, error) => {
    if (error) {
      res.status(500).json({
        message: 'Error checking user role',
        error: error.message,
      });
      return;
    }

    if (!isAdmin) {
      res.status(403).json({
        message: 'Permission denied: User does not exist or is not an admin',
      });
      return;
    }

    // Truy vấn lấy thống kê đặt vé, bao gồm BookingDate
    const bookingQuery = `
      SELECT 
        b.BookingID, 
        b.UserID, 
        u.Name AS UserName, 
        b.BookingDate, 
        f.FlightID, 
        f.Departure, 
        f.Arrival, 
        f.DepartureTime, 
        f.ArrivalTime, 
        f.Price
      FROM Bookings b
      JOIN Users u ON b.UserID = u.UserID
      JOIN Flights f ON b.FlightID = f.FlightID
      ORDER BY b.BookingID DESC
    `;

    connection.query(bookingQuery, (err, results: RowDataPacket[]) => {
      if (err) {
        console.error('Error fetching booking statistics:', err);
        res.status(500).json({ message: 'Failed to fetch booking statistics' });
        return;
      }

      const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

      // Trả về kết quả
      res.status(200).json({
        message: 'Booking statistics retrieved successfully',
        totalBookings: results.length,
        bookings: results.map(booking => ({
          BookingID: booking.BookingID,
          UserID: booking.UserID,
          UserName: booking.UserName,
          BookingDate: new Date(booking.BookingDate).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
          FlightID: booking.FlightID,
          Departure: booking.Departure,
          Arrival: booking.Arrival,
          DepartureTime: new Date(booking.DepartureTime).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
          ArrivalTime: new Date(booking.ArrivalTime).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          }),
          Price: booking.Price,
        })),
      });
    });
  });
};

  

// 7.Lấy thông tin tất cả tàu bay
export const getAllAircrafts = (req: Request, res: Response): void => {
  const { userID } = req.body;

  // Kiểm tra UserID có được gửi hay không
  if (!userID) {
    res.status(400).json({ message: 'userID is required' });
    return;
  }
  // Kiểm tra xem UserID có phải là Admin và tồn tại hay không
  checkUserIsAdmin(userID, (isAdmin, error) => {
    if (error) {
      res.status(500).json({
        message: 'Error checking user role',
        error: error.message,
      });
      return;
    }

    if (!isAdmin) {
      res.status(403).json({
        message: 'Permission denied: User does not exist or is not an admin',
      });
      return;
    }
    //Truy vấn lấy thông tin tất cả tàu bay
    const aircraftQuery = `
      SELECT 
        AircraftID, 
        Model, 
        Manufacturer, 
        Capacity, 
        RangeKm, 
        Description
      FROM Aircrafts
      ORDER BY AircraftID ASC
    `;
    connection.query(aircraftQuery, (err, results: RowDataPacket[]) => {
      if (err) {
        console.error('Error fetching aircrafts:', err);
        res.status(500).json({ message: 'Failed to fetch aircraft information' });
        return;
      }
      // Trả về kết quả
      res.status(200).json({
        message: 'Aircraft information retrieved successfully',
        totalAircrafts: results.length,
        aircrafts: results
      });
    });
  });
};
//8. Xóa tàu bay
export const deleteAircraft = (req: Request, res: Response): void => {
  const { userID, aircraftID } = req.body;

  // Kiểm tra xem UserID và AircraftID có tồn tại không
  if (!userID || !aircraftID) {
    res.status(400).json({ message: 'UserID and AircraftID are required' });
    return;
  }

  //Kiểm tra xem UserID có phải Admin hoặc tồn tại hay không ?
  checkUserIsAdmin(userID, (isAdmin, error) => {
    if (error) {
      res.status(500).json({
        message: 'Error checking user role',
        error: error.message,
      });
      return;
    }

    if (!isAdmin) {
      res.status(403).json({
        message: 'Permission denied: User does not exist or is not an admin',
      });
      return;
    }

    //Xóa tàu bay
    const deleteQuery = 'DELETE FROM Aircrafts WHERE AircraftID = ?';
    connection.query(deleteQuery, [aircraftID], (err, results: any) => {
      if (err) {
        console.error('Error deleting aircraft:', err);
        res.status(500).json({ message: 'Failed to delete aircraft' });
        return;
      }

      // Kiểm tra xem có hàng nào bị ảnh hưởng không
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Aircraft not found or already deleted' });
        return;
      }

      // Trả về kết quả thành công
      res.status(200).json({ message: 'Aircraft deleted successfully' });
    });
  });
};
//9. Sửa thông tin tàu bay
export const updateAircraft = (req: Request, res: Response): void => {
  const { UserID, AircraftID, Model, Manufacturer, Capacity, RangeKm, Description } = req.body;

  // Kiểm tra các trường dữ liệu có đầy đủ hay không
  if (!UserID || !AircraftID) {
    res.status(400).json({ message: 'UserID and AircraftID are required' });
    return;
  }

  //Kiểm tra xem UserID có phải là Admin không
  const adminQuery = 'SELECT Role FROM Users WHERE UserID = ?';
  connection.query(adminQuery, [UserID], (err, results: RowDataPacket[]) => {
    if (err) {
      console.error('Error checking user role:', err);
      res.status(500).json({ message: 'Failed to verify user role' });
      return;
    }

    // Kiểm tra quyền Admin
    if (!Array.isArray(results) || results.length === 0 || results[0].Role !== 'Admin') {
      res.status(403).json({ message: 'Permission denied: Only admins can update aircraft information' });
      return;
    }
    // Xây dựng câu lệnh UPDATE để sửa thông tin tàu bay
    const updateQuery = `
      UPDATE Aircrafts 
      SET 
        Model = COALESCE(?, Model), 
        Manufacturer = COALESCE(?, Manufacturer), 
        Capacity = COALESCE(?, Capacity), 
        RangeKm = COALESCE(?, RangeKm), 
        Description = COALESCE(?, Description)
      WHERE AircraftID = ?
    `;
    connection.query(
      updateQuery,
      [Model, Manufacturer, Capacity, RangeKm, Description, AircraftID],
      (err, results: any) => {
        if (err) {
          console.error('Error updating aircraft:', err);
          res.status(500).json({ message: 'Failed to update aircraft information' });
          return;
        }

        // Kiểm tra nếu không có hàng nào bị ảnh hưởng
        if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Aircraft not found or no changes made' });
          return;
        }

        // Trả về kết quả thành công
        res.status(200).json({ message: 'Aircraft information updated successfully' });
      }
    );
  });
};

//10. Sửa chuyến bay
export const editFlight = (req: Request, res: Response): void => {
  const {
      userID,
      flightID,
      model,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      price,
      seatsAvailable,
      status
  } = req.body;

  // Kiểm tra đầu vào
  if (!userID || !flightID || !model) {
      res.status(400).json({
          message: 'Missing required fields: userID, flightID, or model',
      });
      return;
  }

  // Kiểm tra UserID có tồn tại và có phải Admin không
  checkUserIsAdmin(userID, (isAdmin, error) => {
      if (error) {
          res.status(500).json({
              message: 'Error checking user role',
              error: error.message,
          });
          return;
      }

      if (!isAdmin) {
          res.status(403).json({
              message: 'Permission denied: User is not an admin',
          });
          return;
      }

      // Lấy AircraftTypeID từ Model
      const getAircraftQuery = 'SELECT AircraftID FROM Aircrafts WHERE Model = ?';
      connection.query(getAircraftQuery, [model], (err, results) => {
          if (err) {
              console.error('Error fetching aircraft:', err.stack);
              res.status(500).json({
                  message: 'Internal Server Error',
                  error: err.message,
              });
              return;
          }

          if ((results as RowDataPacket[]).length === 0) {
              res.status(404).json({
                  message: 'Aircraft model not found',
              });
              return;
          }

          const aircraftTypeID = (results as RowDataPacket[])[0].AircraftID;

          // Kiểm tra FlightID có tồn tại không
          const checkFlightQuery = 'SELECT * FROM Flights WHERE FlightID = ?';
          connection.query(checkFlightQuery, [flightID], (err, results) => {
              if (err) {
                  console.error('Error checking flight existence:', err.stack);
                  res.status(500).json({
                      message: 'Internal Server Error',
                      error: err.message,
                  });
                  return;
              }

              if ((results as RowDataPacket[]).length === 0) {
                  res.status(404).json({
                      message: 'Flight not found',
                  });
                  return;
              }

              // Thực hiện cập nhật chuyến bay
              const updateQuery = `
                  UPDATE Flights 
                  SET 
                      AircraftTypeID = ?,
                      Departure = ?,
                      Arrival = ?,
                      DepartureTime = ?,
                      ArrivalTime = ?,
                      Price = ?,
                      SeatsAvailable = ?,
                      Status = ?
                  WHERE FlightID = ?
              `;

              connection.query(
                  updateQuery,
                  [
                      aircraftTypeID,
                      departure,
                      arrival,
                      departureTime,
                      arrivalTime,
                      price,
                      seatsAvailable,
                      status,
                      flightID
                  ],
                  (err, results) => {
                      if (err) {
                          console.error('Error updating flight:', err.stack);
                          res.status(500).json({
                              message: 'Failed to update flight',
                              error: err.message,
                          });
                          return;
                      }

                      const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
                      res.status(200).json({
                          message: 'Flight updated successfully',
                          flightID,
                          timestamp,
                      });
                  }
              );
          });
      });
  });
};
