
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Barberform from './component/Barberform'
import Addbarbers from './component/Addbarbers'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Timer from './component/Timer'
import User from './user_component/User'
import UserSearch from './user_component/UserSearch'
import Login from './component/Login'
import SignUp from './component/Signup'
import Landing from './landing/Landing'
import UserBookingPage from './user_component/Userbooking'
import Barberhome from './component/Barberhome'
import Userselection from './user_component/Userselection'
import Sign_u from './user_component/Sign_u'
import Login_u from './user_component/Login_u'
import Token from './user_component/Token'
import Booking from './user_component/Booking'
import ProtectedRoute from './component/ProtectedRoute'
import Appointment from './component/Appointment'
import BookingsHistory from './user_component/Bookings_History'
// import Qrcode from './component/Qrcode'    
import Profile from './component/Profile'
import Staticpage from './landing/Staticpage'




function App() {


  return (
    <Router>
      <Routes>
      {/* <Route path="/barberhome" element={<Barberhome />} /> */}
      <Route path="/chooserole" element={<Landing />} />
      <Route path="/barberlogin" element={<Login/>} />
      <Route path="/barbersignup" element={<SignUp />} />

      <Route
          path="/barberhome"
          element={
            <ProtectedRoute>
              <Barberhome />
            </ProtectedRoute>
          }
        />
      <Route path="/barberform" element={<Barberform />} />
      <Route path="/add-barbers" element={<Addbarbers/>} />
      <Route path="/timer-styles" element={<Timer/>} />
      {/* <Route path="/qrcode" element={<Qrcode/>}/> */}
        <Route path="/profile" element={<Profile/>}/>
              <Route path="/" element={<Staticpage/>}/>
    

      {/* user paths */}

      <Route path="/usersignup" element={<Sign_u/>} />
      <Route path="/userlogin" element={<Login_u/>} />
         <Route
          path="/user"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
          <Route
          path="/user-search"
          element={
            <ProtectedRoute>
              <UserSearch /> 
            </ProtectedRoute>
          }
        />
      <Route path="/token" element={<Token />} />
      {/* <Route path="/user-search" element={<UserSearch/>} /> */}
      <Route path="/userbooking/:shopEmail" element={<UserBookingPage />} />
      <Route path="/select-barber" element={<Userselection />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/appointments" element={<Appointment />} />
      <Route path = "/bookinghistory" element={<BookingsHistory/>}/>
    </Routes>
    </Router>
  )
}

export default App