import React, { useState, useEffect } from 'react';
import Axios from "../Axios";
import '../Employee.css'; // Assuming you have a CSS file for styling
import Sidebar from './Sidebar';
import { DownOutlined } from '@ant-design/icons'; 
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import '../loandue.css';


const Loandue = (initialGroupedLoans) => {
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
    const [expandedLoanId, setExpandedLoanId] = useState(null);
     const [LoansGroup, setLoansGroup] = useState(initialGroupedLoans);
    console.log(filterLoanId); // Check if this has the expected value

const filteredEmployees = (employees ?? []).filter(employee =>
    employee.loan_id?.toString().includes(filterLoanId)
);

console.log(filteredEmployees); // Check the filtered data

    
    
    

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
            setEmployees(response.data.data);  // Set the correct data array
            console.log("loandue", response.data.data);
        } catch (error) {
            console.error('Error fetching loandue:', error.message);  // Log the error to see if something goes wrong
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
        if (window.confirm('Are you sure you want to delete this loan due?')) {
            try {
                await Axios.delete(`loan-due/${id}`);
                setEmployees(employees.filter(employee => employee.id !== id));
                alert('loandue deleted successfully!');
            } catch (error) {
                alert('Error deleting loandue: ' + error.message);
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
        // setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
        setExpandedLoanId(expandedLoanId === id ? null : id); // Toggle expand/collapse
    };

    // // Filter employees based on the loan ID input
    // const filteredEmployees = employees.filter(employee =>
    //     employee.loan_id.toString().includes(filterLoanId)
    // );

     // Function to group loans by loan_id
     function groupLoansById(employees) {
        console.log(employees); // Check if employees are being passed to this function
        return employees.reduce((groups, employee) => {
            const { loan_id } = employee;
            if (!groups[loan_id]) {
                groups[loan_id] = [];
            }
            groups[loan_id].push(employee);
            return groups;
        }, {});
    }
    
  
    const groupedLoans = groupLoansById(filteredEmployees);
    console.log(groupedLoans);

    const handleUpdateLoan = async (loanId, dueDate, status, paidAmount, paidOn) => {
        try {
            const response = await Axios.put(`/loan_due/${loanId}/${dueDate}/${status}`, {
                paid_amount: paidAmount,
                paid_on: paidOn,
            });
            console.log('Loan updated successfully:', response.data);
            // Optionally, refresh data or update local state here
        } catch (error) {
            console.error('Error updating loan:', error);
        }
    };

    const handleInputChange = (loanId, employee, field, value) => {
        // Update state without mutating the original employee object
        const updatedEmployee = { ...employee, [field]: value };

        // Update the groupedLoans state
        setLoansGroup((prev) => {
            const updatedLoans = { ...prev };
            updatedLoans[loanId] = updatedLoans[loanId].map(emp => 
                emp.id === employee.id ? updatedEmployee : emp
            );
            return updatedLoans;
        });

        // Call the API to update the loan whenever any of the fields are changed
        handleUpdateLoan(
            updatedEmployee.loan_id,
            updatedEmployee.due_date,
            updatedEmployee.status,
            updatedEmployee.paid_amount,
            updatedEmployee.paid_on
        );
    };

    return (
        <div className="container">
            <Sidebar className="sidebar" />
            <div className="main-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <button className="small-button" onClick={() => setShowForm(true)}>Add Loan Due</button>

               
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
              
                <input
                    type="text"
                    value={filterLoanId}
                    onChange={(e) => setFilterLoanId(e.target.value)}
                    placeholder="Enter Loan ID"
                    style={{ padding: '5px 10px', marginRight: '10px' }}

                />
                 <SearchOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />

            </div>
            
        </div>

        <div className="table-container">
            {Object.keys(groupedLoans).length > 0 ? (
                Object.keys(groupedLoans).map(loanId => (
                    <div key={loanId} className="loan-group">
                        <div 
                            className="loan-header" 
                            onClick={() => handleToggleExpand(loanId)} 
                            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h4 style={{ margin: 0 }}>Loan ID: {loanId}</h4>
                            </div>

                            <div className="employee-action-buttons" style={{ display: 'flex', alignItems: 'center' }}>
                                {/* <AddIcon 
                                    style={{ color: "green", cursor: "pointer", marginLeft: '10px' }} 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        // Add any additional logic if needed
                                    }} 
                                /> */}
                                {/* <DeleteIcon 
                                    style={{ color: "red", cursor: "pointer", marginLeft: '10px' }} 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleDelete(loanId); 
                                    }} 
                                /> */}
                            </div>

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
                                                        // onChange={(e) => handleInputChange(loanId, employee, 'paid_amount', e.target.value)}
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
                                                            // onChange={(e) => handleInputChange(loanId, employee, 'paid_date', e.target.value)}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <select
                                                        value={employee.paid_on || 'Unpaid'}
                                                        style={{ cursor: 'pointer' }}
                                                        className="status-select"
                                                        // onChange={(e) => handleInputChange(loanId, employee, 'paid_on', e.target.value)}
                                                    >
                                                        <option value="Paid">Paid</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Unpaid">Unpaid</option>
                                                    </select>
                                                </td>
                                                <td>{employee.collection_by}</td>
                                              
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                    </div>
                ))
            ) : (
                <p>No loans found.</p>
            )}
        </div>

        {showForm && (
            <Dialog open={showForm} onClose={() => setShowForm(false)}>
                <DialogTitle>{editingEmployee ? 'Edit Loan Due' : 'Add Loan Due'}</DialogTitle>
                <DialogContent>
    <form onSubmit={handleSubmit}>
    <div className="form-group">
    <label>Loan ID</label>
    <select
        name="loan_id"
        value={formData.loan_id}
        onChange={handleLoanChange}
        placeholder="Loan ID"
    >
        <option value="">Select Loan ID</option>
        {loans.map((loan) => (
            <option key={loan.id} value={loan.loan_id}>
                {loan.loan_id}
            </option>
        ))}
    </select>
</div>

        
<div className="form-group">
    <label>User ID</label>
    <select
        name="user_id"
        value={formData.user_id}
        onChange={handleUserChange}
       
    >
        <option value="">Select User ID</option>
        {loans.map((loan) => (
            <option key={loan.user_id} value={loan.user_id}>
                {loan.user_id}
            </option>
        ))}
    </select>
</div>

        
        <div className="form-group">
            <label>Due Amount</label>
            <input
                type="number"
                name="due_amount"
                value={formData.due_amount}
                onChange={handleChange}
                placeholder="Due Amount"
            />
        </div>
        <div className="form-group">
            <label>Paid Amount</label>
            <input
                type="number"
                name="paid_amount"
                value={formData.due_amount}
                onChange={handleChange}
                placeholder="Due Amount"
            />
        </div>
        
        <div className="form-group">
            <label>Due Date</label>
            <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                placeholder="Due Date"
            />
        </div>
        
        <div className="form-group">
            <label>Paid On</label>
            <input
                type="date"
                name="paid_on"
                value={formData.paid_on}
                onChange={handleChange}
                placeholder="Paid On"
            />
        </div>
        
        <DialogActions>
            <Button onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" color="primary">
                {editingEmployee ? 'Update' : 'Add'}
            </Button>
        </DialogActions>
    </form>
</DialogContent>

            </Dialog>
        )}
    </div>
</div>
    );
};

export default Loandue;
