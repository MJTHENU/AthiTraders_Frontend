import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Search, Person } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Sidebar from "./Sidebar"; // Importing your existing Sidebar component
import Axios from "../Axios";
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [totalCollection, setTotalCollection] = useState(0); // State for total collection
  const [TotalLoan, setTotalLoan] = useState(0); // State for total loan count
  const [TotalCustomer, setTotalCustomer] = useState(0); // State for total customers
  const [TotalEmployee, setTotalEmployee] = useState(0); // State for total employees
  const [TotalCollectionbyemp, setTotalCollectionbyemp] = useState(0); // State for total employees
  const [Totaldue, setTotaldue] = useState(0); // State for total due amount
  const [Totalloandue, setTotalloandue] = useState(0);
  const [loans, setLoans] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get userId from localStorage
    const userId = localStorage.getItem('user_id'); // Ensure 'storedUserId' is the correct key
  
    // Log userId to check its value
    console.log("User ID found:", userId);
  
    // Check if the userId exists
    if (userId) {
      // fetchCollectionbyemp(userId);  // Pass the userId to the function
    } else {
      // console.error('User ID not found in localStorage');
    }
  }, []);
  

const fetchCollectionbyemp = async () => {
  try {
    const userId = localStorage.getItem('user_id'); // Ensure 'storedUserId' is the correct key
  
    // Log userId to check its value
    console.log("User ID found:", userId);
    console.log("Fetching collection for userId:", userId); // Log userId

    const response = await Axios.post(
      `https://reiosglobal.com/Athitraders_Backend/api/fetchLoanByEmpPaidDate`,
      { collection_by: userId },  // Send userId in the request body
      {
        headers: {
          'Content-Type': 'application/json', // Ensure Content-Type is JSON
        }
      }
    );

    if (response.data) {
      setTotalCollectionbyemp(response.data.message);
      console.log("Total collected amount by employee:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching total collection:", error);
  }
};







  // Function to fetch total collection
  const fetchTotalCollection = async () => {
    try {
      const response = await Axios.get('https://reiosglobal.com/Athitraders_Backend/api/fetch-loan-by-current-date');
      if (response.data) {
        setTotalCollection(response.data.total_income); // Assuming 'total_income' is the field returned from API
        setTotaldue(response.data.total_due_amount);
        console.log("total income:", response.data.total_income);
      }
    } catch (error) {
      console.error("Error fetching total collection:", error);
    }
  };

  const fetchTotalLoandues = async () => {
    try {
      const response = await Axios.get('https://reiosglobal.com/Athitraders_Backend/api/totalloandue');
      if (response.data) {
        // setTotalCollection(response.data.total_income); // Assuming 'total_income' is the field returned from API
        setTotalloandue(response.data.total_due_amount);
        console.log("total income:", response.data.total_due_amount);
      }
    } catch (error) {
      console.error("Error fetching total collection:", error);
    }
  };

  // Fetch loan count
  const fetchLoanCount = async () => {
    try {
      const response = await Axios.get('/loans/count-pending-inprogress');
      setTotalLoan(response.data.count); // Assuming the API returns the total loan count
    } catch (error) {
      console.error("Error fetching loan count:", error);
    }
  };

  // Fetch customer count
  const fetchCustomerCount = async () => {
    try {
      const response = await Axios.get('/customer-count');
      setTotalCustomer(response.data.customer_count); // Assuming you have a state to hold the customer count
    } catch (error) {
      console.error("Error fetching customer count:", error);
    }
  };

  // Fetch employee count
  const fetchEmployeeCount = async () => {
    try {
      const response = await Axios.get('/employee-count');
      setTotalEmployee(response.data.employee_count); // Assuming you have a state to hold the employee count
      console.log(response.data.employee_count);
    } catch (error) {
      console.error("Error fetching employee count:", error);
    }
  };

  // Fetch loans
  const fetchLoans = async () => {
    try {
      const response = await Axios.get('https://reiosglobal.com/Athitraders_Backend/api/loan');
      // const sortedLoans = response.data.loans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date in descending order
      setLoans( response.data.loans); // Set the sorted loans data
    } catch (error) {
      console.error("Error fetching loans data:", error);
    }
  };
  

  // Fetch total collection on component mount
  useEffect(() => {
    fetchTotalCollection();
    fetchLoanCount();
    fetchCustomerCount();
    fetchEmployeeCount();
    fetchLoans();
    fetchTotalLoandues();
fetchCollectionbyemp();
  }, []);

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, sm: "240px" }, // Ensure space for Sidebar (adjust width as needed)
          width: { xs: "100%", sm: `calc(100% - 240px)` }, // Adjust width based on sidebar width
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ color: "#188b3E" }}>
            Aathi Traders !!!
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton>
              <Search />
            </IconButton>
            <Avatar>
              <Person />
            </Avatar>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={3}>
          {[
            { label: "Loan", value: TotalLoan },
            { label: "Customer", value: TotalCustomer },
            { label: "Employees", value: TotalEmployee },
            { label: "Due Amount", value: Totalloandue },
            { label: "Total Collection", value: totalCollection },
          ].map((stat, index) => (
            <Grid item xs={12} md={2} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  textAlign: "center",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: "#188b3E" }}>{stat.value}</Typography>
                <Typography>{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Loan Summary and Total Collection Bar Chart */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: "#188b3E" }}>
                  Total Collection for Current Date
                </Typography>
                <Typography>View More</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: "Total Collection", value: totalCollection }]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#188b3E" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >


              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: "#188b3E" }}>
                  Loan Summary
                </Typography>
                <Link to="/indexweb" style={{ textDecoration: 'none' }}>
            <Typography>View More</Typography>
        </Link>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Place</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Loan issue Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loans.map((loan, index) => (
                    <TableRow key={index}>
                      <TableCell>{loan.employee_id},{loan.employee_name}</TableCell> {/* Employee Name */}
                      <TableCell>{loan.customer_name}</TableCell> {/* Customer Name */}
                      <TableCell>{loan.city}</TableCell> {/* Place */}
                      <TableCell>{loan.status}</TableCell> {/* Status */}
                      <TableCell>{loan.loan_date}</TableCell> {/* You may need to add a due date field if available */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>

        {/* Working Activity */}
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Typography variant="h6" sx={{ color: "#188b3E" }}>
            Working Activity
          </Typography>
          {/* Add your working activity content here */}
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;
