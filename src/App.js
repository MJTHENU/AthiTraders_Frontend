import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import GetStarted from './GetStarted';
import Login from './component/Login'; 
import Sidebar from './component/Sidebar';
import Admin from './component/admindashboard';
import Employee  from './component/Employee';
import Customer  from './component/Customer';
import Loandue from './component/Loandue';
import Loancategory from './component/Loancategory';
import Loan from './component/Loan';
import ForgotPassword from './component/ForgotPassword';
const App = () => {
    return (
        
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/getstarted" element={<GetStarted />} />
                <Route path="/sidebar" element={<Sidebar />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/loandue" element={<Loandue />} />
                <Route path="/loancategory" element={<Loancategory />} />
                <Route path="/loan" element={<Loan />} />
            </Routes>
       
    );
};

export default App;
