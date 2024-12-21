"use client";

import React, { useEffect, useState } from "react";
import styles from "./customerManagement.module.css";

interface Booking {
  BookingID: number;
  UserID: string;
  UserName: string;
  BookingDate: string;
  FlightID: string;
  Departure: string;
  Arrival: string;
  DepartureTime: string;
  ArrivalTime: string;
  Price: number;
}

interface APIResponse {
  message: string;
  totalBookings: number;
  timestamp: string;
  bookings: Booking[];
}

// Hàm lấy userID từ localStorage
const getUserID = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = JSON.parse(atob(token.split(".")[1]));
  return decoded.userid;
};

const TableContainer = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [filteredData, setFilteredData] = useState<Booking[]>([]);
  const [searchDate, setSearchDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalBookings: number;
    timestamp: string;
  } | null>(null);

  // Fetch API
  useEffect(() => {
    const fetchData = async () => {
      const userID = getUserID(); // Hàm lấy userID từ token
      if (!userID) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/api/Bookings/ViewAndSummarize",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID }),
          }
        );

        const result = await response.json();

        // Kiểm tra status code
        if (!response.ok) {
          setError(result.message || "Failed to fetch data.");
          return;
        }

        // Thành công: Cập nhật dữ liệu
        setData(result.bookings || []);
        setFilteredData(result.bookings || []);
        setSummary({
          totalBookings: result.totalBookings,
          timestamp: result.timestamp,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  // Lọc dữ liệu theo `BookingDate`
  useEffect(() => {
    if (searchDate) {
      setFilteredData(
        data.filter(
          (booking) =>
            booking.BookingDate && // Kiểm tra BookingDate không bị undefined
            booking.BookingDate.includes(searchDate) // Sử dụng includes để kiểm tra
        )
      );
    } else {
      setFilteredData(data); // Nếu không có tìm kiếm, hiển thị toàn bộ dữ liệu
    }
  }, [searchDate, data]);
  
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>---Customers Management---</h1>
      {summary && (
        <div className={styles.summary}>
          <p>Total Bookings: {summary.totalBookings}</p>
          <p>Last Updated: {new Date(summary.timestamp).toLocaleString()}</p>
        </div>
      )}
      <input
        type="text"
        className={styles.searchBar}
        value={searchDate}
        onChange={handleSearchChange}
        placeholder="Search by Booking Date"
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>BookID</th>
              <th>UserID</th>
              <th>UserName</th>
              <th>BookingDate</th>
              <th>FlightID</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>DepartureTime</th>
              <th>ArrivalTime</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((booking) => (
              <tr key={booking.BookingID}>
                <td>{booking.BookingID}</td>
                <td>{booking.UserID}</td>
                <td>{booking.UserName}</td>
                <td>{booking.BookingDate}</td>
                <td>{booking.FlightID}</td>
                <td>{booking.Departure}</td>
                <td>{booking.Arrival}</td>
                <td>{booking.DepartureTime}</td>
                <td>{booking.ArrivalTime}</td>
                <td>${booking.Price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableContainer;
