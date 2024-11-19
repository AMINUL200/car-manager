import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import userRoute from './routes/userRoute.js';
import carRoutes from './routes/carsRout.js';
import connectCloudinary from './config/cloudinary.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

// api endpoints:
app.use('/api/user', userRoute);
app.use('/api/cars', carRoutes);




app.get('/', (req, res) => {
  res.send('Car Management Backend is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
