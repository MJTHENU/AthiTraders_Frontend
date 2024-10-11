import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem
} from '@mui/material';
import Axios from "../Axios";
import '../component/Todayloandue.css';
import Sidebar from './Sidebar';

const CitiesWithDueLoans = () => {
    const [cities, setCities] = useState([]);
    const [expandedCity, setExpandedCity] = useState(null);
    const [groupedLoans, setGroupedLoans] = useState({});
    const [expandedLoanId, setExpandedLoanId] = useState(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null); // Track selected city

    useEffect(() => {
        if (isFormOpen) {
            const userId = localStorage.getItem('user_id'); // Fetch user ID from localStorage
            // Set the Collection By field with the fetched user ID
            setSelectedEmployee((prev) => ({
                ...prev,
                collection_by: userId || '', // Default to empty if userId is null
            }));
        }
    }, [isFormOpen, setSelectedEmployee]);

    useEffect(() => {
        // Fetch cities with due loans
        Axios.get('/fetchCitiesWithDueLoansArray')
            .then(response => {
                setCities(response.data.cities);
            })
            .catch(error => {
                console.error("Error fetching cities", error);
            });
    }, []);


   

    const handleToggleExpand = (city) => {
        setSelectedCity(city); // Store the selected city for use
        console.log("selected city is", city);
        
        setExpandedCity(expandedCity === city ? null : city);
    
        if (expandedCity !== city) {
            // Fetch loan details for the selected city when expanding
            Axios.get(`/fetchCitiesWithDueLoans/${city}`)
                .then(response => {
                    const loanData = response.data.customers.reduce((acc, customer) => {
                        if (!acc[customer.loan_id]) acc[customer.loan_id] = [];
                        acc[customer.loan_id].push(customer);
                        return acc;
                    }, {});
                    setGroupedLoans(loanData);
                    // Also set city information on selectedEmployee when expanding
                    setSelectedEmployee(prevState => ({
                        ...prevState,
                        city: city // Add city to the selectedEmployee
                    }));
                })
                .catch(error => {
                    console.error("Error fetching loan details", error);
                });
        }
    };
    

    const handleToggleLoanExpand = (loanId) => {
        setExpandedLoanId(expandedLoanId === loanId ? null : loanId);
    };

    const handleInputChange = (loanId, employee, field, value) => {
        // Handle input changes for fields like paid_amount, paid_date, etc.
        console.log(`Updated ${field} for loanId ${loanId} and userId ${employee.user_id}: ${value}`);
    };

    const handleDelete = (loanId) => {
        // Handle delete action for loan
        console.log(`Delete loan with ID: ${loanId}`);
    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setSelectedEmployee(null);
    };

    const handleSubmiteditform = async (e) => {
        e.preventDefault();
    
        console.log('Selected Employee:', selectedEmployee); // Log to check values
    
        const { loan_id, due_amount, paid_amount, due_date, paid_date, paid_on, collection_by, status } = selectedEmployee;
        let { city } = selectedEmployee; // Get city from selectedEmployee (if available)
    
        // If city is not set in selectedEmployee, fall back to selectedCity
        if (!city) {
            city = selectedCity;
            console.log("city is set");
        }
    
        if (!city || !loan_id) {
            console.error('City or Loan ID is missing');
            return; // Prevent the submission if these values are missing
        }
    
        try {
            const response = await Axios.put(`/updateEntryLoanDue/${city}/${loan_id}`, {
                due_amount,
                paid_amount,
                due_date,
                paid_date,
                paid_on,
                collection_by,
                status,  // Make sure 'status' is included
            });
            console.log('Update successful:', response.data);
            handleCloseForm(); // Close the dialog after successful submission
        } catch (error) {
            console.error('Error updating entry:', error);
            // Handle error appropriately, e.g., show an alert or message
        }
    };
    
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement form submission logic here
        console.log("Submitting form for: ", selectedEmployee);
        handleCloseForm();
    };


    // const handleToggleExpandnew = (city) => {
    //     setSelectedCity(city); 
        
    //     console.log("selected city is", city);
    // };
    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar Component */}
            <Sidebar className="sidebar" />
        
            {/* Main Content - Cities Table */}
            <div className="table-container-todaloandue">
                {cities.length > 0 ? (
                    cities.map((city, index) => (
                        <div key={index} className="city-group">
                            <div 
                                className="city-header" 
                                onClick={() => handleToggleExpand(city)} 
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0 }}>City: {city}</h4>
                                </div>
    
                                {/* <div className="action-buttons" style={{ display: 'flex', alignItems: 'center' }}>
                                    <AddIcon style={{ color: "green", cursor: "pointer", marginLeft: '10px' }} />
                                    <DeleteIcon style={{ color: "red", cursor: "pointer", marginLeft: '10px' }} />
                                </div> */}
    
                                <span className={`expand-icon ${expandedCity === city ? 'rotate' : ''}`} style={{ marginLeft: '8px' }}>
                                    <DownOutlined />
                                </span>
                            </div>
    
                            {expandedCity === city && (
                                <div className="loan-details">
                                    {Object.keys(groupedLoans).length > 0 ? (
                                        Object.keys(groupedLoans).map(loanId => (
                                            <div key={loanId} className="loan-group">
                                                <div 
                                                    className="loan-header" 
                                                    onClick={() => handleToggleLoanExpand(loanId)} 
                                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between' }}
                                                >
                                                    <h4>Loan ID: {loanId}</h4>
    
                                                    {/* <div className="action-buttons" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <AddIcon style={{ color: "green", cursor: "pointer", marginLeft: '10px' }} />
                                                        <DeleteIcon style={{ color: "red", cursor: "pointer", marginLeft: '10px' }} onClick={() => handleDelete(loanId)} />
                                                    </div>
                                                        */}
                                                    <span className={`expand-icon ${expandedLoanId === loanId ? 'rotate' : ''}`} style={{ marginLeft: '8px' }}>
                                                        <DownOutlined />
                                                    </span>
                                                </div>
    
                                                {expandedLoanId === loanId && groupedLoans[loanId] ? (
                                                    <div className="user-list">
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th>User ID</th>
                                                                    <th>Due Amount</th>
                                                                    <th>Paid Amount</th>
                                                                    <th>Due Date</th>
                                                                    <th>Paid Date</th>
                                                                    <th>Status</th>
                                                                    <th>Collection By</th>
                                                                    <th> Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                    {groupedLoans[loanId].map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.user_id}</td>
                            <td>{employee.due_amount}</td>
                            <td>
                                <input
                                    type="number"
                                    value={employee.paid_amount || ''}
                                    min="0"
                                    step="0.01"
                                    className="input-number"
                                />
                            </td>
                            <td>{employee.due_date}</td>
                            <td>
                                {employee.paid_date ? (
                                    employee.paid_date
                                ) : (
                                    <input
                                        type="date"
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}
                            </td>
                            <td>
                                <select
                                    value={employee.paid_on || 'Unpaid'}
                                    style={{ cursor: 'pointer' }}
                                    className="status-select"
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </td>
                            <td>{employee.collection_by}</td>
                            <td>
                                <a  title="Edit" onClick={() => handleEditClick(employee)}>
                                    <EditIcon style={{ color: "green", cursor: "pointer", marginLeft: '10px' }} />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
                                                        </table>

  <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
    <DialogTitle>Edit Employee Details</DialogTitle>
    <DialogContent>
        <form onSubmit={handleSubmit}>
            <TextField
                label="User ID"
                type="text"
                value={selectedEmployee?.user_id}
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true, // Make User ID read-only
                }}
            />
            <TextField
                label="Due Amount"
                type="number"
                value={selectedEmployee?.due_amount || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, due_amount: e.target.value })}
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true, // Make Due Amount read-only
                }}
                required
            />
            <TextField
                label="Paid Amount"
                type="number"
                value={selectedEmployee?.paid_amount || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, paid_amount: e.target.value })}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Due Date"
                type="date"
                value={selectedEmployee?.due_date || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, due_date: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    readOnly: true, // Make Due Date read-only
                }}
            />
            <TextField
                label="Paid Date"
                type="date"
                value={selectedEmployee?.paid_date || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, paid_date: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <Select
                label="Status"
                className="status"
                value={selectedEmployee?.status|| 'Unpaid'}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, paid_on: e.target.value })}
                fullWidth
                margin="normal"
            >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
            </Select>
            <TextField
                label="Collection By"
                value={selectedEmployee?.collection_by || ''}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, collection_by: e.target.value })}
                fullWidth
                margin="normal"
                required
            />
        </form>
    </DialogContent>
    <DialogActions>
        <Button className="cancel" onClick={handleCloseForm} color="primary">
            Cancel
        </Button>
        <Button className="save" onClick={handleSubmiteditform} color="primary">
            Save
        </Button>
    </DialogActions>
</Dialog>



                                                    </div>
                                                ) : null}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No loans found for {city}.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No cities with due loans found.</p>
                )}
            </div>
        </div>
    );
};

export default CitiesWithDueLoans;
