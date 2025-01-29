const API_BASE_URL = `http://localhost:5000`;
export default {
  DropdownCoutry: `${API_BASE_URL}/Common/FetchCountries`,
  DropdownState: `${API_BASE_URL}/Common/FetchStates`,
  DropdownCity: `${API_BASE_URL}/Common/Fetchcities`,
  DropdownDepartment: `${API_BASE_URL}/Common/FetchDepartment`,
  DropdownDesignation: `${API_BASE_URL}/Common/FetchDesignation`,
  DropdownLanguages: `${API_BASE_URL}/Common/FetchLanguages`,
  AddEmployee: `${API_BASE_URL}/Employee/AddEmployee`,
  DeleteEmployee: `${API_BASE_URL}/Employee/DeleteEmployee`,
  EmployeeById:`${API_BASE_URL}/Employee/GetmployeesById`,
  GetAllEmployees: `${API_BASE_URL}/Employee/GetEmployee`,
  ExportToExcel: `${API_BASE_URL}/Employee/ExportToExcel`,
};


