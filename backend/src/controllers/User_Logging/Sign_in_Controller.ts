import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from "../../database/database";  

export const signIn = (req: Request, res: Response) => {
  const { email, password } = req.body;  // Đổi từ Username thành Email
  // Truy vấn tìm người dùng trong cơ sở dữ liệu bằng email
  connection.execute('SELECT * FROM Users WHERE Email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error querying database' });
    }

    // Kiểm tra xem có người dùng hay không
    const rows = results as any[];
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });  // Nếu không tìm thấy user với email
    }

    const user = rows[0];

    bcrypt.compare(password, user.Password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Nếu mật khẩu khớp, tạo JWT token
      const token = jwt.sign(
        {
          userid: user.UserID,
          email: user.Email,
          username: user.Username,
          name: user.Name,
          role: user.Role,
        },
        'secret_key', // Đổi 'secret_key' thành biến môi trường trong thực tế
        { expiresIn: '1h' }
      );

      // Gửi phản hồi token
      return res.json({
        message: 'Sign in successful',
        token,
      });
    });
  });
};
