import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Dropdown from "../Common/Dropdown";
import {
  fetchCities,
  fetchCountries,
  fetchDepartments,
  fetchStates,
} from "../Common/DropdownFilter";
import { ApiCall } from "../APICall/APICall";
import ApiRoutes from "../APICall/APIRoutes";
import toast from "react-hot-toast";

function DropdownFilters({ setDashboardData, getEmployeesData }) {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);

  const handleCountrySelect = async (data) => {
    const statesData = await fetchStates(data?.value);
    setStates(statesData);
    setCities([]); // Reset cities when country changes
    reset({
      ...getValues(),
      State_name: null,
      City_name: null,
    });
  };

  const handleReset = () => {
    reset({
      Country_name: null,
      State_name: null,
      City_name: null,
      department: null,
    });
    setStates([]);
    setCities([]);
    getEmployeesData(); // Fetch all employees again
  };

  const getCountries = async () => {
    const countryData = await fetchCountries();
    setCountries(countryData);
  };

  const getDepartments = async () => {
    const departmentData = await fetchDepartments();
    setDepartments(departmentData);
  };

  useEffect(() => {
    getCountries();
    getDepartments();
  }, []);

  const handleStateSelect = async (data) => {
    const cityData = await fetchCities(data?.value);
    setCities(cityData);
    reset({
      ...getValues(),
      City_name: null,
    });
  };

  const onSubmit = async (data) => {
    try {
      const reqData = {
        country_id: data?.Country_name?.value,
        state_id: data?.State_name?.value,
        city_id: data?.City_name?.value,
        department_id: data?.department?.value,
      };
      const response = await ApiCall(ApiRoutes?.GetAllEmployees, reqData);

      if (response?.success) {
        const formattedData = response?.data?.map((item) => ({
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
        toast.success(response?.message);
      } else {
        toast.error("Failed to fetch filtered employees");
      }
    } catch (error) {
      toast.error("Failed to Fetch Employees");
      console.error("Error fetching employees:", error);
    }
  };

  return (
    <div className="my-5">
      <form className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-[90%] mx-auto my-3">
        {/* Country dropdown */}
        <div>
          <label className="required">Country</label>
          <Controller
            name="Country_name"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Dropdown
                id="country"
                name="Country_name"
                data={countries}
                isMulti={false}
                value={field.value} // Correctly set the value
                onChange={(e) => {
                  handleCountrySelect(e);
                  field.onChange(e);
                }}
                placeholder="Select Country"
              />
            )}
          />
          {errors?.Country_name && (
            <p className="text-red-500">{errors?.Country_name?.message}</p>
          )}
        </div>

        {/* State dropdown */}
        <div>
          <label className="required">State</label>
          <Controller
            name="State_name"
            control={control}
            rules={{ required: "State is required" }}
            render={({ field }) => (
              <Dropdown
                id="state"
                name="State_name"
                data={states}
                isMulti={false}
                value={field.value} // Correctly set the value
                onChange={(e) => {
                  handleStateSelect(e);
                  field.onChange(e);
                }}
                placeholder="Select State"
              />
            )}
          />
          {errors?.State_name && (
            <p className="text-red-500">{errors?.State_name?.message}</p>
          )}
        </div>

        {/* City dropdown */}
        <div>
          <label className="required">City</label>
          <Controller
            name="City_name"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <Dropdown
                id="city"
                name="City_name"
                data={cities}
                isMulti={false}
                value={field.value} // Correctly set the value
                onChange={(e) => {
                  field.onChange(e);
                }}
                placeholder="Select City"
              />
            )}
          />
          {errors?.City_name && (
            <p className="text-red-500">{errors?.City_name?.message}</p>
          )}
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
                name="department"
                data={departments}
                isMulti={false}
                value={field.value} // Correctly set the value
                onChange={(e) => {
                  field.onChange(e);
                }}
                placeholder="Select Department"
              />
            )}
          />
          {errors?.department && (
            <p className="text-red-500">{errors?.department?.message}</p>
          )}
        </div>
      </form>
      <div className="flex gap-3 justify-end mx-5">
        <button className="bg-black flex justify-center items-center px-4 py-2 rounded-md" onClick={handleSubmit(onSubmit)}>
          <span className="text-white">Submit</span>
        </button>
        <button className="bg-black flex justify-center items-center px-4 py-2 rounded-md" onClick={handleReset}>
          <span className="text-white">Reset</span>
        </button>
      </div>
    </div>
  );
}

export default DropdownFilters;