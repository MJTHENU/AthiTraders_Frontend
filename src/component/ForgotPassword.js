import React, { useState } from 'react';
import Axios from '../Axios';  // Axios instance
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../ForgotPassword.css';
import Spinner from '../Spinner';  // Spinner component

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await Axios.post('/forgot-password', { email });

            Swal.fire({
                icon: 'success',
                title: 'Reset Link Sent',
                text: `A password reset link has been sent to ${email}. Please check your inbox.`,
            });

            navigate('/login');
        } catch (error) {
            const errorMessage = error.response && error.response.data.error
                ? error.response.data.error
                : 'An unexpected error occurred. Please try again later.';

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='forgot-container'>
            <div className="forgot-password-form">
                <h2>Forgot Password</h2>
                <form onSubmit={handleForgotPassword}>
                    <div className="form-group">
                        <label htmlFor="email">Enter your email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            disabled={loading}  // Disable input during loading
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? <Spinner /> : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
