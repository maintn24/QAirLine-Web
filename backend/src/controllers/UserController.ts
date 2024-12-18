import { Request, Response } from 'express';
import connection from '../database/database';
import { OkPacket } from 'mysql2'; 
// Chức năng xem tất cả người dùng
export const getAllUsers = (req: Request, res: Response): void => {
  const query = 'SELECT * FROM Users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
      return;
    }

    if ((results as any).length === 0) {
      res.status(404).json({ message: 'No users found' });
      return;
    }

    res.status(200).json(results);
  });
};

// Chức năng xóa người dùng
export const deleteUser = (req: Request, res: Response): void => {
  const { UserID } = req.body;

  // Kiểm tra xem userID có tồn tại hay không
  if (!UserID) {
    res.status(400).json({ message: 'Missing required field: userID' });
    return;
  }

  // Truy vấn xóa người dùng
  const query = 'DELETE FROM Users WHERE UserID = ?';

  connection.query(query, [UserID], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
      return;
    }

    const result = results as OkPacket;

    // Nếu không tìm thấy người dùng để xóa
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Trả thông báo thành công
    res.status(200).json({ message: 'User deleted successfully' });
  });
};
