import express from 'express';
import CarModel from '../models/CarModel.js';
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';


// Api to get All Cars :
const getAllCars = async (req, res) => {
    try {
        // Fetch all cars from the database
        const cars = await CarModel.find().populate('owner', '-password'); // Added 'await' to resolve the query
        res.json({ success: true, data: cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get all cars for the logged-in user
const getMyCars = async (req, res) => {
    try {
        // Assuming userId is added to req.body by the authUser middleware
        const userId = req.user.id;

        // Find all cars associated with the logged-in user
        const cars = await CarModel.find({ owner: userId });

        // Return the list of cars
        res.json({ success: true, data: cars });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// API to add a new car
const addCar = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const imageFiles = req.files;

        // Basic validation for required fields
        if (!title || !description || !tags || !tags.carType || !tags.company || !tags.dealer) {
            return res.status(400).json({ success: false, message: "Title, description, and all tags are required." });
        }


        // Upload each image to Cloudinary and get the URLs
        const imageUrls = [];
        for (const image of imageFiles) {
            const imageUpload = await cloudinary.uploader.upload(image.path, {
                resource_type: 'auto',
                //    folder: 'car_images',
            });
            imageUrls.push(imageUpload.secure_url);
        }

        // Create a new car document with Cloudinary image URLs
        const newCar = new CarModel({
            title,
            description,
            images: imageUrls,
            tags: {
                carType: tags.carType,
                company: tags.company,
                dealer: tags.dealer,
            },
            owner: req.user.id, 
        });

        // Save the car document to the database
        const savedCar = await newCar.save();
        console.log(savedCar);

        res.status(201).json({ success: true, data: savedCar });

    } catch (error) {
        console.error("Error in addCar:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to update a car
const updateCar = async (req, res) => {
    const { carId } = req.params;
    const { title, description, tags } = req.body;
    const imageFiles = req.files;

    try {
        // Find the car based on carId and ensure the authenticated user is the owner
        const car = await CarModel.findOne({ _id: carId, owner: req.user.id });

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found or you do not have permission to update this car' });
        }

        // Update basic fields
        if (title) car.title = title;
        if (description) car.description = description;
        if (tags) {
            car.tags = {
                carType: tags.carType || car.tags.carType,
                company: tags.company || car.tags.company,
                dealer: tags.dealer || car.tags.dealer,
            };
        }

        // Handle image updates if new images are provided
        if (imageFiles && imageFiles.length > 0) {
          
            // Upload new images to Cloudinary
            const imageUrls = [];
            for (const image of imageFiles) {
                const imageUpload = await cloudinary.uploader.upload(image.path, {
                    resource_type: 'auto',
                });
                imageUrls.push(imageUpload.secure_url);
            }
            car.images = imageUrls; 
        }

        // Save the updated car
        const updatedCar = await car.save();
        res.status(200).json({ success: true, data: updatedCar });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Function to get a car profile (detailed view of a specific car)
const carProfile = async (req, res) => {
    const { carId } = req.params;
    try {
        // Find the car based on the given `carId`
        // Assuming you want to ensure that the user is authenticated and can only view their cars
        const car = await CarModel.findOne({ _id: carId }).populate('owner', '-password');

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        // If the car is found, return its details
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        console.error('Error fetching car profile:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Api to delete a car:
const deleteCar = async (req, res) => {
    const { carId } = req.params;

    try {
        console.log(req.body.userId);

        const car = await CarModel.findOne({ _id: carId, owner: req.user.id });

        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found or you do not have permission to delete this car' });
        }

        // Delete the car:
        await CarModel.deleteOne({ _id: carId });
        res.status(200).json({ success: true, message: 'Car deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { getAllCars, getMyCars, addCar, updateCar, carProfile, deleteCar };