import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const { cars } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter cars based on the search term
  const filteredCars = cars.filter(car => {
    const searchLower = searchTerm.toLowerCase();
    return (
      car.title.toLowerCase().includes(searchLower) ||
      car.description.toLowerCase().includes(searchLower) ||
      car.owner.name.toLowerCase().includes(searchLower) ||
      // car.tags.some(tag => tag.toLowerCase().includes(searchLower))
      car.tags.carType.toLowerCase().includes(searchLower) ||
      car.tags.company.toLowerCase().includes(searchLower) ||
      car.tags.dealer.toLowerCase().includes(searchLower) 
    );
  });

  return (
    <div className="container mx-auto p-6 mt-20">

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCars.map((car, index) => (
          <div onClick={() => navigate(`/cars/${car._id}`)} key={index} className="car-card bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:cursor-pointer">
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
              <p className="text-sm text-gray-500 mt-2">Owner: {car.owner.name}</p> {/* Owner name displayed here */}
            </div>


          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
