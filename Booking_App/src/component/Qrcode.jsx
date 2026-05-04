
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import BASE_URL from "../api";

const QrCode = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userId, bookingDate, time, adminId, returnPath } = state || {};

  // Log the received state data for debugging
  console.log("[QRCODE] Received state data:", { userId, bookingDate, time, adminId, returnPath });

  const [showScanner, setShowScanner] = useState(true); // Show scanner automatically on page load
  const [qrData, setQrData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("adminId");
      navigate("/barberlogin");
    }
  };

  // Current date and time: June 2, 2025, 09:41 PM IST
  const currentDateTime = new Date();
  console.log("[QRCODE] Current date and time:", currentDateTime.toISOString());

  // Initialize component and check permissions
  useEffect(() => {
    console.log("[QRCODE] Component initialized, showScanner:", showScanner);
    
    // Check if we have required data
    if (!userId || !bookingDate || !time) {
      console.warn("[QRCODE] Missing required data:", { userId, bookingDate, time });
    }

    // Request camera permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          console.log("[QRCODE] Camera permission granted");
          // Stop the stream as we just wanted to check permission
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          console.error("[QRCODE] Camera permission denied:", err);
          setScanError("Camera permission denied. Please allow camera access to scan QR codes.");
        });
    }
  }, []);

  const parseBookingDateTime = (bookingDate, time, isEndTime = false) => {
    try {
      const [month, day, year] = bookingDate.split("/").map(Number);
      const [startTime, endTime] = time.split(" to ");
      const timeToUse = isEndTime ? endTime.trim() : startTime.trim();
      const bookingDateTimeStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${timeToUse}`;
      const parsedDate = new Date(bookingDateTimeStr + " +05:30");
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date or time format in QR code.");
      }
      console.log(`[QRCODE] Parsed booking ${isEndTime ? 'end' : 'start'} date-time:`, parsedDate.toISOString());
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
        `${BASE_URL}/api/bookings/${userId}`,
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
          const appointmentStartTime = parseBookingDateTime(normalizedQrBookingDate, parsed.time, false);
          const appointmentEndTime = parseBookingDateTime(normalizedQrBookingDate, parsed.time, true);
          
          console.log("[QRCODE] Time window validation:", {
            appointmentStartTime: appointmentStartTime.toISOString(),
            appointmentEndTime: appointmentEndTime.toISOString(),
            currentDateTime: currentDateTime.toISOString(),
          });

          // Check if current time is BETWEEN appointment start and end time
          const isWithinTimeWindow = currentDateTime >= appointmentStartTime && currentDateTime <= appointmentEndTime;
          const isBeforeAppointment = currentDateTime < appointmentStartTime;
          const isAfterAppointment = currentDateTime > appointmentEndTime;

          console.log("[QRCODE] Time validation breakdown:", {
            isWithinTimeWindow,
            isBeforeAppointment,
            isAfterAppointment,
          });

          if (isWithinTimeWindow) {
            isDateTimeValid = true;
          } else if (isBeforeAppointment) {
            dateTimeValidationMessage = `Cannot scan before appointment time. Appointment starts at ${parsed.time.split(" to ")[0]}`;
          } else if (isAfterAppointment) {
            dateTimeValidationMessage = "❌ Cannot book another ticket - appointment time has ended. Status will auto-complete.";
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
        setQrData(parsed);
        console.log("[QRCODE] ✅ QR APPROVED - Scan successful within appointment window");
      } else if (!isDataValid) {
        setValidationResult("invalid-data");
        // Provide a specific error message based on which field failed
        if (!userIdMatches) {
          setScanError("❌ User ID does not match the appointment.");
        } else if (!dateMatches) {
          setScanError(`❌ Booking date does not match. Expected: ${bookingDate}, Scanned: ${parsed.bookingDate} (interpreted as ${normalizedQrBookingDate})`);
        } else if (!timeMatches) {
          setScanError(`❌ Time does not match. Expected: ${time}, Scanned: ${parsed.time}`);
        }
      } else {
        setValidationResult("invalid-datetime");
        setScanError("❌ " + dateTimeValidationMessage);
        console.log("[QRCODE] ❌ QR REJECTED - Outside appointment time window: " + dateTimeValidationMessage);
      }

      console.log(
        `[QRCODE] Scan result: ${isDataValid && isDateTimeValid ? "VALID" : "INVALID"}`,
        parsed
      );
      console.log("[QRCODE] Validation result:", validationResult);

      if (isDataValid && isDateTimeValid) {
        setTimeout(() => {
          setShowScanner(false);
        }, 500);
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
        }, 2000);
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
    } else {
      navigate(returnPath || "/appointments");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "auto",
            minHeight: "40px",
            padding: "8px 16px",
            border: 0,
            borderRadius: "8px",
            background: "#b42318",
            color: "#ffffff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#1e3a8a", marginBottom: "10px" }}>QR Code Validation</h1>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Scan the QR code from your booking confirmation to validate your appointment
          </p>
        </div>

        {/* Appointment Details */}
        {userId && bookingDate && time && (
          <div style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #e0e0e0",
          }}>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>User ID:</strong> {userId}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Booking Date:</strong> {bookingDate}
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              <strong>Time:</strong> {time}
            </p>
          </div>
        )}

        {/* Camera Ready Indicator */}
        <div style={{
          background: "#e8f5e9",
          border: "2px solid #4caf50",
          padding: "12px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "20px",
          color: "#2e7d32",
          fontWeight: 600,
        }}>
          📷 Camera Ready - Point your device at the QR code
        </div>

        {scanError && !showSuccess && (
          <div style={{
            background: "rgba(239,68,68,0.15)",
            color: "#ef4444",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: 600,
          }}>
            ⚠️ {scanError}
          </div>
        )}
      </div>

      {showScanner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.9)",
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
              maxWidth: "500px",
              width: "95%",
              textAlign: "center",
              position: "relative",
            }}
          >
            <h2 style={{ marginBottom: 16, color: "#1e3a8a" }}>Point Camera at QR Code</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
              Position the QR code from your booking confirmation in the frame below
            </p>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "350px",
                height: "280px",
                margin: "0 auto 16px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
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
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#000",
                }}
                videoStyle={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
                containerStyle={{
                  width: "100%",
                  height: "100%",
                  margin: "0 auto",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>
            <button
              style={{
                marginTop: 18,
                padding: "10px 20px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "14px",
              }}
              onClick={() => {
                setShowScanner(false);
                setQrData(null);
                setValidationResult(null);
                setScanError(null);
                setShowSuccess(false);
                console.log("[QRCODE] Scanner closed");
                navigate(returnPath || "/appointments");
              }}
            >
              ✕ Cancel & Go Back
            </button>
          </div>
        </div>
      )}

      {(showSuccess || validationResult === "success" || validationResult === "invalid" || validationResult === "invalid-data" || validationResult === "invalid-datetime") && (
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
            {(showSuccess || validationResult === "success") && (
              <div
                style={{
                  background: "rgba(16,185,129,0.15)",
                  color: "#10b981",
                  padding: "20px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                ✅ APPROVED - Appointment Confirmed!
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
                padding: "10px 24px",
                background: (showSuccess || validationResult === "success") ? "#10b981" : "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: (showSuccess || validationResult === "success") ? "0 2px 6px rgba(16,185,129,0.2)" : "0 2px 6px rgba(239,68,68,0.2)",
              }}
              onClick={handleCloseMessage}
            >
              {(showSuccess || validationResult === "success") ? "✓ Continue" : "← Try Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCode;
