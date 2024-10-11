import React, { useState, useEffect } from 'react';
import Axios from "../Axios";
import '../Employee.css'; // Assuming you have a CSS file for styling
import Sidebar from './Sidebar';
import { Margin } from '@mui/icons-material';
import { DownOutlined } from '@ant-design/icons'; 
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Switch } from '@mui/material';
const Loancategory = () => {
    const [category, setcategory] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingcategory, setEditingcategory] = useState(null);
    const [expandedcategoryId, setExpandedcategoryId] = useState(null);
    const [formData, setFormData] = useState({
        loan_id:'',
        category_id: '',
        category_name: '',
        category_type: '',
        duration: '',
        interest_rate: '',
        status: 'active',
    });
    

    // Fetch employees when the component mounts
    useEffect(() => {
       
    }, []);

    const fetchcategory = async () => {
        try {
            const response = await Axios.get('/loan-category');
            
            setcategory(response.data.message);
        } catch (error) {
            alert('Error fetching category: ' + error.message);
        }
    };
    useEffect(() => {
        fetchcategory();
    }, []);

    const handleDelete = async (category_id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await Axios.delete(`category/${category_id}`);
                setcategory(category.filter(category => category.category_id !== category_id));
                alert('Category deleted successfully!');
            } catch (error) {
                alert('Error deleting category: ' + error.message);
            }
        }
    };
    

    const handleEdit = (loan) => {
        setEditingcategory(loan); 
        setFormData({
            loan_id:loan.loan_id,
            category_id: loan.category_id,
            category_name: loan.category_name,
            category_type: loan.category_type,
            duration: loan.duration,
            interest_rate: loan.interest_rate,
            status: loan.status,
        });
        setShowForm(true);
    };
    

    const handleAdd = () => {
        setEditingcategory(null);
        setFormData({
            loan_id:'',
            category_id: '',
            category_name: '',
            category_type: '',
            duration: '',
            interest_rate: '',
            status: 'active', // Set default status if necessary
        });
        setShowForm(true);
    };
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingcategory) {
                // Update category using category_id instead of id
                await Axios.put(`/loan-category/${editingcategory.category_id}`, formData);
                alert('Category updated successfully!');
            } else {
                // Add new category
                await Axios.post('/loan-category', formData);
                alert('Category added successfully!');
            }
            setShowForm(false);
            fetchcategory(); 
        } catch (error) {
            alert('Error saving category: ' + error.message);
        }
    };
    
    const handleToggleExpand = (id) => {
        setExpandedcategoryId(expandedcategoryId === id ? null : id);
    };

    const togglecategoryStatus = async (category) => {
        // Toggle the category's status
        const newStatus = category.status === 'active' ? 'inactive' : 'active';
    
        try {
            // Send the update request to the server
            await Axios.put(`/loan-category/${category.category_id}`, {
                ...category,
                status: newStatus
            });
    
            // Update local state after the server confirms the update
            setcategory(prevCategories => 
                prevCategories.map(c => 
                    c.category_id === category.category_id ? { ...c, status: newStatus } : c
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
                {/* <h2 >Loan Due List</h2> */}
                <button className="small-button" onClick={handleAdd}>Add  Loan Categry</button>
                <div className="table-container">
    {Array.isArray(category) && category.map(category => (
        <div className='maincard'>
        <div key={category.id} className={`employee-card ${expandedcategoryId === category.id ? 'expanded' : ''}`}>
            <div className="employee-header" onClick={() => handleToggleExpand(category.id)}>
            
                <span className="employee-name">{category.category_name}</span>

                {/* Arrow icon that rotates when expanded */}
                <span className={`expand-icon ${expandedcategoryId === category.id ? 'rotate' : ''}`}>
                    <DownOutlined />
                </span>
            </div>

            {expandedcategoryId === category.id && (
                <div className="employee-details">
                    
                    <div className="employee-detail-item">
                    <Switch
    checked={category.status === 'active'} // Check if status is 'active'
    onChange={() => togglecategoryStatus(category)}
    color="primary"
/>
                    </div>
                    <div className="employee-action-buttons">
                        <EditIcon style={{ color: "green" }} onClick={() => handleEdit(category)} />
                        <DeleteIcon style={{ color: "red" }} onClick={() => handleDelete(category.id)} />
                    </div>
                </div>
            )}
        </div>
        </div>
    ))}
</div>

<Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth maxWidth="sm">
<DialogContent>
   <h3>{editingcategory ? 'Edit Loan Due' : 'Add Loan Due'}</h3>
   <form onSubmit={handleSubmit}>
   
       <div>
           <label>Category Id</label>
           <input 
               type="text" 
               name="category_id" 
               value={formData.category_id} 
               onChange={handleChange} 
               required 
           />
       </div>
       <div>
           <label>Category Name</label>
           <input 
               type="text" 
               name="category_name" 
               value={formData.category_name} 
               onChange={handleChange} 
               required 
           />
       </div>
      
       <div className="employee-detail-item">
    <label htmlFor="category_type">Category Type</label>
    <select
        name="category_type"
        value={formData.category_type}
        onChange={handleChange}
        required
        className="category-type"
    >
         {/* <option value="" disabled>Select Category Type</option> */}
    <option value="weekly" selected>Weekly</option>
    <option value="monthly">Monthly</option>
    <option value="daily">Daily</option>
    </select>
</div>


       <div>
           <label>Duration</label>
           <input 
               type="number" 
               name="duration" 
               value={formData.duration} 
               onChange={handleChange} 
               required 
           />
       </div>
       <div>
           <label>Interest Rate</label>
           <input 
               type="number" 
               name="interest_rate" 
               value={formData.interest_rate} 
               onChange={handleChange} 
               required 
           />
       </div>
       <div>
           <label>Status</label>
           <input 
               type="text" 
               name="status" 
               value={formData.status} 
               onChange={handleChange} 
               required 
           />
       </div>

       <button type="submit" className="small-button">
           {editingcategory ? 'Update' : 'Add'}
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

export default Loancategory;
