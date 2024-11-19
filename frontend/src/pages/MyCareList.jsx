import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyCareList = () => {

  const {backendUrl, token, user} = useContext(AppContext);

  const [myCar, setMyCar] = useState([]);
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchMyCar = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/cars/my-cars`, { headers: { token } });
        if (data.success) {
          setMyCar(data.data);
          console.log("data:"+ data.data);
          
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    fetchMyCar();
  }, [token]);

  console.log( myCar);

  


  return (
    <div className="container mx-auto p-6 mt-20">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {myCar.map((car, index) => (
        <div 
          key={index} 
          onClick={() => navigate(`/cars/${car._id}`)} 
          className="car-card bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:cursor-pointer"
        >
          {/* Image and Preview */}
          <div className="relative">
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </div>

          {/* Car Info */}
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800">{car.title}</h3>
            <p className="text-sm text-gray-600 truncate">{car.description}</p>
            {/* <p className="text-sm text-gray-500 mt-2">Owner: {car.owner?.name}</p> */}
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default MyCareList
