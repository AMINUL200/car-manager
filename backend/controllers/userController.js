import bcrypt from 'bcrypt'
import validator from 'validator';
import userModel from '../models/UserModel.js'
import jwt from 'jsonwebtoken'


// Api to register user :
const registerUser = async (req, res) => {
    try{

        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message:"Please fill all fields"})
        }
        // validate email:
        if(!validator.isEmail(email)){
            return res.json({success: false, message:"Please enter a valid email"})
        }
        // validate password:
        if(password.length < 8){
            return res.json({success: false, message:"Password should be at least 8 characters long"})
        }
        // Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success: false, message:"User already exists"})
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // create new user
        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({success: true, token});

    }catch(e){
        console.error(e);
        res.json({ success: false, message: e.message })
    }
}

// Api to login user :
const loginUser = async (req, res) =>{
    try{

        const {email, password} = req.body;
        
        // validate email:
        if(!validator.isEmail(email)){
            return res.json({success: false, message:"Please enter a valid email"})
        }
        // Check if user exists
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message:"User not found"})
        }
        // validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message:"Invalid password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({success: true, token});

    }catch(error){
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

// api to fetch user data
const getUserData = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const user = await userModel.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export {registerUser, loginUser, getUserData}