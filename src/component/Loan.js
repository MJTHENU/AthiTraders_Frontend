import React, { useState, useEffect } from 'react';
import Axios from "../Axios";
import '../Employee.css'; // Assuming you have a CSS file for styling
import Sidebar from './Sidebar';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DownOutlined, SearchOutlined } from '@ant-design/icons'; // Import Search Icon


const addWeeks = (date, weeks) => {
    const result = new Date(date);
    result.setDate(result.getDate() + weeks * 7);
    return result;
};

const addMonths = (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

const Loan = () => {
    const [loans, setLoans] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);
    const [expandedLoanId, setExpandedloanId] = useState(null);
    const [loanCategories, setLoanCategories] = useState([]);
    const [users, setUsers] = useState([]); // State to hold user list
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // Search term state
    const [formData, setFormData] = useState({
        loan_id: '',
        category_id: '',
        user_id: '',
        loan_amount: '',
        loan_date: '',
        total_amount: '',
        loan_closed_date: '',
        employee_id: '',
        status: 'active',
        image:'',
    });
    
    

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            console.log("User ID from localStorage:", userId); // Log the user ID
            setFormData((prevData) => ({
                ...prevData,
                employee_id: userId,
            }));
        } else {
            console.log("No user ID found in localStorage.");
        }
    }, []);
    
    

    // Fetch loan categories and loans when the component mounts
    useEffect(() => {
        fetchLoanCategories();
        fetchLoan();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await Axios.get('/all-users');
            
            // Check if the response contains an array of users in 'message'
            if (Array.isArray(response.data.message)) {
                setUsers(response.data.message); // Store users in state
            } else {
                console.error('Expected array but got:', response.data);
            }
        } catch (error) {
            alert('Error fetching user details: ' + error.message);
        }
    };
    

    const fetchLoanCategories = async () => {
        try {
            const response = await Axios.get('/loan-category');

            // Access the 'message' field which contains the actual loan categories
            if (Array.isArray(response.data.message)) {
                setLoanCategories(response.data.message); // Use 'message' field
            } else {
                setLoanCategories([]); // Handle unexpected response
                console.error('Expected array but got:', response.data);
            }
        } catch (error) {
            alert('Error fetching loan categories: ' + error.message);
        }
    };

    // const fetchLoan = async () => {
    //     try {
    //         const response = await Axios.get('/loan'); // Adjust the URL as needed
    //         console.log(response.data); // Log the entire response to inspect it

    //         // Check if loans exist and are an array
    //         if (response.data.loans && Array.isArray(response.data.loans)) {
    //             console.log("All Loans:", response.data.loans); // Log all loans to the console
    //             setLoans(response.data.loans); // Set the loans state
    //         } else {
    //             console.error("Loans data is not an array or is undefined");
    //         }
    //     } catch (error) {
    //         alert('Error fetching loan: ' + error.message);
    //     }
    // };

    // useEffect(() => {
    //     fetchLoan(); // Call the fetchLoan function on component mount
    // }, []);
    
    const fetchLoan = async () => {
        try {
            const response = await Axios.get('/loan'); // Fetch loans
            console.log(response.data); // Inspect the response
    
            if (response.data.loans && Array.isArray(response.data.loans)) {
                console.log("All Loans:", response.data.loans);
                setLoans(response.data.loans); // Set the loans state
    
                // Fetch user details for each loan
                const loanWithUserDetails = await Promise.all(response.data.loans.map(async (loan) => {
                    try {
                        const userResponse = await Axios.get(`/profile/${loan.user_id}`); 
                        console.log(`User details for loan ${loan.id}:`, userResponse.data);
                        return { ...loan, userDetails: userResponse.data.message }; 
                     
                    } catch (userError) {
                        console.error(`Error fetching user details for loan ${loan.id}:`, userError);
                        return { ...loan, userDetails: null }; // Handle error case, set userDetails as null
                    }
                }));
    
                // Update state with loan data along with user details
                setLoans(loanWithUserDetails);
            } else {
                console.error("Loans data is not an array or is undefined");
            }
        } catch (error) {
            alert('Error fetching loan: ' + error.message);
        }
    };
    
    useEffect(() => {
        fetchLoan(); // Fetch loans and user details when component mounts
    }, []);
    
    

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this loan?')) {
            try {
                await Axios.delete(`loan/${id}`);
                setLoans(loans.filter(l => l.id !== id));
                alert('Loan deleted successfully!');
            } catch (error) {
                alert('Error deleting loan: ' + error.message);
            }
        }
    };

    const handleEdit = (loan) => {
        setEditingLoan(loan);
        setFormData({
            loan_id: loan.loan_id || '',                 // Keep loan ID if it exists
            category_id: loan.loan_category_id || '',// Keep loan category ID if it exists
            user_id: loan.user_id || '',             // Keep user name if it exists
            loan_amount: loan.loan_amount || '',         // Keep loan amount if it exists
            loan_date: loan.loan_date || '',             // Keep loan date if it exists
            total_amount: loan.total_amount || '',         // Keep total amount if it exists
            loan_closed_date: loan.loan_closed_date || '', // Keep loan close date if it exists
            employee_id: loan.employee_id || '',         // Keep employee ID if it exists
            image: loan.image || '',  
            status: loan.status || 'active',             // Default to 'active' if status is not provided
        });
        
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingLoan(null);
        setFormData({
            loan_id: '',               // Reset loan ID
            category_id: '',      // Reset loan category ID
            user_id: '',             // Reset user name
            loan_amount: '',           // Reset loan amount
            loan_date: '',             // Reset loan date
            total_amount: '',           // Reset total amount
            loan_closed_date: '',       // Reset loan close date
            employee_id: '',   
            image :'',       // Reset employee ID
            status: 'active',          // Reset status to 'active'
        });
        
        setShowForm(true);
    };
    const handleChange = (e) => {
        const { name, value,files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'category_id') {
            // Find the selected category
            const selected = loanCategories.find(category => category.id === parseInt(value));
            console.log("selectedCategory",selected);
            setSelectedCategory(selected);
        }

        if (name === 'loan_date' && selectedCategory) {
            const loanDate = new Date(value);
            let loanCloseDate;
        
            if (selectedCategory.category_type === 'weekly') {
                loanCloseDate = addWeeks(loanDate, selectedCategory.duration);
            } else if (selectedCategory.category_type === 'monthly') {
                loanCloseDate = addMonths(loanDate, selectedCategory.duration);
            }
        
            setFormData((prevData) => ({
                ...prevData,
                loan_date: value,
                loan_closed_date: loanCloseDate ? loanCloseDate.toISOString().split('T')[0] : ''
            }));
        }


  

        if (name === "profile_photo" && files.length > 0) {
            const file = files[0];

            // Check if the selected file is an image
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    // Set the profile_photo in the formData as a Base64 string
                    setFormData((prevData) => ({
                        ...prevData,
                      photo: reader.result // This is the Base64 string
                    }));
                };

                reader.readAsDataURL(file); // Convert file to Base64
            } else {
                console.error("Selected file is not an image.");
                // Optionally reset the input or show an error message
                setFormData((prevData) => ({
                    ...prevData,
                    photo: null // Reset or handle invalid file
                }));
            }
        } 
        
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLoan) {
                await Axios.put(`/loan/${editingLoan.loan_id}`, formData);
                alert('Loan updated successfully!');
            } else {
                await Axios.post('/loan', formData);
                alert('Loan added successfully!');
            }
            setShowForm(false);
            fetchLoan(); // Refresh loan list
        } catch (error) {
            if (error.response && error.response.data.errors) {
                alert('Error: ' + JSON.stringify(error.response.data.errors));
            } else {
                alert('Error saving loan: ' + error.message);
            }
        }
    };
    // Function to handle search input
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter loans and users based on search input
    const filteredLoans = loans.filter((loan) => {
        const user = loan.userDetails || {};
        const searchText = searchTerm.toLowerCase();
        return (
            loan.loan_id.toLowerCase().includes(searchText) || // Search in loan_id
            (user.user_name && user.user_name.toLowerCase().includes(searchText)) || // Search in user_name
            (user.city && user.city.toLowerCase().includes(searchText)) // Search in city
        );
    });

    

    const handleToggleExpand = (id) => {
        setExpandedloanId(expandedLoanId === id ? null : id);
    };
    return (
        <div className="container">
            <Sidebar className="sidebar" />
            <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="small-button" onClick={() => setShowForm(true)}>Add Loan</button>

                    {/* Search Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by User Name, City or Loan ID"
                            style={{ padding: '5px 10px', marginRight: '10px' }}
                        />
                        <SearchOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Loan Table */}
                <div className="table-container">
                    {filteredLoans.length > 0 ? (
                        filteredLoans.map(loanItem => (
                            <div key={loanItem.id} className={`employee-card ${expandedLoanId === loanItem.id ? 'expanded' : ''}`}>
                                <div className="employee-header" onClick={() => setExpandedloanId(expandedLoanId === loanItem.id ? null : loanItem.id)}>
                                    <span className="employee-name">Loan ID: {loanItem.loan_id}</span>
                                    <span className="employee-name" style={{ marginRight: '10px' }}>
                                        {loanItem.userDetails?.user_name || 'No username'}
                                    </span>
                                    <span className="employee-city">{loanItem.userDetails?.city || 'No city'}</span>
                                    <span className={`expand-icon ${expandedLoanId === loanItem.id ? 'rotate' : ''}`}>
                                        <DownOutlined />
                                    </span>
                                </div>

                                {expandedLoanId === loanItem.id && (
                                    <div className="employee-details">
                                        <div className="employee-detail-item">
                                            <span>Amount: {loanItem.loan_amount}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span>Category: {loanItem.loan_category}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span>Loan Date: {loanItem.loan_date}</span>
                                        </div><div className="employee-detail-item">
                                            <span>Total Amount: {loanItem.total_amount}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span>Closed Date: {loanItem.loan_closed_date}</span>
                                        </div>
                                        <div className="employee-action-buttons">
                                            <EditIcon style={{ color: "green" }} onClick={() => handleEdit(loanItem)} />
                                            <DeleteIcon style={{ color: "red" }} onClick={() => handleDelete(loanItem.id)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>No loans available.</div>
                    )}
                </div>
              
       
    
                {/* Modal for adding/editing loan */}
                <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
    <DialogContent>
        <h3>{editingLoan ? 'Edit Loan' : 'Add Loan'}</h3>
        <form onSubmit={handleSubmit}>
        <div>
            <label>Loan Id</label>
            <input 
                type="text" 
                name="loan_id" 
                value={formData.loan_id} 
                onChange={handleChange} 
                required 
            />
        </div>
        
        <div>
            <label>Loan Category</label>
            <select
    name="category_id" // Update to match expected backend field
    value={formData.category_id} // Ensure this matches too
    onChange={handleChange}
    required
>
    <option value="">Select a Category</option>
    {loanCategories.map((category) => (
        <option key={category.id} value={category.id}>
            {category.category_name}
        </option>
    ))}
</select>

        </div>

        <div>
    <label>Customer Name</label>
    <select
        name="user_id"  
        value={formData.user_id}  
        onChange={handleChange}  
        required
    >
        <option value="">Select a Customer</option>
        {users.length > 0 ? (
            users
            .filter(user => user.user_type === 'user') // Filter by user_type
            .map((user) => (
                <option key={user.id} value={user.user_id}>
                    {user.user_name}
                </option>
            ))
        ) : (
            <option disabled>No Users Available</option>
        )}
    </select>
</div>

        <div>
            <label>Loan Amount</label>
            <input 
                type="text" 
                name="loan_amount" 
                value={formData.loan_amount} 
                onChange={handleChange} 
                required 
            />
        </div>

        <div>
            <label>Select Loan Date</label>
            <input
                type="date"
                name="loan_date"
                value={formData.loan_date}
                onChange={handleChange}
                required
            />
        </div>

        <div>
            <label>Total Amount</label>
            <input 
                type="text" 
                name="total_amount" 
                value={formData.loan_amount} 
                onChange={handleChange} 
                required 
            />
        </div>

        <div>
            <label>Loan Close Date</label>
            <input
                type="date"
                name="loan_closed_date"
                value={formData.loan_closed_date}
                onChange={handleChange}
                required
                readOnly // Make this read-only if it's auto-calculated
            />
        </div>

        <div>
            <label>Employee Id</label>
            <input 
                type="text" 
                name="employee_id" 
                value={formData.employee_id}
                onChange={handleChange} 
                required 
            />
        </div>

        <div>
            <label>Status</label>
                        <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
            >
                 <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>

        </div>

        <div>
         <label> Photo:</label>
          <input type="file" name="photo" onChange={handleChange} accept="image/*" />
          </div>

        <button type="submit" className="small-button">
            {editingLoan ? 'Update' : 'Add'}
        </button>
        <button 
            type="button" 
            className="small-button" 
            onClick={() => setShowForm(false)}
        >
            Cancel
        </button>
    </form>
    </DialogContent>
</Dialog>

            </div>
        </div>
    );
    
};

export default Loan;
