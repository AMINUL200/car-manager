import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../components/Loader';

const AddProduct = () => {
  const { token, backendUrl, getCarsData, loading, setLoading } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [carType, setCarType] = useState('');
  const [company, setCompany] = useState('');
  const [dealer, setDealer] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if(!token){
      navigate('/login');
      return;
    }
  })

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); 
    if (files.length > 10) {
      toast.error('You can only upload up to 10 images.');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !carType || !company || !dealer || images.length === 0) {
      toast.error('Please fill out all required fields');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags[carType]', carType);
      formData.append('tags[company]', company);
      formData.append('tags[dealer]', dealer);
      images.forEach(file => {
        formData.append('images', file); 
      });

      const { data } = await axios.post(`${backendUrl}/api/cars/add-car`, formData, {
        headers: { token, 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        getCarsData();
        toast.success('Car added successfully!');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">Add a New Car</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File input section */}
        {images.length < 10 && (
          <div className="flex flex-col">
            <label className="text-gray-700">Images (up to 10 ) (jpeg, png):</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        )}

        {/* Image preview section */}
        {images.length > 0 && (
          <div className="flex flex-wrap mt-4">
            {images.map((image, index) => (
              <div key={index} className="w-1/4 p-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Other form fields */}
        <div className="flex flex-col">
          <label className="text-gray-700">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Car Type:</label>
          <input
            type="text"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Company:</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Dealer:</label>
          <input
            type="text"
            value={dealer}
            onChange={(e) => setDealer(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-2 rounded-lg transition-colors duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed py-4' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}>
          {loading ? <Loader /> : " Add Car"}
        </button>
      </form>
    </div >
  );
};

export default AddProduct;
