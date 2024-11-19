import express from 'express';
import { addCar, carProfile, deleteCar, getAllCars, getMyCars, updateCar } from '../controllers/carController.js';
import authUser from '../middlewares/AuthUser.js';
import upload from '../middlewares/multer.js';

const carRoutes = express.Router();

carRoutes.get('/', getAllCars);

carRoutes.get('/my-cars', authUser, getMyCars);
carRoutes.get('/:carId', authUser, carProfile);
carRoutes.post('/add-car', authUser, upload.array('images'), addCar);
carRoutes.put('/:carId', authUser, upload.array('images'), updateCar);
carRoutes.delete('/:carId', authUser, deleteCar);


export default carRoutes;