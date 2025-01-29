import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeForm from "../Master/EmployeeCreate";
import Dashboard from "../Master/EmployeemasterIndex";

function AppNavigator() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Create" element={<EmployeeForm />} />
    </Routes>
  );
}

export default AppNavigator;
