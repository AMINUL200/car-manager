import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    images: { type: [String] },
    tags: {
      carType: String,
      company: String,
      dealer: String,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const CarModel = mongoose.models.Car || mongoose.model('Car', carSchema);

export default CarModel;