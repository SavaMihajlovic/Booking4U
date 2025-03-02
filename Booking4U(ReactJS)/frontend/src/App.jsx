import React, { useEffect } from "react";
import { useState } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Global/Home";
import Navbar from "./components/Navbar/Navbar";
import { HomeUser } from "./pages/User/HomeUser";
import PrivateRoutes from "./utils/PrivateRoutes";
import { UserReservation } from "./pages/User/UserReservation";
import { UserMyReservations } from "./pages/User/UserMyReservations";
import { PaymentSuccess } from "./pages/Payment/PaymentSucess";
import { PaymentFailure } from "./pages/Payment/PaymentFailure";
import { AdminHotel } from "./pages/Admin/AdminHotel";
import { AdminReservation } from "./pages/Admin/AdminReservation";

const App = () => {

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
      <div className= 'container'>
        <div className={loginDialogOpen ? 'overlay' : ''}>
          <BrowserRouter>
            <Navbar 
              setLoginDialogOpen={setLoginDialogOpen} 
              filterOpen={filterOpen} 
              setFilterOpen={setFilterOpen}/>
              <Routes>
                <Route path="/" element={<Home loginDialogOpen={loginDialogOpen} 
                                               setLoginDialogOpen={setLoginDialogOpen} 
                                               filterOpen={filterOpen}/>} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />

                <Route element={<PrivateRoutes role = 'user' />}>
                  <Route path="/user" element={<HomeUser filterOpen={filterOpen}/>} />
                  <Route path="/user-reservation" element={<UserReservation/>} />
                  <Route path="/user-my-reservations" element={<UserMyReservations/>} />
                </Route>
                <Route element={<PrivateRoutes role = 'admin' />}>
                  <Route path="/admin" element={<AdminHotel/>} />
                  <Route path="/admin-reservation" element={<AdminReservation/>} />
                </Route>
              </Routes>
          </BrowserRouter>
        </div>
      </div>
  );
};

export default App;
