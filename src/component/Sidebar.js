import React, { useState } from 'react';
import { List, ListItem, ListItemText, Drawer, AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Person, People, CardGiftcard, Star, Savings, ArrowForward, Menu, Close ,Dashboard,EventAvailable} from '@mui/icons-material'; // Add Close icon
import { useMediaQuery } from '@mui/material';
import '../Sidebar.css'; // Import your CSS for additional styling
import logoImage from '../asset/AT Logo White.png'; 
import Swal from 'sweetalert2';

const Sidebar = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setDrawerOpen] = useState(false); // State for Drawer toggle
    const isMobile = useMediaQuery('(max-width: 768px)'); // Check if screen is smaller (mobile)

    const menuItems = [
        { text: 'Dashboard', path: '/admindashboard', icon:<Dashboard/>  },
        { text: 'Employee', path: '/employee', icon: <People /> },
        { text: 'Customer', path: '/customer', icon: <Person /> },
        { text: 'Loan Category', path: '/loancategory', icon: <Star /> },
        { text: 'Loan', path: '/loan', icon: <CardGiftcard /> },
        { text: 'Loan Due', path: '/loandue', icon: <Savings /> },
        { text: 'Today Loan Due', path: '/todayloandue', icon: <EventAvailable /> }, 
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setDrawerOpen(false); // Close drawer on mobile after navigation
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to log out?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#188b3E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'No, stay'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                Swal.fire(
                    'Logged out!',
                    'You have been logged out successfully.',
                    'success'
                );
                navigate("/login");
            }
        });
    };

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    return (
        <div>
            {/* AppBar for header */}
            <AppBar position="fixed" className="app-bar">
                <Toolbar className="toolbar">
                    <div className="logo-container">
                        <img src={logoImage} alt="Logo" className="logo" />
                    </div>
                    {isMobile ? (
                        <IconButton color="inherit" onClick={toggleDrawer}>
                            {isDrawerOpen ? <Close /> : <Menu />} {/* Toggle between Menu and Close Icon */}
                        </IconButton>
                    ) : (
                        <Button color="inherit" onClick={handleLogout} className="logout-button">
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"} // Use temporary for mobile, permanent for larger screens
                open={isDrawerOpen || !isMobile} // If mobile, control drawer with state
                onClose={toggleDrawer} // Close the drawer when toggled
                anchor="left"
            >
                <div className="sidebar">
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem button key={index} onClick={() => handleNavigation(item.path)} className="list-item">
                                {item.icon}
                                <ListItemText primary={item.text} />
                                <ArrowForward className="arrow-icon" />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    );
};

export default Sidebar;