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

    // Kiểm tra mật khẩu với bcrypt
    bcrypt.compare(password, user.Password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    });


      // Tạo JWT token
    const token = jwt.sign(
      { userid: user.UserID, email: user.Email, username: user.Username, name: user.Name, role: user.Role },  // Chuyển Username thành Email trong token
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
