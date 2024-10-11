import React, { useState } from 'react';
import Axios from "../Axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import logoImage from '../asset/ATHI_TRADERS_LOGO.jpg'; 
import '../Login.css';
import { MdArrowForward } from 'react-icons/md';
import Spinner from '../Spinner.js'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Check if the input is an email or user ID (assuming emails contain '@')
            const loginData = {
                email: email.includes('@') ? email : undefined,
                user_id: !email.includes('@') ? email : undefined,
                password: password,
            };
    
            const response = await Axios.post('/login', loginData);
    
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Login Successful',
            //     text: `Welcome, ${response.data.name}`,
            // });
    
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_id', response.data.user_id);
                if(response.data.user_id)
                {
                    
                        try {                    
                            const loggedInUserId = localStorage.getItem('user_id');                          
                    
                            const response = await Axios.get(`/profile/${loggedInUserId}`);
                            const userProfileData = response.data.message;
                            
                            if (userProfileData) {
                                console.log("User profile data:", userProfileData);
                                // localStorage.setItem('ref_name', response.data.message.user_name);
                                // localStorage.setItem('ref_aadhar_number', response.data.message.aadhar_number);
                            }
                        } catch (err) {
                            console.error("Error occurred in fetching user profile", err);
                            
                        }
                }

            // Navigate based on user role
            if (response.data.role === 'admin') {
                navigate('/admindashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error);
            if (error.response) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.response.data.error || 'An error occurred during login.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'An unexpected error occurred.',
                });
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className='container1'>
            <div className="login-container">
                <img src={logoImage} alt="Athi Traders Logo" className="logo1" />
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-login">
                        <label htmlFor="email">Employee Id</label>
                        <input
                          
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group-login">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="forgot-password-login">
                        <a href="/forgot-password">Forgot Password?</a>
                    </div>

                    <button type="submit" disabled={loading}> {/* Disable button when loading */}
                        {loading ? <Spinner /> : <>Sign in <MdArrowForward /></>} {/* Show spinner or text */}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
