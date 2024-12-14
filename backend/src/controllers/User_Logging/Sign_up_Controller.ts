import mysql from 'mysql2'; // Import thư viện mysql2
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from 'D:/DevWeb/QAirLine-Web-Development/backend/src/database/database'; // Import kết nối từ file database.ts

export const signUp = (req: Request, res: Response) => {
  const { Name, Username, Email, Password, Role } = req.body;

  // Kiểm tra xem tên người dùng đã tồn tại hay chưa
  connection.execute('SELECT * FROM Users WHERE Username = ? OR Email = ?', [Username, Email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error querying database' });
    }

    const rows = results as any[];

    // Kiểm tra nếu đã tồn tại người dùng với Username hoặc Email
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Error hashing password' });
      }

      // Thêm người dùng mới vào cơ sở dữ liệu
      connection.execute(
        'INSERT INTO Users (Name, Username, Email, Password, Role) VALUES (?, ?, ?, ?, ?)',
        [Name, Username, Email, hashedPassword, Role],
        (err, results) => {
          if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ message: 'Error inserting user into database' });
          }

          // Ép kiểu kết quả trả về của execute để sử dụng insertId
          const result = results as mysql.ResultSetHeader;
          
          // Tạo JWT token cho người dùng mới đăng ký
          const token = jwt.sign(
            { UserID: result.insertId, Username, Role },
            'secret_key',  // Secret key (nên thay bằng giá trị thực tế khi triển khai)
            { expiresIn: '1h' }
          );

          // Trả về thông báo đăng ký thành công và token
          res.status(201).json({
            message: 'Sign up successful',
            token,
          });
        }
      );
    });
  });
};
