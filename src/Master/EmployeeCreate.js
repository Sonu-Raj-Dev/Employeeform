import React, { useState, useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import {
  fetchCountries,
  fetchCities,
  fetchDepartments,
  fetchDesignation,
  fetchLanguages,
  fetchStates,
} from "../Common/DropdownFilter";
import { useNavigate, useSearchParams } from "react-router-dom";
import Dropdown from "../Common/Dropdown";
import DatePickerComponent from "../Common/DatePicker";
import ApiRoutes from "../APICall/APIRoutes";
import { ApiCall } from "../APICall/APICall";

const EmployeeForm = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchInitialData = async () => {
      const countryData = await fetchCountries();
      const departmentData = await fetchDepartments();
      const designationData = await fetchDesignation();
      const languageData = await fetchLanguages();

      setCountries(countryData);
      setDepartments(departmentData);
      setDesignations(designationData);
      setLanguages(languageData);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const id = searchParams.get("id");
      if (id) {
        try {
          const response = await ApiCall(ApiRoutes?.EmployeeById, { empId: id });
          if (response.success) {
            const employeeData = response.data[0]; // Assuming the response is an array
            if (employeeData) {
              await handleCountrySelect({ value: employeeData.CountryID });
              await handleStateSelect({ value: employeeData.StateID });

              reset({
                employeeid: employeeData.EmployeeID,
                firstName: employeeData.FirstName,
                lastName: employeeData.LastName,
                email: employeeData.Email,
                mobilenumber: employeeData.MobileNumber,
                country: employeeData.CountryID,
                state: employeeData.StateID,
                city: employeeData.CityID,
                address: employeeData.Address,
                alternatemobile: employeeData.AlternateNumber,
                dob: employeeData.DateOfBirth,
                doj: employeeData.DateOfJoining,
                department: employeeData.DepartmentID,
                designation: employeeData.DesignationID,
                languages: employeeData.LanguageIDs ? employeeData.LanguageIDs.split(',').map(lang => lang.trim()) : [],
              });
            }
          } else {
            alert("Failed to fetch employee data.");
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
          alert("An error occurred while fetching employee data.");
        }
      }
    };

    fetchEmployeeData();
  }, [searchParams, reset]);

  const handleCountrySelect = async (selectedCountry) => {
    const stateData = await fetchStates(selectedCountry.value);
    setStates(stateData);
    setCities([]);
    reset({
      ...getValues(),
      state: null,
      city: null,
    });
  };

  const handleStateSelect = async (selectedState) => {
    const cityData = await fetchCities(selectedState.value);
    setCities(cityData);
    reset({
      ...getValues(),
      city: null,
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = await ApiCall(ApiRoutes?.AddEmployee, data);
      if (response.success) {
        reset();
        navigate("/"); // Change to your success route
      } else {
        alert("Employee already exists");
        console.error("Error adding employee:", response.message);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Form</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First Name is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  id="firstName"
                  {...field}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last Name is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  id="lastName"
                  {...field}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required", pattern: /^\S+@\S+$/i }}
              render={({ field }) => (
                <input
                  type="email"
                  id="email"
                  {...field}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label>Mobile Number</label>
            <Controller
              name="mobilenumber"
              control={control}
              rules={{
                pattern: {
                  value: /^[6-9][0-9]{9}$/,
                  message: "Please enter a valid mobile number",
                },
              }}
              render={({ field }) => (
                <>
                  <input
                    id="mobilenumber"
                    className="form-control mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    {...field}
                    placeholder="Enter Mobile number"
                  />
                  {errors.mobilenumber && <p className="text-red-500">{errors.mobilenumber.message}</p>}
                </>
              )}
            />
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="required">Country</label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Dropdown
                  id="country"
                  data={countries}
                  onChange={(e) => {
                    field.onChange(e.value);
                    handleCountrySelect(e);
                  }}
                  isMulti={false}
                  value={countries.find(country => country.value === field.value)}
                  placeholder="Select country"
                />
              )}
            />
            {errors.country && <p className="text-red-500">{errors.country.message}</p>}
          </div>

          {/* State Dropdown */}
          <div className="mb-4">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <Dropdown
                  id="state"
                  data={states}
                  onChange={(e) => {
                    field.onChange(e.value);
                    handleStateSelect(e);
                  }}
                  isMulti={false}
                  value={states.find(state => state.value === field.value)}
                  placeholder="Select state"
                />
              )}
            />
            {errors.state && <p className="text-red-500">{errors.state.message}</p>}
          </div>

          {/* City Dropdown */}
          <div>
            <label className="required">City</label>
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field }) => (
                <Dropdown
                  id="city"
                  data={cities}
                  onChange={(e) => field.onChange(e.value)}
                  isMulti={false}
                  value={cities.find(city => city.value === field.value)}
                  placeholder="Select city"
                />
              )}
            />
            {errors.city && <p className="text-red-500">{errors.city.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="required">Address</label>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <textarea
                  id="address"
                  className="form-control mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  {...field}
                  placeholder="Enter address"
                />
              )}
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>

          {/* Alternate Contact */}
          <div>
            <label>Alternate Contact</label>
            <Controller
              name="alternatemobile"
              control={control}
              rules={{
                pattern: {
                  value: /^[6-9][0-9]{9}$/,
                  message: "Please enter a valid mobile number",
                },
              }}
              render={({ field }) => (
                <>
                  <input
                    id="alternatemobile"
                    className="form-control mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    {...field}
                    placeholder="Enter alternate contact number"
                  />
                  {errors.alternatemobile && <p className="text-red-500">{errors.alternatemobile.message}</p>}
                </>
              )}
            />
          </div>

          {/* Designation dropdown */}
          <div>
            <label className="required">Designation</label>
            <Controller
              name="designation"
              control={control}
              rules={{ required: "Designation is required" }}
              render={({ field }) => (
                <Dropdown
                  id="designation"
                  data={designations}
                  onChange={(e) => field.onChange(e.value)}
                  isMulti={false}
                  value={designations.find(designation => designation.value === field.value)}
                  placeholder="Select designation"
                />
              )}
            />
            {errors.designation && <p className="text-red-500">{errors.designation.message}</p>}
          </div>

          {/* DOB DatePicker */}
          <div>
            <label className="required">DOB</label>
            <Controller
              name="dob"
              control={control}
              rules={{ required: "DOB is required" }}
              render={({ field }) => (
                <DatePickerComponent
                  id="dob"
                  onChange={field.onChange}
                  value={field.value}
                  placeholder="Select Date of Birth"
                />
              )}
            />
            {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
          </div>

          {/* DOJ DatePicker */}
          <div>
            <label className="required">DOJ</label>
            <Controller
              name="doj"
              control={control}
              rules={{ required: "DOJ is required" }}
              render={({ field }) => (
                <DatePickerComponent
                  id="doj"
                  onChange={field.onChange}
                  value={field.value}
                  placeholder="Select Date of Joining"
                />
              )}
            />
            {errors.doj && <p className="text-red-500">{errors.doj.message}</p>}
          </div>

          {/* Language dropdown */}
          <div>
            <label className="required">Language</label>
            <Controller
              name="languages"
              control={control}
              rules={{ required: "Language is required" }}
              render={({ field }) => (
                <>
                  <Dropdown
                    id="languages"
                    data={languages}
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value.toString()) : []; // Convert to string
                      field.onChange(selectedValues);
                    }}
                    isMulti={true}
                    // Ensure field.value is an array to avoid undefined errors
                    value={languages.filter(lang => (field.value || []).includes(lang.value.toString()))}
                    placeholder="Select language"
                  />
                </>
              )}
            />
            {errors.languages && <p className="text-red-500">{errors.languages.message}</p>}
          </div>

          {/* Department dropdown */}
          <div>
            <label className="required">Department</label>
            <Controller
              name="department"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Dropdown
                  id="department"
                  data={departments}
                  onChange={(e) => field.onChange(e.value)}
                  isMulti={false}
                  value={departments.find(department => department.value === field.value)}
                  placeholder="Select department"
                />
              )}
            />
            {errors.department && <p className="text-red-500">{errors.department.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;