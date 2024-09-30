import React, { useState, useEffect } from 'react';
import Axios from "../Axios";
import '../Employee.css'; // Assuming you have a CSS file for styling
import Sidebar from './Sidebar';
import { Dialog, DialogContent } from '@mui/material';
import { DownOutlined } from '@ant-design/icons'; // Import the DownOutlined icon from Ant Design
import { Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const Customer = () => {
    const [customer, setcustomers] = useState([]);
    const [showForm, setShowForm] = useState(false); // Controls form visibility as popup
    const [editingcustomer, setEditingcustomer] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        user_id: '',
        user_name: '',
        aadhar_number: '',
        address: '',
        city: '',
        pincode: '',
        district: '',
        user_type: 'customer',
        status: 'active', // Default status
        mobile_number: '',
        email: '',
        qualification: '',
        password: '',
        confirmPassword: '', // Added confirm password
        added_by: '',
        profile_photo: null, // For profile photo
        designation: '', // Designation
        landmark: '', // Landmark
        alter_mobile_number: '', // Alternate Number
        ref_name: '', 
        ref_user_id: '', // Reference User ID
        ref_aadhar_number: '', // Reference Aadhar Number
        sign_photo: null, // For signature photo
    });
    const [expandedcustomerId, setExpandedcutomerId] = useState(null); 
    const [errors, setErrors] = useState({});
    useEffect(() => {
        const userId = localStorage.getItem('user_id'); 
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                added_by: userId,
                ref_user_id: userId,
            }));
            fetchUserProfile(userId);
        }
    }, []);

   
    useEffect(() => {
        fetchcustomer();
    }, []);

    const fetchcustomer = async () => {
        try {
            const response = await Axios.get('/customer');
            setcustomers(response.data.message);
            
            console.log('Profile Photo:', response.data.profile_photo);
            if (response.data.profile_photo) {
                const base64String = response.data.profile_photo;
                if (!base64String.startsWith('data:image')) {
                    const base64Image = `data:image/jpeg;base64,${base64String}`;
                    console.log('base64Photo:', base64Image);
                    setProfilePhoto(base64Image);
                } else {
                    setProfilePhoto(base64String);
                }
            }
        } catch (error) {
            alert('Error fetching customerd: ' + error.message);
        }
    };

    const fetchUserProfile = async () => {
        try {
            // Get the user ID from localStorage
            const loggedInUserId = localStorage.getItem('user_id'); 
            console.log("Which user is logged in:", loggedInUserId);
    
            // Fetch user profile data from the API
            const response = await Axios.get(`/profile/${loggedInUserId}`);
            const userProfileData = response.data.message;
            
            if (userProfileData) {
                console.log("User profile data:", userProfileData);
                console.log("User profile data username:", userProfileData.user_name);
                
                setFormData((prevData) => ({
                    ...prevData,
                    ref_name: userProfileData.user_name || prevData.ref_name, // Set ref_name
                    ref_aadhar_number: userProfileData.aadhar_number || prevData.ref_aadhar_number, // Set ref_aadhar_number
                   
                }));
            }
        } catch (err) {
            console.error("Error occurred in fetching user profile", err);
            // Handle error (optional: setError for displaying a message to the user)
        }
    };
    

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await Axios.delete(`/customers/${id}`);
                setcustomers(customer.filter(customer => customer.id !== id));
                alert('customer deleted successfully!');
            } catch (error) {
                alert('Error deleting customer: ' + error.message);
            }
        }
    };

    const handleEdit = (customer) => {
        setEditingcustomer(customer);
       
        setFormData({
            user_id: customer.user_id,
            user_name: customer.user_name,
            aadhar_number: customer.aadhar_number,
            address: customer.address,
            city: customer.city,
            pincode: customer.pincode,
            district: customer.district,
            user_type: customer.user_type,
            status: customer.status,
            mobile_number: customer.mobile_number,
            email: customer.email,
            qualification: customer.qualification,
            password: '',
            confirmPassword: '',
            profile_photo: null,
            designation: customer.designation || '',
            landmark: customer.landmark || '',
            alter_mobile_number: customer.alter_mobile_number || '',
            ref_name: customer.ref_number || '',
            ref_user_id: customer.ref_user_id || localStorage.getItem('user_id'),
            ref_aadhar_number: customer.ref_aadhar_number || '',
            sign_photo: null,
        });
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingcustomer(null);
        setFormData({
            user_id: '',
            user_name: '',
            aadhar_number: '',
            address: '',
            city: '',
            pincode: '',
            district: '',
            user_type: 'user',
            status: 'active',
            mobile_number: '',
            email: '',
            qualification: '',
            password: '',
            confirmPassword: '',
            added_by: localStorage.getItem('user_id'),
            profile_photo: null,
            designation: '',
            landmark: '',
            alter_mobile_number: '',
            ref_name: '',
            ref_user_id: localStorage.getItem('user_id'),
            ref_aadhar_number: '',
            sign_photo: null,
        });
        setShowForm(true);
    };

        const handleChange = async (e) => {
        const { name, files } = e.target;
    
        if (name === "profile_photo" && files.length > 0) {
            const file = files[0];
    
            // Check if the selected file is an image
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
    
                reader.onloadend = () => {
                    // Set the profile_photo in the formData as a Base64 string
                    setFormData((prevData) => ({
                        ...prevData,
                        profile_photo: reader.result // This is the Base64 string
                    }));
                };
    
                reader.readAsDataURL(file); // Convert file to Base64
            } else {
                console.error("Selected file is not an image.");
                // Optionally reset the input or show an error message
                setFormData((prevData) => ({
                    ...prevData,
                    profile_photo: null // Reset or handle invalid file
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: e.target.value // For other fields
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords is not match!");
            return;
        }
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    formDataToSend.append(key, formData[key]);
                }
            }
            if (editingcustomer) {
                await Axios.put(`/customer/${editingcustomer.id}`, formDataToSend);
                alert('customer updated successfully!');
            } else {
                await Axios.post('/register', formDataToSend);
                alert('customer added successfully!');
                setErrors({});
            }
            setShowForm(false);
            fetchcustomer();
        } catch (error) {
           
                if (error.response && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({ general: ['An error occurred. Please try again.'] });
                }
        }
    };

    const handleToggleExpand = (id) => {
        setExpandedcutomerId(expandedcustomerId === id ? null : id);
    };

    const toggleEmployeeStatus = async (employee) => {
        const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    
        try {
            await Axios.put(`/employees/${employee.id}`, {
                ...employee,
                status: newStatus
            });
    
            // Update local state
            setcustomers(prevcustomers => 
                prevcustomers.map(emp => 
                    emp.id === employee.id ? { ...emp, status: newStatus } : emp
                )
            );
    
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="container">
            <Sidebar className="sidebar" />
            <div className="main-content">
              
                <button className="small-button" onClick={handleAdd}>Add Customers</button>
                <div className="table-container">
                        {Array.isArray(customer) && customer.map(customer => (
                            <div key={customer.id} className={`employee-card ${expandedcustomerId === customer.id ? 'expanded' : ''}`}>
                                <div className="employee-header" onClick={() => handleToggleExpand(customer.id)}>
                                    <div>
                                        <img
                                            src={customer.profile_photo}
                                            alt="Profile"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <span className="employee-name">{customer.user_name}</span>
        
                                   
                                    <span className={`expand-icon ${expandedcustomerId === customer.id ? 'rotate' : ''}`}>
                                        <DownOutlined />
                                    </span>
                                </div>
        
                                {expandedcustomerId === customer.id && (
                                    <div className="employee-details">
                                        <div className="employee-detail-item">
                                            <span>{customer.email}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span>{customer.mobile_number}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                <span>Status:</span>
                                <Switch
    checked={customer.status === 'active'} // Check if status is 'active'
    onChange={() => toggleEmployeeStatus(customer)}
    color="primary"
/>

                            </div>
                                        <div className="employee-action-buttons">
                                            <EditIcon style={{color:"green"}} onClick={() => handleEdit(customer)} />
                                            <DeleteIcon style={{color:"red"}} onClick={() => handleDelete(customer.id)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                

                <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
                    <DialogContent>
                        <h3>{editingcustomer ? 'Edit Customer' : 'Add Customer'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>User ID:</label>
                                <input type="text" name="user_id" value={formData.user_id} onChange={handleChange}  />
                                {errors.user_id && <span className="error">{errors.user_id[0]}</span>}
                            </div>
                            <div>
                                <label>User Name:</label>
                                <input type="text" name="user_name" value={formData.user_name} onChange={handleChange}  />
                                {errors.user_name && <span className="error">{errors.user_name[0]}</span>}
                            </div>
                            {/* Add other form fields here */}
                            <div>
                                <label>Aadhar Number:</label>
                                <input type="text" name="aadhar_number" value={formData.aadhar_number} onChange={handleChange}  />
                                {errors.aadhar_number && <span className="error">{errors.aadhar_number[0]}</span>}

                            </div>
                            <div>
                                <label>Address:</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange}  />
                                {errors.address && <span className="error">{errors.address[0]}</span>}
                            </div>
                            <div>
                                <label>City:</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange}  />
                                {errors.city && <span className="error">{errors.city[0]}</span>}
                            </div>
                            <div>
                                <label>Pincode:</label>
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}  />
                                {errors.pincode && <span className="error">{errors.pincode[0]}</span>}
                            </div>
                            <div>
                                <label>District:</label>
                                <input type="text" name="district" value={formData.district} onChange={handleChange}  />
                                {errors.district && <span className="error">{errors.district[0]}</span>}
                            </div>
                            <div>
                                <label>Mobile Number:</label>
                                <input type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange}  />
                                {errors.mobile_number && <span className="error">{errors.mobile_number[0]}</span>}
                            </div>
                            <div>
                                <label>Email:</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}  />
                                {errors.email && <span className="error">{errors.email[0]}</span>}
                            </div>
                            <div>
                                <label>Qualification:</label>
                                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange}  />
                                {errors.qualification && <span className="error">{errors.qualification[0]}</span>}
                            </div>
                            <div>
                                <label>Password:</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange}  />
                                {errors.password && <span className="error">{errors.password[0]}</span>}
                            </div>
                            <div>
                                <label>Confirm Password:</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}  />
                                {errors.confirmPassword && <span className="error">{errors.confirmPassword[0]}</span>}
                            </div>
                            <div>
                                <label>Designation:</label>
                                <input type="text" name="designation" value={formData.designation} onChange={handleChange} />
                                {errors.designation && <span className="error">{errors.designation[0]}</span>}
                            </div>
                            <div>
                                <label>Landmark:</label>
                                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} />
                                {errors.landmark && <span className="error">{errors.landmark[0]}</span>}
                            </div>
                            <div>
                                <label>Alternate Mobile Number:</label>
                                <input type="text" name="alter_mobile_number" value={formData.alter_mobile_number} onChange={handleChange}  />
                                {errors.alter_mobile_number && <span className="error">{errors.alter_mobile_number[0]}</span>}
                                
                            </div>
                            <div>
                                <label>Reference Name:</label>
                                <input type="text" name="ref_name" value={formData.ref_name} onChange={handleChange} />
                                {errors.ref_name && <span className="error">{errors.ref_name[0]}</span>}
                            </div>
                            <div>
                                <label>Reference User ID:</label>
                                <input type="text" name="ref_user_id" value={formData.ref_user_id} onChange={handleChange} />
                                {errors.ref_user_id && <span className="error">{errors.ref_user_id[0]}</span>}
                            </div>
                            <div>
                                <label>Reference Aadhar Number:</label>
                                <input type="text" name="ref_aadhar_number" value={formData.ref_aadhar_number} onChange={handleChange} />
                                {errors.ref_aadhar_number && <span className="error">{errors.ref_aadhar_number[0]}</span>}
                            </div>
                            <div>
                                <label>Profile Photo:</label>
                                <input type="file" name="profile_photo" onChange={handleChange} accept="image/*" />
                                {errors.profile_photo && <span className="error">{errors.profile_photo[0]}</span>}
                            </div>
                            <div>
                                <label>Signature Photo:</label>
                                <input type="file" name="sign_photo" onChange={handleChange} accept="image/*" />
                                {errors.sign_photo && <span className="error">{errors.sign_photo[0]}</span>}
                            </div>
                            <button type="submit">{editingcustomer ? 'Update Customer' : 'Add Customer'}</button>
                            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Customer;
