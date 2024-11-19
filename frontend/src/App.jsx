import React, { useContext } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddProduct from './pages/AddProduct';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CarDetail from './components/CarDetail';
import MyCareList from './pages/MyCareList';
import { AppContext } from './context/AppContext';

const App = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-car" element={<AddProduct />} />
          <Route path="/my-car" element={<MyCareList />} />
          <Route path="/cars/:carId" element={<CarDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
