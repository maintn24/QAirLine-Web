import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from "../../database/database";  

export const signIn = (req: Request, res: Response) => {
  const { Email, Password } = req.body;  

  // Truy vấn tìm người dùng trong cơ sở dữ liệu bằng email
  connection.execute('SELECT * FROM Users WHERE Email = ?', [Email], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Error querying database' });
    }

    // Kiểm tra xem có người dùng hay không
    const rows = results as any[];
    if (rows.length === 0) {
      return res.status(404).json({message: 'User not found' });  // Nếu không tìm thấy user với email
    }

    const user = rows[0];

    // Kiểm tra mật khẩu với bcrypt
    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });  // Nếu mật khẩu không khớp
    }

    // Tạo JWT token
    const token = jwt.sign(
      { UserID: user.UserID, Email: user.Email, Role: user.Role },  // Chuyển Username thành Email trong token
      'secret_key',  // Secret key (nên lấy từ môi trường)
      { expiresIn: '1h' }
    );

    // Trả về token
    res.json({
      message: 'Sign in successful',
      token,
    });
  });
};
