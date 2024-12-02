// models/db.ts
import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load biến môi trường từ file .env
dotenv.config();

// Cấu hình kết nối MySQL
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Kết nối tới MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL successful');
});

export default connection;
