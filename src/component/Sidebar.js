import React from 'react';
import { List, ListItem, ListItemText, Drawer, AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Person, People, CardGiftcard, Star, Savings, ArrowForward } from '@mui/icons-material'; // Import necessary icons
import '../Sidebar.css'; // Import your CSS for additional styling
import logoImage from '../asset/AT Logo White.png'; 
import Swal from 'sweetalert2';
const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Employee', path: '/employee', icon: <People /> }, // People icon for Employee
        { text: 'Customer', path: '/customer', icon: <Person /> }, // Single person icon for Customer
        { text: 'Loan Category', path: '/loancategory', icon: <Star /> }, // Star icon for Promotion
        { text: 'Loan', path: '/loan', icon: <CardGiftcard /> }, // Card icon for My Cards
     
      
        { text: 'Loan Due', path: '/loandue', icon: <Savings /> }, // Savings icon for Savings
    ];

    const handleNavigation = (path) => {
        navigate(path);
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
        }).then(async (result) => {
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
    
    return (
        <div>
            <AppBar position="fixed" className="app-bar">
                <Toolbar className="toolbar">
                    <div className="logo-container">
                       
                        <img src={logoImage} alt="Logo" className="logo" /> {/* Replace with your logo path */}
                    </div>
                    <Button color="inherit" onClick={handleLogout} className="logout-button">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" anchor="left">
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
