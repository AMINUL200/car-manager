import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from './Loader';

const CarDetail = () => {
  const { carId } = useParams();
  const { backendUrl, token, user, getCarsData, loading, setLoading } = useContext(AppContext);
  const [car, setCar] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [editData, setEditData] = useState({
    title: '',
    description: '',
    tags: {
      carType: '',
      company: '',
      dealer: ''
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if(!token){
      navigate('/login');
      return;
    }
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/cars/${carId}`, { headers: { token } });
        if (data.success) {
          setCar(data.data);
          setEditData({
            title: data.data.title || '',
            description: data.data.description || '',
            tags: {
              carType: data.data.tags?.carType || '',
              company: data.data.tags?.company || '',
              dealer: data.data.tags?.dealer || ''
            }
          });
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchCar();
  }, [carId, backendUrl, token, isEdit]);

  const isOwner = user && car && user._id === car.owner?._id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in editData.tags) {
      setEditData((prevData) => ({
        ...prevData,
        tags: {
          ...prevData.tags,
          [name]: value
        }
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length >= 10) {
      toast.error('You can only upload up to 10 images.');
      return;
    }

    setSelectedFiles(files);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('description', editData.description);
      formData.append('carType', editData.tags.carType);
      formData.append('company', editData.tags.company);
      formData.append('dealer', editData.tags.dealer);

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const { data } = await axios.put(`${backendUrl}/api/cars/${carId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token,
        },
      });

      if (data.success) {
        toast.success('Car details updated successfully!');
        setCar(data.data);
        setIsEdit(false);
        setSelectedFiles([]);
        getCarsData();

      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error updating car: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/cars/${carId}`, { headers: { token } });
      if (data.success) {
        toast.success('Car deleted successfully!');
        getCarsData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error deleting car: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-20">

      {/* Top Section - Images */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1">
          {car.images && car.images[0] ? (
            <img
              src={car.images[0]}
              alt="Main Car"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <p>No main image available</p>
          )}
        </div>
        {car.images && car.images.length > 1 && (
          <div className="flex-1 grid grid-cols-3 gap-4">
            {car.images.slice(1, 10).map((image, index) => (
              image ? (
                <img
                  key={index}
                  src={image}
                  alt={`Car Image ${index + 2}`}
                  className="w-full h-32 object-cover rounded-md shadow-md"
                />
              ) : null
            ))}
          </div>
        )}
      </div>




      {/* Car Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">

        {isEdit && (
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Update Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}

        {/* Image preview section */}
        {selectedFiles.length > 0 && isEdit && (
          <div className="flex flex-wrap mt-4">
            {selectedFiles.map((image, index) => (
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

        <h1 className="text-3xl font-bold mb-4">
          {isEdit ? (
            <input
              className='border p-1'
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
            />
          ) : (
            car.title
          )}
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          {isEdit ? (
            <textarea
              className='border p-1 w-full'
              name="description"
              rows={3}
              value={editData.description}
              onChange={handleInputChange}
            ></textarea>
          ) : (
            car.description || 'No description available'
          )}
        </p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Tags:</h2>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Car Type:</span> {isEdit ? (
              <input
                className='border p-1'
                type="text"
                name="carType"
                value={editData.tags.carType}
                onChange={handleInputChange}
              />
            ) : (
              car.tags?.carType || 'N/A'
            )}<br />
            <span className="font-medium">Company:</span> {isEdit ? (
              <input
                className='border p-1'
                type="text"
                name="company"
                value={editData.tags.company}
                onChange={handleInputChange}
              />
            ) : (
              car.tags?.company || 'N/A'
            )}<br />
            <span className="font-medium">Dealer:</span> {isEdit ? (
              <input
                className='border p-1'
                type="text"
                name="dealer"
                value={editData.tags.dealer}
                onChange={handleInputChange}
              />
            ) : (
              car.tags?.dealer || 'N/A'
            )}
          </p>
        </div>
        <p className="text-medium text-gray-700">Owner: {car.owner?.name || 'N/A'}</p>

        {isOwner && !isEdit && (
          <div className="flex gap-5 mt-6">
            <button onClick={() => setIsEdit(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Edit</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
          </div>
        )}

        {isEdit && (
          <div className="flex gap-5 mt-6">
            <button
              onClick={handleSave}
              className={`bg-black text-white px-4 py-2 rounded-lg ${loading ? 'bg-opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              disabled={loading}>
              {loading ? <Loader /> : "Save"}
            </button>
            <button
              onClick={() => setIsEdit(false)}
              className={`bg-gray-500 text-white px-4 py-2 rounded-lg ${loading ? 'bg-opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
              disabled={loading}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarDetail;
