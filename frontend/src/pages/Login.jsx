import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message)
      console.error(err);
    }

  }



  return (
    <form onSubmit={handleSubmit} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>Login</p>
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </div >
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
        </div>

        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
        <p>Create an new account? <span className='text-primary underline cursor-pointer' onClick={() => navigate('/signup')}> click here</span></p>
      </div>
    </form>
  )
}

export default Login
