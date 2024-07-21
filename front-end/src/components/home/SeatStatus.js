import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SeatStatus.css"; // 스타일을 정의한 CSS 파일

const SeatStatus = () => {
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get("/api/empty_status");
        setAvailableSeats(response.data.availableSeats);
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };

    fetchSeatData();
  }, []);

  return (
    <div className="seat-status-container">
      <div className="seat-status-header">
        <h3>빈백 예약현황</h3>
      </div>
      <div className="seat-status-content">
        <div className="seat-room">
          <div className="room-name">중앙도서관</div>
          <div className="room-seats">
            <span className="available-seats">
              가능한 예약 갯수 : {availableSeats} / 168
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatStatus;
