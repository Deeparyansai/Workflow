import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoggedIn } from '../features/authSlice'; 
import '../Styles/AuthStyle.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  const navigate = useNavigate();
  const location = useLocation();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data.message);

        // Update Redux state
        dispatch(setLoggedIn(true));

        // Store auth data in localStorage
        localStorage.setItem('auth', JSON.stringify(res.data));

        // Set default headers for Axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

        navigate(location.state?.from || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid Email Or Password");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h4 className="title">LOGIN FORM</h4>

        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Email"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Enter Your Password"
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Login;

