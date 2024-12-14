DROP SCHEMA IF EXISTS `Flight` ;
CREATE SCHEMA IF NOT EXISTS `Flight` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `Flight` ;
-- Table Aircrafts
CREATE TABLE Aircrafts (
    AircraftID int AUTO_INCREMENT PRIMARY KEY, -- mã số duy nhất  mỗi loại máy bay.
    Model VARCHAR(100),
    Manufacturer VARCHAR(100),
    Capacity INT, -- số ghế
    RangeKm INT COMMENT 'Range in kilometers',
    Description TEXT COMMENT 'Additional details about the aircraft'
);
-- Table Users
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY, -- Tự động tăng	
    Name VARCHAR(100), -- tên đầy đủ 
    Username VARCHAR(100) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    Role ENUM('Customer', 'Admin','Non-Customer') NOT NULL -- Cài Role là User hoặc Customer hoặc Non-Customer
);	
-- Table Flights
CREATE TABLE Flights (
    FlightID INT AUTO_INCREMENT PRIMARY KEY, -- tự động tăng 
    AircraftTypeID INT, -- loại máy bay: 
    Departure VARCHAR(100),
    Arrival VARCHAR(100),
    DepartureTime DATETIME,
    ArrivalTime DATETIME,
    Price DECIMAL(10, 2),
    SeatsAvailable INT, -- só ghế còn trống 
    Status ENUM('on-time', 'delayed') DEFAULT 'on-time', -- delay hay không ?
    FOREIGN KEY (AircraftTypeID) REFERENCES Aircrafts(AircraftID)
);

-- Table Bookings
CREATE TABLE Bookings (
    BookingID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    FlightID INT,
    BookingStatus ENUM('confirmed', 'cancelled') DEFAULT 'confirmed', -- đã đặt vé đc hay chưa ?
    PaymentStatus ENUM('paid', 'unpaid') DEFAULT 'unpaid', -- đã thanh toán được hay chưa 
    BookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (FlightID) REFERENCES Flights(FlightID)
);

-- Table Notifications. Là DB về các khuyến mãi, thông báo từ admin,...
CREATE TABLE Notifications (
    PostID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255),
    Content TEXT,
    PostDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Type ENUM('promotion', 'news') -- khuyến mãi hoặc tin mới 
);

-- Table Payments
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    BookingID INT UNIQUE,
    Amount DECIMAL(10, 2), -- số tiền thanh toán 
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PaymentStatus ENUM('completed', 'pending') DEFAULT 'pending', -- thanh toán đc chưa ? 
    FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID)
);

INSERT INTO Aircrafts (Model, Manufacturer, Capacity, RangeKm, Description)
VALUES
    ('Boeing 737', 'Boeing', 160, 5000, 'A short to medium range aircraft with 160 seats.'),
    ('Airbus A320', 'Airbus', 180, 6000, 'A popular medium-range airliner with 180 seats.'),
    ('Boeing 787', 'Boeing', 250, 15000, 'A long-haul aircraft with modern amenities and 250 seats.'),
    ('Airbus A350', 'Airbus', 300, 16000, 'A long-haul, wide-body aircraft with 300 seats.'),
    ('Boeing 747', 'Boeing', 400, 12000, 'A large aircraft with 400 seats, suitable for long-haul flights.'),
	('Airbus A380', 'Airbus', 850, 15200, 'The largest commercial aircraft, suitable for high-capacity, long-haul flights.'),
    ('Embraer E190', 'Embraer', 100, 3700, 'A regional jet used for short to medium-haul routes.'),
    ('Bombardier CRJ900', 'Bombardier', 90, 3300, 'A regional jet typically used for short-haul flights.');
INSERT INTO Flights (AircraftTypeID, Departure, Arrival, DepartureTime, ArrivalTime, Price, SeatsAvailable, Status)
VALUES
    (1, 'New York', 'Los Angeles', '2024-12-10 08:00:00', '2024-12-10 11:30:00', 250.00, 160, 'on-time'),
    (2, 'San Francisco', 'Chicago', '2024-12-12 14:00:00', '2024-12-12 19:00:00', 200.00, 180, 'on-time'),
    (2, 'Chicago', 'London', '2024-12-15 21:00:00', '2024-12-16 09:00:00', 800.00, 200, 'delayed'),
    (3, 'Dubai', 'Paris', '2024-12-20 22:00:00', '2024-12-21 07:00:00', 1000.00, 250, 'on-time'),
    (6, 'Doha', 'Sydney', '2024-12-22 12:00:00', '2024-12-23 06:00:00', 1200.00, 350, 'on-time');
INSERT INTO Users (Name, Username, Email, Password, Role)
VALUES
    ('John Doe', 'john_doe', 'john@example.com', 'password123', 'Customer'),
    ('Jane Smith', 'jane_smith', 'jane@example.com', 'password456', 'Customer'),
    ('Alice Johnson', 'alice_johnson', 'alice@example.com', 'password789', 'Admin'),
    ('Bob Brown', 'bob_brown', 'bob@example.com', 'password101', 'Customer'),
    ('Charlie White', 'charlie_white', 'charlie@example.com', 'password202', 'Customer'),
    ('Tran Khanh Duy','duy','trankhanhduy332004@gmail.com','Duy1234$','Admin');
INSERT INTO Bookings (UserID, FlightID, BookingStatus, PaymentStatus, BookingDate)
VALUES
    (1, 1, 'confirmed', 'paid', '2024-12-01 10:00:00'),
    (1, 2, 'confirmed', 'unpaid', '2024-12-02 14:30:00'),
    (2, 3, 'cancelled', 'paid', '2024-12-05 16:00:00'),
    (3, 4, 'confirmed', 'paid', '2024-12-07 18:30:00'),
    (4, 5, 'confirmed', 'unpaid', '2024-12-09 09:00:00');
INSERT INTO Payments (BookingID, Amount, PaymentDate, PaymentStatus)
VALUES
    (4,250.00, '2024-12-01 10:05:00', 'completed'),
    (3,200.00, '2024-12-02 15:00:00', 'pending'),
    (1,800.00, '2024-12-05 16:30:00', 'completed'),
    (2,1000.00, '2024-12-07 19:00:00', 'completed'),
    (5,1200.00, '2024-12-09 09:05:00', 'pending');
INSERT INTO Notifications (Title, Content, PostDate, Type)
VALUES
    ('Holiday Sale', 'Get 20% off on flights this holiday season!', '2024-12-01 12:00:00', 'promotion'),
    ('Flight Delayed', 'Your flight from Chicago to London has been delayed by 2 hours.', '2024-12-15 22:00:00', 'news'),
    ('New Route Available', 'We are now offering flights from Paris to Dubai!', '2024-12-10 08:00:00', 'news');
ALTER TABLE Notifications
RENAME TO OFFER;
 ALTER TABLE OFFER
ADD COLUMN Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;