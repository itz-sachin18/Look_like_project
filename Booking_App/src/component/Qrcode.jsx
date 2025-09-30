
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import axios from "axios";

const QrCode = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userId, bookingDate, time, adminId, returnPath } = state || {};

  // Log the received state data for debugging
  console.log("[QRCODE] Received state data:", { userId, bookingDate, time, adminId, returnPath });

  const [showScanner, setShowScanner] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Current date and time: June 2, 2025, 09:41 PM IST
  const currentDateTime = new Date("2025-06-02T21:41:00+05:30");
  console.log("[QRCODE] Current date and time:", currentDateTime.toISOString());

  const parseBookingDateTime = (bookingDate, time) => {
    try {
      const [month, day, year] = bookingDate.split("/").map(Number);
      const [startTime] = time.split(" to ");
      const bookingDateTimeStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${startTime}`;
      const parsedDate = new Date(bookingDateTimeStr + " +05:30");
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date or time format in QR code.");
      }
      console.log("[QRCODE] Parsed booking date-time:", parsedDate.toISOString());
      return parsedDate;
    } catch (err) {
      throw new Error("Invalid date or time format in QR code.");
    }
  };

  const normalizeDateFormat = (dateStr, assumeDMY = false) => {
    // Split the date string
    const [part1, part2, year] = dateStr.split("/").map(Number);
    
    let month, day;
    if (assumeDMY) {
      // If assuming D/M/YYYY format, swap the parts
      day = part1;
      month = part2;
    } else {
      // Otherwise assume M/D/YYYY format
      month = part1;
      day = part2;
    }

    // Validate month and day
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      throw new Error("Invalid date components in QR code.");
    }

    // Return in M/D/YYYY format
    return `${month}/${day}/${year}`;
  };

  const updateAppointmentStatus = async () => {
    try {
      await axios.put(
import { API_BASE_URL } from '../apiConfig';
// ...existing code...
  `${API_BASE_URL}/api/bookings/${userId}`,
        { status: "completed" },
        { withCredentials: true }
      );
      console.log("[QRCODE] Appointment status updated to completed for userId:", userId);
    } catch (err) {
      console.error("[QRCODE] Error updating appointment status:", err);
      throw new Error("Failed to update appointment status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleScan = async (data) => {
    console.log("[QRCODE] handleScan called. Scanned data:", data);
    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      setQrData(parsed);

      // Normalize the bookingDate from QR code data
      // First try assuming M/D/YYYY format
      let normalizedQrBookingDate = normalizeDateFormat(parsed.bookingDate, false);
      let dateMatches = normalizedQrBookingDate === bookingDate;

      // If the dates don't match, try assuming D/M/YYYY format
      if (!dateMatches) {
        console.log("[QRCODE] Date mismatch with M/D/YYYY assumption, trying D/M/YYYY...");
        normalizedQrBookingDate = normalizeDateFormat(parsed.bookingDate, true);
        dateMatches = normalizedQrBookingDate === bookingDate;
      }

      // Log the comparison data
      console.log("[QRCODE] Comparing QR data with passed data:", {
        qrUserId: parsed.userId,
        passedUserId: userId,
        qrBookingDate: normalizedQrBookingDate,
        passedBookingDate: bookingDate,
        qrTime: parsed.time,
        passedTime: time,
      });

      // Validate each field individually for detailed error reporting
      const userIdMatches = parsed.userId === userId;
      dateMatches = normalizedQrBookingDate === bookingDate;
      const timeMatches = parsed.time === time;

      // Log which fields match or mismatch
      console.log("[QRCODE] Validation breakdown:", {
        userIdMatches,
        dateMatches,
        timeMatches,
      });

      const isDataValid = userIdMatches && dateMatches && timeMatches;

      let isDateTimeValid = false;
      let dateTimeValidationMessage = "";
      if (isDataValid) {
        try {
          const bookingDateTime = parseBookingDateTime(normalizedQrBookingDate, parsed.time);
          isDateTimeValid = bookingDateTime > currentDateTime;
          console.log("[QRCODE] Date-time validation:", {
            bookingDateTime: bookingDateTime.toISOString(),
            currentDateTime: currentDateTime.toISOString(),
            isDateTimeValid,
          });
          if (!isDateTimeValid) {
            dateTimeValidationMessage = "Booking is in the past.";
          }
        } catch (err) {
          setScanError(err.message);
          setValidationResult("invalid-datetime");
          console.log("[QRCODE] Date-time validation failed:", err.message);
          return;
        }
      }

      if (isDataValid && isDateTimeValid) {
        await updateAppointmentStatus();
        setValidationResult("success");
      } else if (!isDataValid) {
        setValidationResult("invalid-data");
        // Provide a specific error message based on which field failed
        if (!userIdMatches) {
          setScanError("User ID does not match the appointment.");
        } else if (!dateMatches) {
          setScanError(`Booking date does not match. Expected: ${bookingDate}, Scanned: ${parsed.bookingDate} (interpreted as ${normalizedQrBookingDate})`);
        } else if (!timeMatches) {
          setScanError(`Time does not match. Expected: ${time}, Scanned: ${parsed.time}`);
        }
      } else {
        setValidationResult("invalid-datetime");
        setScanError(dateTimeValidationMessage);
      }

      console.log(
        `[QRCODE] Scan result: ${isDataValid && isDateTimeValid ? "VALID" : "INVALID"}`,
        parsed
      );
      console.log("[QRCODE] Validation result:", validationResult);

      if (isDataValid && isDateTimeValid) {
        setTimeout(() => {
          setShowScanner(false);
          setShowSuccess(true);
        }, 1200);
        setTimeout(() => {
          const navData = {
            adminId,
            updatedUserId: userId,
            newStatus: "completed",
          };
          console.log("[QRCODE] Navigating to", returnPath || "/appointments", "with data:", navData);
          navigate(returnPath || "/appointments", {
            state: navData,
          });
        }, 2400);
      }
    } catch (err) {
      setQrData(null);
      setValidationResult("invalid");
      setScanError("Invalid QR code format: " + err.message);
      console.error("[QRCODE] Error parsing QR code data:", err, data);
    }
  };

  const handleError = (err) => {
    console.error("[QRCODE] QR scan error:", err);
  };

  const handleCloseMessage = () => {
    setShowScanner(false);
    setQrData(null);
    setValidationResult(null);
    setScanError(null);
    setShowSuccess(false);
    if (validationResult === "success") {
      const navData = {
        adminId,
        updatedUserId: userId,
        newStatus: "completed",
      };
      console.log("[QRCODE] Navigating to", returnPath || "/appointments", "with data:", navData);
      navigate(returnPath || "/appointments", {
        state: navData,
      });
    }
  };

  return (
    <div>
      <button
        style={{
          padding: "10px 18px",
          background: "#1e3a8a",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: 500,
          cursor: "pointer",
        }}
        onClick={() => {
          setShowScanner(true);
          setQrData(null);
          setValidationResult(null);
          setScanError(null);
          setShowSuccess(false);
          console.log("[QRCODE] Scanner opened");
        }}
      >
        Scan QR Code
      </button>

      {showScanner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "430px",
              width: "95%",
              textAlign: "center",
              position: "relative",
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Scan QR Code</h2>
            <div
              style={{
                position: "relative",
                width: 320,
                height: 220,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 320,
                  height: 220,
                  border: "3px solid #1e3a8a",
                  borderRadius: "12px",
                  boxSizing: "border-box",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  if (result?.text) {
                    handleScan(result.text);
                  }
                  if (error) {
                    handleError(error);
                  }
                }}
                videoContainerStyle={{
                  width: 320,
                  height: 220,
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#000",
                }}
                videoStyle={{
                  width: 320,
                  height: 220,
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
                containerStyle={{
                  width: 320,
                  height: 220,
                  margin: "0 auto",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>
            <button
              style={{
                marginTop: 18,
                padding: "8px 16px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
              }}
              onClick={() => {
                setShowScanner(false);
                setQrData(null);
                setValidationResult(null);
                setScanError(null);
                setShowSuccess(false);
                console.log("[QRCODE] Scanner closed");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {(showSuccess || validationResult === "invalid" || validationResult === "invalid-data" || validationResult === "invalid-datetime") && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "430px",
              width: "95%",
              textAlign: "center",
            }}
          >
            {showSuccess && (
              <div
                style={{
                  background: "rgba(16,185,129,0.15)",
                  color: "#10b981",
                  padding: "20px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                Booking Confirmed Successfully!
              </div>
            )}
            {validationResult === "invalid" && (
              <div
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "#ef4444",
                  padding: "20px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                Invalid QR code or booking details do not match.
              </div>
            )}
            {validationResult === "invalid-data" && (
              <div
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "#ef4444",
                  padding: "20px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {scanError || "QR code data does not match the appointment details."}
              </div>
            )}
            {validationResult === "invalid-datetime" && (
              <div
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "#ef4444",
                  padding: "20px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                {scanError || "Invalid date or time."}
              </div>
            )}
            {scanError && validationResult !== "invalid-datetime" && validationResult !== "invalid-data" && (
              <div
                style={{
                  marginTop: 12,
                  background: "rgba(239,68,68,0.10)",
                  color: "#ef4444",
                  padding: "10px",
                  borderRadius: "6px",
                  fontWeight: 500,
                }}
              >
                {scanError}
              </div>
            )}
            <button
              style={{
                marginTop: 18,
                padding: "8px 24px",
                background: showSuccess ? "#10b981" : "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: showSuccess ? "0 1px 4px rgba(16,185,129,0.12)" : "0 1px 4px rgba(239,68,68,0.12)",
              }}
              onClick={handleCloseMessage}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCode;
