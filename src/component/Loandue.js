import React, { useState, useEffect } from 'react';
import Axios from "../Axios";
import '../Employee.css'; // Assuming you have a CSS file for styling
import Sidebar from './Sidebar';
import { DownOutlined } from '@ant-design/icons'; 
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const Loandue = () => {
    const [loans, setLoans] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);
    const [formData, setFormData] = useState({
        loan_id: '',
        user_id: '',
        due_amount: '',
        due_date: '',
        paid_on: '',
        collection_by: '',
    });
    const [filterLoanId, setFilterLoanId] = useState('');
    const [filterUserId, setFilterUserId] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('user_id'); // Assuming userId is stored in localStorage
        if (userId) {
            setFormData((prevData) => ({
                ...prevData,
                collection_by: userId, // Set reference user ID from localStorage
            }));
        }
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await Axios.get('/loan-due');
            setEmployees(response.data.message);
        } catch (error) {
            // alert('Error fetching loandue: ' + error.message);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchLoan = async () => {
        try {
            const response = await Axios.get('/loan');
            setLoans(response.data.loans); // Store the fetched loans
        } catch (error) {
            alert('Error fetching loan: ' + error.message);
        }
    };

    useEffect(() => {
        fetchLoan();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await Axios.delete(`employees/${id}`);
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
            user_name: employee.user_name,
            aadhar_number: employee.aadhar_number,
            address: employee.address,
            city: employee.city,
            pincode: employee.pincode,
            district: employee.district,
            user_type: employee.user_type,
            status: employee.status,
            mobile_number: employee.mobile_number,
            email: employee.email,
            password: '', // Keep password empty for editing
        });
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        setFormData({
            loan_id: '',
            user_id: '',
            due_amount: '',
            due_date: '',
            paid_on: '',
            collection_by: '',
        });
        setShowForm(true);
    };

    const handleLoanChange = (e) => {
        const { value } = e.target;
        const selectedLoan = loans.find(loan => loan.loan_id.toString() === value);
    
        if (selectedLoan) {
            setFormData({
                ...formData,
                loan_id: selectedLoan.loan_id, // Update loan_id
                user_id: selectedLoan.user_id  // Update user_id
            });
        } else {
            console.error('Loan not found');
        }
    };
    
    const handleUserChange = (e) => {
        const { value } = e.target;
        const selectedUserLoan = loans.find(loan => loan.user_id.toString() === value);
    
        if (selectedUserLoan) {
            setFormData({
                ...formData,
                user_id: selectedUserLoan.user_id, // Update user_id
                loan_id: selectedUserLoan.loan_id    // Update loan_id
            });
        } else {
            console.error('User not found');
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                await Axios.put(`/loan-due/${editingEmployee.id}`, formData);
                alert('Loan due updated successfully!');
            } else {
                await Axios.post('/loan-due', formData);
                alert('Loan due added successfully!');
            }
            setShowForm(false);
            fetchEmployees(); // Refresh employee list
        } catch (error) {
            alert('Error saving Loan due: ' + error.message);
        }
    };

    const handleToggleExpand = (id) => {
        setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
    };

    // Filter employees based on the loan ID input
    const filteredEmployees = employees.filter(employee =>
        employee.loan_id.toString().includes(filterLoanId)
    );

    return (
        <div className="container">
            <Sidebar className="sidebar" />
            <div className="main-content">
                <button className="small-button" onClick={() => setShowForm(true)}>Add Loan Due</button>

                 <div>
            <div>
                <label>Filter by Loan ID:</label>
                <input
                    type="text"
                    value={filterLoanId}
                    onChange={(e) => setFilterLoanId(e.target.value)}
                    placeholder="Enter Loan ID"
                />
            </div>
            
        </div>

                <div className="table-container">
                    {Array.isArray(filteredEmployees) && filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                            <div key={employee.id} className={`employee-card ${expandedEmployeeId === employee.id ? 'expanded' : ''}`}>
                                <div className="employee-header" onClick={() => handleToggleExpand(employee.id)}>
                                    <div className="employee-detail-item">
                                        <span><strong>Loan ID:</strong> {employee.loan_id}</span>
                                    </div>
                                    <span className="employee-name">User ID: {employee.user_id}</span>
                                    <span className={`expand-icon ${expandedEmployeeId === employee.id ? 'rotate' : ''}`}>
                                        <DownOutlined />
                                    </span>
                                </div>

                                {expandedEmployeeId === employee.id && (
                                    <div className="employee-details">
                                        <div className="employee-detail-item">
                                            <span><strong>Due Amount:</strong> {employee.due_amount}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span><strong>Due Date:</strong> {employee.due_date}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span><strong>Paid On:</strong> {employee.paid_on}</span>
                                        </div>
                                        <div className="employee-detail-item">
                                            <span><strong>Collection By:</strong> {employee.collection_by}</span>
                                        </div>
                                        <div className="employee-action-buttons">
                                            <EditIcon 
                                                style={{ color: "green", cursor: "pointer" }} 
                                                onClick={() => handleEdit(employee)} 
                                            />
                                            <DeleteIcon 
                                                style={{ color: "red", cursor: "pointer", marginLeft: '10px' }} 
                                                onClick={() => handleDelete(employee.id)} 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>No loan dues available</div>
                    )}
                </div>

                <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
                    <DialogContent>
                        <h3>{editingEmployee ? 'Edit Loan Due' : 'Add Loan Due'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Loan ID</label>
                                <select
                                    name="loan_id"
                                    value={formData.loan_id}
                                    onChange={handleLoanChange} // Update loan_id and user_id when loan is selected
                                    required
                                >
                                    <option value="">Select Loan</option>
                                    {loans.map(loan => (
                                        <option key={loan.loan_id} value={loan.loan_id}>
                                            {loan.loan_id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>User ID</label>
                                <select
                                    name="loan_id"
                                    value={formData.user_id}
                                    onChange={handleUserChange} // Update loan_id and user_id when loan is selected
                                    required
                                >
                                    <option value="">Select User</option>
                                    {loans.map(user => (
                                        <option key={user.user_id} value={user.user_id}>
                                            {user.user_id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Due Amount</label>
                                <input
                                    type="text"
                                    name="due_amount"
                                    value={formData.due_amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    name="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Paid On</label>
                                <input
                                    type="date"
                                    name="paid_on"
                                    value={formData.paid_on}
                                    onChange={handleChange}
                                />
                            </div>
                            <DialogActions>
                                <Button onClick={() => setShowForm(false)} color="primary">Cancel</Button>
                                <Button type="submit" color="primary">{editingEmployee ? 'Update' : 'Add'}</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Loandue;
