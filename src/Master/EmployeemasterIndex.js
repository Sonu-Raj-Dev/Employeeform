import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { ApiCall } from "../APICall/APICall"; 
import ApiRoutes from '../APICall/APIRoutes';
import DropdownFilters from "../Filter/DropdownFilter";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [allDashboardData, setAllDashboardData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEditClick = (row) => {
    navigate(`/create?id=${row.id}`);
  };

  const fetchEmployees = async () => {
    try {
      const response = await ApiCall(ApiRoutes.GetAllEmployees, {
        pageSize: rowsPerPage,
        start: page * rowsPerPage,
      });
      if (response?.success) {
        const formattedData = response.data.map((item) => ({
          id: item?.EmployeeID,
          firstname: item?.FirstName,
          lastname: item?.LastName,
          email: item?.Email,
          mobile_number: item?.MobileNumber,
          Department: { label: item?.DepartmentName, value: item?.DepartmentID },
          Country_name: { label: item?.CountryName, value: item?.CountryID },
          State_name: { label: item?.StateName, value: item?.StateID },
          City_name: { label: item?.CityName, value: item?.CityID },
        }));
        setDashboardData(formattedData);
        setAllDashboardData(formattedData);
      } else {
        toast.error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filteredData = allDashboardData.filter((item) =>
      `${item.firstname} ${item.lastname}`.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDashboardData(filteredData);
  };

  const handleAddRecord = () => {
    navigate("/Create"); // Navigate to the create employee page
  };

  const exportToCSV = async (data) => {
    try {
      

      const reqData=data.map((item) => ({
        "DepartmentId": item.Department?.value[0] || "",
        "CountryId": item.Country_name?.value || "",
        "StateId": item.State_name?.value || "",
        "CityId": item.City_name?.value || "",
      }));
      const response = await axios?.post(ApiRoutes?.ExportToExcel, reqData, {
        responseType: "blob",
      });
      console.log("====================================");
      console.log(" ressssss================================", response?.data);
      console.log("====================================");

      // const url = window.URL.createObjectURL(new Blob([response.data?.data]));
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "EmployeeDetails.xlsx"); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the Excel file:", error);
    }
  };

  const handleDeleteRecord = async (row) => {
    // Confirm deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return; // Exit if the user cancels
  
    try {
      // Call the API to delete the employee
      const payload = { empId: row.id };
      const response = await ApiCall(ApiRoutes?.DeleteEmployee,payload)
      console.log("Delete record:", row);
      
      if (response?.success) {
        // Update the state to remove the deleted employee
        setDashboardData((prevData) => prevData.filter((item) => item.id !== row.id));
        toast.success("Employee deleted successfully");
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee", error);
      toast.error("An error occurred while deleting the employee");
    }
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 170 },
    { id: "mobile", label: "Mobile", minWidth: 170 },
    { id: "department", label: "Department", minWidth: 170 },
    { id: "country", label: "Country", minWidth: 170 },
    { id: "state", label: "State", minWidth: 170 },
    { id: "city", label: "City", minWidth: 170 },
    { id: "edit", label: "Edit", minWidth: 170 },
  ];

  return (
    <div>
      <h1 className="text-center text-4xl font-bold">Employee Dashboard</h1>
      <div className="flex justify-end mx-10 mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRecord}
          className="bg-blue-500 text-white"
        >
          + Add Employee
        </Button>
      </div>
      <DropdownFilters setDashboardData={setDashboardData} getEmployeesData={fetchEmployees} />
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  style={{
                    backgroundColor: "#f5f5f5",
                    fontWeight: "bold",
                  }}
                >
                  <div className="flex justify-between items-center px-4">
                    <h2>Employee Table</h2>
                    <div>
                      <TextField
                        label="Search by Name"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => exportToCSV(dashboardData)} 
                        style={{ marginLeft: "10px" }}
                      >
                        Export to Excel
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth, backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell>{`${row.firstname} ${row.lastname}`}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.mobile_number}</TableCell>
                  <TableCell>{row.Department.label}</TableCell>
                  <TableCell>{row.Country_name.label}</TableCell>
                  <TableCell>{row.State_name.label}</TableCell>
                  <TableCell>{row.City_name.label}</TableCell>
                  <TableCell
                    sx={{ minWidth: 170, border: "1px solid #ddd" }}
                    align="left"
                  >
                    <div className="flex flex-row gap-1 justify-center">
                      <h4
                        onClick={() => handleEditClick(row)}
                        className="text-blue-500 cursor-pointer hover:underline"
                      >
                        edit
                      </h4>
                      <h4>/</h4>
                      <h4
                        onClick={() => handleDeleteRecord(row)}
                        className="text-red-500 cursor-pointer hover:underline"
                      >
                        delete
                      </h4>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default Dashboard;