import React, { useState } from "react";
import "./Userbooking.css"

const UserBookingPage = () => {
  const [selectedShop, setSelectedShop] = useState("");
  const [barbersCount, setBarbersCount] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);

  const barbershops = [
    { id: 1, name: "Downtown Barber", barbers: 3 },
    { id: 2, name: "Uptown Hair Studio", barbers: 5 },
    { id: 3, name: "Elite Barber Co.", barbers: 4 },
  ];

  const handleShopSelection = (shopId) => {
    const shop = barbershops.find((s) => s.id === shopId);
    setSelectedShop(shop.name);
    setBarbersCount(shop.barbers);
    setTokenCount(shop.barbers); // Generate tokens equal to available barbers
  };

  return (
    <div className="container">
      <h1 className="title">User Booking Page</h1>
      <div className="box">
        <label htmlFor="shop-select" className="label">
          Select Barbershop:
        </label>
        <select
          id="shop-select"
          className="dropdown"
          onChange={(e) => handleShopSelection(parseInt(e.target.value, 10))}
        >
          <option value="">-- Select --</option>
          {barbershops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      {selectedShop && (
        <>
          <div className="info">
            <p>Selected Shop: <strong>{selectedShop}</strong></p>
            <p>Barbers Available: <strong>{barbersCount}</strong></p>
          </div>
          <div className="tokens">
            <h2>Tokens</h2>
            <div className="token-container">
              {Array.from({ length: tokenCount }).map((_, index) => (
                <div key={index} className="token">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserBookingPage;
