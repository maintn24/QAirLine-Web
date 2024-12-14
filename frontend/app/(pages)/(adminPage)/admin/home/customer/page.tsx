"use client";

import React, { useEffect, useState } from "react";
import styles from "./customerManagement.module.css";

interface CustomerData {
  id: number;
  plane: string;
  flightHour: string;
  from: string;
  to: string;
  ticketType: string;
  username: string;
}

const TableContainer = () => {
  const [data, setData] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://sample.com/api/data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result); // Giả sử API trả về mảng
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Customers Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Plane</th>
              <th>Flight hour</th>
              <th>From</th>
              <th>To</th>
              <th>Ticket Type</th>
              <th>UserName</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.plane}</td>
                <td>{item.flightHour}</td>
                <td>{item.from}</td>
                <td>{item.to}</td>
                <td>{item.ticketType}</td>
                <td>{item.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableContainer;
