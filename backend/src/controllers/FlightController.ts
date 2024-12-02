import { Request, Response } from 'express';
import connection from '../models/FlightDB';
import { OkPacket } from 'mysql2'; 

//Hiệntất cả chuyến bay - demo
export const getAllFlights = (req: Request, res: Response) => {
  const query = 'SELECT * FROM Flights';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results); // Trả result dạng JSON
  });
};

// Thêm chuyến bay mới - demo
export const addFlight = (req: Request, res: Response): void => {
  // cần body
  const { AircraftTypeID, Departure, Arrival, DepartureTime, ArrivalTime, Price, SeatsAvailable, Status } = req.body;
  // Check hợp lệ data?
  if (!AircraftTypeID || !Departure || !Arrival || !DepartureTime || !ArrivalTime || !Price || !SeatsAvailable || !Status) {
    res.status(400).json({ message: "Missing required fields" }); // Trả về lỗi nếu thiếu dữ liệu
    return;
  }
  // query SQL thêm chuyến bay mới
  const query = 'INSERT INTO Flights (AircraftTypeID, Departure, Arrival, DepartureTime, ArrivalTime, Price, SeatsAvailable, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  // truy vấn INSERT
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
  //Cần body
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

    //Chuyến bay có bị xóa hay không
    const result = results as OkPacket;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Trả thông báo xóa thành công
    return res.status(200).json({ message: 'Flight deleted successfully' });
  });
};