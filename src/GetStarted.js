// src/GetStarted.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from './asset/ATHI_TRADERS_LOGO.jpg'; // Adjust the path if necessary
import { MdArrowForward } from 'react-icons/md'; // Import arrow icon from react-icons

const GetStarted = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        // Navigate to another page or perform an action
        navigate('/login'); // Replace with your actual route
    };

    return (
        <div style={styles.container}>
            <img src={logoImage} alt="Athi Traders Logo" style={styles.logo} />
            <button onClick={handleGetStarted} style={styles.button}>
                Get Started <MdArrowForward style={styles.icon} />
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff', // Optional background color
    },
    logo: {
        width: '400px', // Set width for the logo
        height: 'auto', // Maintain aspect ratio
        marginBottom: '2px', // Space between logo and button
    },
    button: {
        width:'300px',
        height:'50px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#188B3E', // Button color changed to light green
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center', // Align icon and text
        transition: 'background-color 0.3s',
    },
    icon: {
        marginLeft: '150px', // Increased space between text and icon
    },
};

export default GetStarted;
