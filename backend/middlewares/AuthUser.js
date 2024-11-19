import jwt from 'jsonwebtoken';

// user authentication middleware:

const authUser = async (req, res, next) => {
    try{
        
        const {token } = req.headers;

        if(!token){
            return res.json({ success: false, message: "No token, authorization denied" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = { id: decoded.id };
        
        next();

    }catch(error){
        console.log(error);
        res.json({ success: false, message: "Token is not valid" });
    }
}

export default authUser;