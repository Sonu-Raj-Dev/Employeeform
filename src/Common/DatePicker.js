import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DatePickerComponent({
  id,
  value,
  onChange,
  placeholder = "",
  name = "datepicker",
  minDate = null,
  disabled = false,
  maxDate = null,
}) {
  return (
    <div className="h-10 border-2  rounded-md">
      <DatePicker
        id={id}
        showIcon
        calendarClassName="rasta-stripes"
        selected={value}
        onChange={onChange}
        className="h-9 border-0  rounded-md w-[100%]"
        placeholderText={placeholder}
        name={name}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        popperClassName="!z-[9999]" // Increase z-index for calendar popup
        portalId="root"      
      />
    </div>
  );
}

export default DatePickerComponent;
