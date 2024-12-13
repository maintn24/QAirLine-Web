"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Chỉ định kiểu cho dropdownRef
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Đặt kiểu là HTMLDivElement

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  // Đóng dropdown khi người dùng click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Dọn dẹp listener khi component bị unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block", textAlign: "center" }} ref={dropdownRef}>
      {/* Button chính hiển thị Manage */}
      <button
        onClick={toggleDropdown}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#167db5",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Manage
      </button>

      {/* Dropdown hiển thị các tùy chọn */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            left: 0,
            backgroundColor: "#f5f5f5",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "0.5rem",
            zIndex: 10,
            width: "150px",
            textAlign: "left",
          }}
        >
          {/* Danh sách các option */}
          <ul style={{ listStyle: "none", padding: "0.5rem", margin: 0 }}>
            {["offer", "aircraft", "flight", "customer"].map((option) => (
              <li key={option} style={{ margin: "0.5rem 0" }}>
                <button
                  onClick={() => handleOptionClick(`/admin/home/${option}`)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0.5rem",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "0.25rem",
                    color: "#333",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)} {/* Viết hoa chữ cái đầu */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
