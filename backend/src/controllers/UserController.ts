import { Request, Response } from 'express';
import connection from '../database/database';

// Hàm thêm user mới
export const addUser = (req: Request, res: Response): void => {
  const { username, email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !email || !password) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  // Truy vấn SQL để thêm user mới
  const query = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
  connection.query(query, [username, email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
      return;
    }

    res.status(201).json({
      message: 'User added successfully',
      userID: (results as any).insertId,
    });
  });
};
