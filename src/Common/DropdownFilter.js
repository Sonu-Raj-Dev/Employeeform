import axios from "axios";
import ApiRoutes from "../APICall/APIRoutes";
import { ApiCall } from "../APICall/APICall";

export const fetchCountries = async () => {
  try {
    const response = await axios.get(ApiRoutes?.DropdownCoutry);
    if (response?.data?.success === true) {
      const countryData = response?.data?.data?.map((item) => {
        return { value: item?.Id, label: item.Name };
      });
      return countryData;
    } else {
      console.log("Failed to fetch countries");
    }
  } catch (error) {
    console.log(`error while fetching countries: ${error}`);
  }
};

export const fetchLanguages = async () => {
  try {
    const response = await axios.get(ApiRoutes?.DropdownLanguages);
    if (response?.data?.success === true) {
      const Language = response?.data?.data?.map((item) => {
        return { value: item?.Id, label: item.Name };
      });
      return Language;
    } else {
      console.log("Failed to fetch Languages");
    }
  } catch (error) {
    console.log(`error while fetching Languages: ${error}`);
  }
};

export const fetchDesignation = async () => {
  try {
    const response = await axios.get(ApiRoutes?.DropdownDesignation);
    if (response?.data?.success === true) {
      const Designation = response?.data?.data?.map((item) => {
        return { value: item?.Id, label: item.Name };
      });
      return Designation;
    } else {
      console.log("Failed to fetch Designation");
    }
  } catch (error) {
    console.log(`error while fetching Designation: ${error}`);
  }
};

export const fetchDepartments = async () => {
  try {
    const response = await axios.get(ApiRoutes?.DropdownDepartment);
    if (response?.data?.success === true) {
      const Departments = response?.data?.data?.map((item) => {
        return { value: item?.Id, label: item.Name };
      });
      return Departments;
    } else {
      console.log("Failed to fetch Departments");
    }
  } catch (error) {
    console.log(`error while fetching Departments: ${error}`);
  }
};

export const fetchStates = async (countryId) => {
  try {
    const reqData = {
      country: countryId,
    };
    const response = await ApiCall(ApiRoutes?.DropdownState, reqData);
    console.log(response);
    if (response?.success === true) {
      const stateData = response?.data?.map((item) => {
        return { value: item?.Id, label: item.Name };
      });
      return stateData;
    } else {
      console.log("Failed to fetch states");
    }
  } catch (error) {
    console.log(`error while fetching states: ${error}`);
  }
};

export const fetchCities = async (stateId) => {
  try {
    const reqData = {
      state: stateId,
    };
    const response = await ApiCall(ApiRoutes?.DropdownCity, reqData);
    console.log(response);
    if (response?.success === true) {
      const cityData = response?.data?.map((item) => {
        return { value: item?.Id, label: item.Name };
      });
      return cityData;
    } else {
      console.log("Failed to fetch cities");
    }
  } catch (error) {
    console.log(`error while fetching City: ${error}`);
  }
};
