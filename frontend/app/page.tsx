'use client'
import style from "@/app/UI/Mainpage.module.css";
import { useState } from "react";
import "@/app/UI/global.css";
import SearchBar from "./components/SearchBar";


export default function Home() {
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
      console.log(search);
  };

  return (
    <main>
      <div className={style.main_image}>
        <img src="Image&Icon/image_mainpage.png" alt="Main image"></img>
      </div>
      
      <div className="searchBar">
        <h1 className="text-center font-bold mb-4 text-lg">----------Book Flights----------</h1>
        <SearchBar
          search={search}
          handleInputChange={handleInputChange}
          handleSearch={handleSearch}
          quickSearchBar={true}
        />
      </div>
      
      <div className="offers">
        <h1 className="text-center font-bold mb-4 text-lg">----------Offers----------</h1>
  
      </div>

      <div className={style.hotDes}>
        <h1 className="text-center font-bold mb-4 text-lg">----------Hot Destination----------</h1>
        <div className={style.destinations}>
          <div className={style.destinationCard}>
            <img src="hotDestination/HaLongBay.png" alt="Halong Bay, Vietnam" />
            <div className={style.destinationInfo}>Halong Bay, Vietnam</div>
          </div>
          <div className={style.destinationCard}>
            <img src="hotDestination/HaNoi.png" alt="Hanoi, Vietnam" />
            <div className={style.destinationInfo}>Hanoi, Vietnam</div>
          </div>
          <div className={style.destinationCard}>
            <img src="hotDestination/DaNang.png" alt="Danang, Vietnam" />
            <div className={style.destinationInfo}>Danang, Vietnam</div>
          </div>
        </div>
      </div>
    </main>
  );
}
