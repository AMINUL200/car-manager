import express from 'express';
import { registerUser, loginUser, getUserData } from '../controllers/userController.js';
import authUser from '../middlewares/AuthUser.js';

const userRoute = express.Router();

userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.get('/profile', authUser, getUserData);



export default userRoute;