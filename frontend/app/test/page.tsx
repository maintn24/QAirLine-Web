'use client'
import React, { useState } from 'react';
import SearchBar from '@/app/components/SearchBar';

const TestPage = () => {
    const [search, setSearch] = useState({
        startDestination: '',
        arriveDestination: '',
        startDate: '',
        arriveDate: '',
        startDestinationOptions: ['New York (JFK)', 'Chicago (ORD)', 'San Francisco (SFO)'],
        arriveDestinationOptions: ['Los Angeles (LAX)', 'Miami (MIA)', 'Seattle (SEA)'],
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setSearch((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        // Implement search logic if needed
    };

    return (
        <div>
            <h1>Test Page for Components</h1>
            <br/>
            <h2>SearchBar</h2>
            <div>Nhập dữ liệu vào thanh tìm kiếm, nhấn Enter sẽ chuyển hướng sang page Bookings và nhập dữ liệu vừa nhập vào Bookings luôn thông qua search params</div>
            <SearchBar
                search={search}
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
                quickSearchBar={true}
            />
        </div>
    );
};

export default TestPage;