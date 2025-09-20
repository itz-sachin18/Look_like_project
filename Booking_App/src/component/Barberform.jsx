"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Clock, Mail, MapPin, Store, User, Phone, FileText } from "lucide-react"
import "./barberform.css"

const Barberform = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Extract adminId from location.state or localStorage (fallback)
  const adminId = location.state?.adminId || localStorage.getItem("adminId")

  console.log("Admin ID in Barberform:", adminId) // Debugging log

  const [formData, setFormData] = useState({
    email: "",
    ownerName: "",
    ownerContact: "",
    shopName: "",
    description: "",
    openHours: "",
    address: "",
  })

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!adminId) {
      setError("Admin not logged in. Please log in first.")
      setIsSubmitting(false)
      return
    }

    if (Object.values(formData).some((value) => value.trim() === "")) {
      setError("Please fill in all fields before submitting.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Form data before submission:", formData)

      const response = await axios.post("http://localhost:5000/api/barbershops", {
        adminId, // Send admin ID
        ...formData,
      })

      const uniqueId = response.data.uniqueId
      setSuccessMessage("Shop registered successfully")
      setError("")

      setFormData({
        adminId,
        email: "",
        ownerName: "",
        ownerContact: "",
        shopName: "",
        description: "",
        openHours: "",
        address: "",
      })

      navigate("/add-barbers", { state: { uniqueId, adminId } })
    } catch (error) {
      setError(error.response?.data?.message || "Error registering shop")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-container">
      <div className="top-navigation">
        <div className="brand">
          <i className="fas fa-cut"></i>
          <span>LOOK LIKE</span>
        </div>
        <div className="top-nav-right">
          <div className="admin-info">
            <i className="fas fa-user-circle"></i>
            <span>Admin ID: {adminId}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo-section">
            <h2>Barbershop Admin</h2>
            <p className="admin-id">ID: {adminId}</p>
          </div>
          <nav className="nav-menu">
            <Link to="/barberhome" className="nav-item">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
            <Link to="/barberform" className="nav-item active">
              <i className="fas fa-store"></i>
              <span>Add Shops</span>
            </Link>
            <Link
              to="/appointments"
              state={{ adminId }}
              className="nav-item"
            >
              <i className="fas fa-calendar"></i>
              <span>Appointments</span>
            </Link>
            <Link to="/daily" className="nav-item">
              <i className="fas fa-clock"></i>
              <span>Daily Update</span>
            </Link>
          </nav>
        </div>

        <div className="main-content">
          <div className="content-wrapper">
            <div className="barber-form-container">
              <h1 className="barber-form-title">Add New Barbershop</h1>

              <div className="barber-form-card">
                <div className="barber-form-header">
                  <div className="barber-form-image">
                    <img
                      src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
                      alt="Barbershop"
                      className="barber-image"
                    />
                  </div>
                </div>

                <form className="barber-form" onSubmit={handleSubmit}>
                  <div className="barber-form-grid">
                    <div className="barber-form-field">
                      <label htmlFor="email" className="barber-form-label">
                        <Mail className="barber-form-icon" />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter Email"
                        className="barber-form-input"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="barber-form-field">
                      <label htmlFor="ownerName" className="barber-form-label">
                        <User className="barber-form-icon" />
                        Owner Name
                      </label>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        placeholder="Enter Owner Name"
                        className="barber-form-input"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="barber-form-field">
                      <label htmlFor="ownerContact" className="barber-form-label">
                        <Phone className="barber-form-icon" />
                        Owner Contact
                      </label>
                      <input
                        type="text"
                        id="ownerContact"
                        name="ownerContact"
                        value={formData.ownerContact}
                        placeholder="Enter Owner Contact"
                        className="barber-form-input"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="barber-form-field">
                      <label htmlFor="shopName" className="barber-form-label">
                        <Store className="barber-form-icon" />
                        Shop Name
                      </label>
                      <input
                        type="text"
                        id="shopName"
                        name="shopName"
                        value={formData.shopName}
                        placeholder="Enter Shop Name"
                        className="barber-form-input"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="barber-form-field barber-form-field-full">
                      <label htmlFor="description" className="barber-form-label">
                        <FileText className="barber-form-icon" />
                        Shop Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        placeholder="Enter Shop Description"
                        className="barber-form-textarea"
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="barber-form-field">
                      <label htmlFor="openHours" className="barber-form-label">
                        <Clock className="barber-form-icon" />
                        Open Hours
                      </label>
                      <input
                        type="text"
                        id="openHours"
                        name="openHours"
                        value={formData.openHours}
                        placeholder="Enter Open Hours"
                        className="barber-form-input"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="barber-form-field">
                      <label htmlFor="address" className="barber-form-label">
                        <MapPin className="barber-form-icon" />
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        placeholder="Enter Barbershop Address"
                        className="barber-form-input"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="barber-form-actions">
                    <button type="submit" className="barber-form-button" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Barbershop"}
                    </button>
                  </div>
                </form>

                {successMessage && <div className="barber-form-success">{successMessage}</div>}
                {error && <div className="barber-form-error">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Barberform
