import React from "react";
import { useState } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Global/Home";
import Navbar from "./components/Navbar/Navbar";
import { HomeUser } from "./pages/User/HomeUser";
import PrivateRoutes from "./utils/PrivateRoutes";
import { HomeAdmin } from "./pages/Admin/HomeAdmin";

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
                <Route element={<PrivateRoutes role = 'user' />}>
                  <Route path="/user" element={<HomeUser filterOpen={filterOpen}/>} />
                </Route>
                <Route element={<PrivateRoutes role = 'admin' />}>
                  <Route path="/admin" element={<HomeAdmin/>} />
                </Route>
              </Routes>
          </BrowserRouter>
        </div>
      </div>
  );
};

export default App;
