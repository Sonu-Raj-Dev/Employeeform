import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

function Dropdown({
  id,
  data,
  onChange,
  value,
  isMulti = false,
  placeholder = "",
  name = "dropdown",
}) {
  const animatedComponents = makeAnimated();

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  return (
    <div>
      <Select
        id={id}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={data}
        onChange={onChange}
        // defaultValue={}
        name={name}
        value={value}
        isMulti={isMulti}
        className="h-9 rounded-lg w-[100%] "
        placeholder={placeholder}
        menuPortalTarget={document.body} // Render dropdown in the body
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensure it's above the modal
        }}
      />
    </div>
  );
}

export default Dropdown;
