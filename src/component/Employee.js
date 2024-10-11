import React, { useState, useEffect } from 'react';
import Axios from "../Axios";
import '../Employee.css'; // Assuming you have a CSS file for styling
import Sidebar from './Sidebar';
import { IconButton } from '@mui/material';
import { DownOutlined } from '@ant-design/icons'; // Import the DownOutlined icon from Ant Design
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Switch } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        user_id: '',
        user_name: '',
        aadhar_number: '',
        address: '',
        city: '',
        pincode: '',
        district: '',
        user_type: 'employee',
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
        ref_name: '', // Reference Number
        ref_user_id: '', // Reference User ID
         ref_aadhar_number: '', // Reference Aadhar Number
        sign_photo: null, // For signature photo
    });
    const [expandedEmployeeId, setExpandedEmployeeId] = useState(null); // State to manage expanded employees

    useEffect(() => {
        const userId = localStorage.getItem('user_id'); 
        const reference_name = localStorage.getItem('ref_name'); 
        const reference_aadhar_number = localStorage.getItem('ref_aadhar_number');
        console.log("ref_name",reference_name);
    
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                added_by: userId,
                ref_user_id: userId,
                ref_name: reference_name,
                ref_aadhar_number: reference_aadhar_number,
                
            }));
        }
    }, []); 
    

   

    // Fetch employees when the component mounts
    useEffect(() => {
        fetchEmployees();
    }, []);

    
    

    const fetchEmployees = async () => {
        try {
            const response = await Axios.get('/employees');
            setEmployees(response.data);
            // console.log(employees.email)
            //setProfilePhoto(response.data.profile_photo);

            // console.log('Profile Photo:', response.data.profile_photo);
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

            console.log(response.data);
        } catch (error) {
            alert('Error fetching employees: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await Axios.delete(`/user/${id}`);
                setEmployees(employees.filter(employee => employee.id !== id));
                alert('Employee deleted successfully!');
            } catch (error) {
                alert('Error deleting employee: ' + error.message);
            }
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            user_id: employee.user_id,
            user_name: employee.user_name,
            aadhar_number: employee.aadhar_number,
            address: employee.address,
            city: employee.city,
            pincode: employee.pincode,
            district: employee.district,
            user_type: employee.user_type,
            status: employee.status, // Get status from employee data
            mobile_number: employee.mobile_number,
            email: employee.email,
            qualification: employee.qualification,
            password: '', // Keep password empty for editing
            confirmPassword: '', // Keep confirm password empty for editing
            profile_photo: employee.profile_photo, // Reset profile photo
            designation: employee.designation || '', // Get designation if available
            landmark: employee.landmark || '', // Get landmark if available
            alter_mobile_number: employee.alter_mobile_number || '', // Get alternate number if available
            ref_user_id: employee.ref_user_id || localStorage.getItem('user_id'), // Default to localStorage user_id
            ref_aadhar_number: employee.ref_aadhar_number || '', // Get reference aadhar number if available
            sign_photo: employee.sign_photo, // Reset signature photo
        });
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        setFormData({
            user_id: '',
            user_name: '',
            aadhar_number: '',
            address: '',
            city: '',
            pincode: '',
            district: '',
            user_type: 'employee',
            status: 'active', // Default status
            mobile_number: '',
            email: '',
            qualification: '',
            password: '',
            confirmPassword: '', // Keep confirm password empty
            added_by: localStorage.getItem('user_id'),
            profile_photo: '', // For profile photo
            designation: '', // Designation
            landmark: '', // Landmark
            alter_mobile_number: '', // Alternate Number
            ref_name: '', // Reference Number
            ref_user_id: localStorage.getItem('user_id'), // Default to localStorage user_id
            ref_aadhar_number: '', // Reference Aadhar Number
            sign_photo: '', // For signature photo
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

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Append all form data to FormData object
            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    formDataToSend.append(key, formData[key]);
                }
            }

            // API call for adding/updating employee
            await (editingEmployee ? Axios.put(`/employees/${editingEmployee.user_id}`, formDataToSend) : Axios.post('/register', formDataToSend));

            alert('Employee submitted successfully!');
            setErrors({}); // Clear errors on successful submission
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ['An error occurred. Please try again.'] });
            }
        }
    };



    // Function to toggle employee details
    const handleToggleExpand = (id) => {
        setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
    };

    const toggleEmployeeStatus = async (employee) => {
        const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    
        try {
            await Axios.put(`/employees/${employee.user_id}`, {
                ...employee,
                status: newStatus
            });
    
            // Update local state
            setEmployees(prevEmployees => 
                prevEmployees.map(emp => 
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
                    {/* <h2>Employee List</h2> */}
                    <button className="small-button" onClick={handleAdd}>Add Employee</button>
                    <div className="table-container">
                        
                        {Array.isArray(employees) && employees.map(employee => (
                            <div className='maincard'>
                            <div key={employee.id} className={`employee-card ${expandedEmployeeId === employee.id ? 'expanded' : ''}`}
                            >
                                <div className="employee-header" onClick={() => handleToggleExpand(employee.id)}>
                                    <div>
                                        <img
                                            src={employee.profile_photo}
                                            alt="Profile"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <span className="employee-name">{employee.user_name}</span>
        
                                    {/* Arrow icon that rotates when expanded */}
                                    <span className={`expand-icon ${expandedEmployeeId === employee.id ? 'rotate' : ''}`}>
                                        <DownOutlined />
                                    </span>
                                </div>
        
                                {expandedEmployeeId === employee.id && (
                                    <div className="employee-details">
                                        <div className="employee-detail-item">
                                            <span>{employee.email}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span>{employee.mobile_number}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                <span>Status:</span>
                                <Switch
                                        checked={employee.status === 'active'} // Check if status is 'active'
                                        onChange={() => toggleEmployeeStatus(employee)}
                                        color="primary"
                                    />

                                    </div>
                                        <div className="employee-action-buttons">
                                            <EditIcon style={{color:"green"}} onClick={() => handleEdit(employee)} />
                                            <DeleteIcon style={{color:"red"}} onClick={() => handleDelete(employee.id)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            </div>
                        ))}
                    </div>
        
                    {/* Modal for adding/editing employee */}
                    <Dialog open={showForm} onClose={() => setShowForm(false)}>
                        <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                {/* Form fields */}
                                
                                <div>
                                    <label>Employee ID:</label>
                                    <input type="text" name="user_id" value={formData.user_id} onChange={handleChange}  />
                                    {errors.user_id && <span className="error">{errors.user_id[0]}</span>}
                                </div>
                                <div>
                                    <label>Employee Name:</label>
                                    <input type="text" name="user_name" value={formData.user_name} onChange={handleChange}  />
                                    {errors.user_name && <span className="error">{errors.user_name[0]}</span>}
                                </div>
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
                                </div>
                                <div>
                                    <label>Designation:</label>
                                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Landmark:</label>
                                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Alternate Mobile Number:</label>
                                    <input type="text" name="alter_mobile_number" value={formData.alter_mobile_number} onChange={handleChange} />
                                </div>
                               
                                <div>
                                    <label>Reference User ID:</label>
                                    <input type="text" name="ref_user_id" value={formData.ref_user_id} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Reference Name:</label>
                                    <input type="text" name="ref_name" value={formData.ref_name} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Reference Aadhar Number:</label>
                                    <input type="text" name="ref_aadhar_number" value={formData.ref_aadhar_number} onChange={handleChange} />
                                </div>
                                <div>
                                    <label>Profile Photo:</label>
                                    <input type="file" name="profile_photo" onChange={handleChange}   accept="image/*" />
                                </div>
                                <div>
                                    <label>Signature Photo:</label>
                                    <input type="file" name="sign_photo" onChange={handleChange}   accept="image/*" />
                                </div>
                                <Button type="submit">{editingEmployee ? 'Update Employee' : 'Add Employee'}</Button>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowForm(false)}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );

};

export default Employee;
