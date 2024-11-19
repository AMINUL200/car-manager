
import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export const AppContext = createContext();

const appContextProvider = (props) =>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [cars, setCars] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    const getCarsData = async () =>{
        try{

            const {data} = await axios.get(backendUrl + '/api/cars');

            if(data.success){
                setCars(data.data);
                console.log(cars);
                
            }else{
                toast.error(data.message);
            }

        }catch(err){
            console.error("Error getting cars data:" + err);
            toast.error(err.message)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/profile', {
                headers: { token }
            });
    
            if (data.success) {
                setUser(data.data); 
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            toast.error(err.message);
        }
    };


    const value = {
        backendUrl,
        token, setToken,
        cars, setCars,
        getCarsData,
        user, setUser,
        loading, setLoading,
        
    }

    useEffect(() =>{
        getCarsData();
    },[])

    useEffect(() => {
        if (token) {
            getUserData();
        }
    }, [token]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default appContextProvider;