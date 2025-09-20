import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import'./Token.css'

const Token = () => {
  const location = useLocation();
  const shop = location.state?.shop || null;
  const [availableTokens, setAvailableTokens] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBarber, setSelectedBarber] = useState("");

  useEffect(() => {
    if (shop && shop.openHours) {
      generateTimeSlots(shop.openHours);
    }

    // Update the current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [shop]);

  const formatTime = (hour) => {
    let period = hour >= 12 ? "PM" : "AM";
    let formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };

  const convertTo24HourFormat = (time) => {
    let [hour, period] = time.match(/\d+|\w+/g);
    hour = parseInt(hour, 10);
    if (period.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
    } else if (period.toLowerCase() === "am" && hour === 12) {
      hour = 0;
    }
    return hour;
  };

  const generateTimeSlots = (openHours) => {
    const [start, end] = openHours.replace(/\s/g, "").split("to");
    let startHour = convertTo24HourFormat(start);
    let endHour = convertTo24HourFormat(end);

    let slots = [];
    let tokenNumber = 1;

    while (startHour < endHour) {
      let nextHour = startHour + 1;

      if (startHour === 12) {
        // Add the Lunch Break token with its time slot (without a Book option)
        slots.push({ token: "Lunch Break", timeSlot: "12:00 PM - 1:00 PM" });
      } else {
        // Add normal token numbers with time slots
        slots.push({
          token: tokenNumber++,
          timeSlot: `${formatTime(startHour)} - ${formatTime(nextHour)}`,
        });
      }

      startHour = nextHour;
    }

    setAvailableTokens(slots);
  };

  return (
    <div className="token-container">
      <h2>{shop ? `${shop.shopName} - Token List` : "No Shop Selected"}</h2>
      <h3>{currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}</h3>

      {shop && shop.barberNames && shop.barberNames.length > 0 && (
        <div className="barber-selection">
          <h2>Select a Barber</h2>
          <div className="barber-scroll">
            {shop.barberNames.map((barber, index) => (
              <label key={index} className="barber-radio">
                <input
                  type="radio"
                  name="barber"
                  value={barber}
                  checked={selectedBarber === barber}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                />
                {barber}
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedBarber && (
        <>
          <h4>Available Time Slots for {selectedBarber}</h4>
          <div className="token-list">
            {availableTokens.map((slot, index) => (
              <div key={index} className={`token-item ${slot.token === "Lunch Break" ? "lunch-break" : ""}`}>
                {/* Token display */}
                <div className="token-number">
                  {slot.token === "Lunch Break" ? `${slot.token} (${slot.timeSlot})` : slot.token}
                </div>
                {/* Display Time Slot */}
                {slot.token !== "Lunch Break" && (
                  <div className="time-slot">
                    {slot.timeSlot}
                  </div>
                )}
                {/* Book option hidden for Lunch Break */}
                {slot.token !== "Lunch Break" && (
                  <button className="book-button">Book</button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Token;
