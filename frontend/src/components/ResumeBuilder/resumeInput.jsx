import React,{ useRef } from "react";

const ResumeInput = ({
    value,
    onChange,
    placeholder,
    multiline = false,
    className = "",
    type = "text",
    disabled = false,
  }) => {
    const inputRef = useRef(null);
  
    const baseClasses = `
      w-full 
      border-b 
      border-transparent hover:border-gray-300 
      focus:border-blue-500 
      transition-colors
      bg-transparent
      focus:outline-none
      focus:ring-0
      px-2 
      py-1 
      rounded
      ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-text"}
      ${className}
    `;
  
    if (multiline) {
      return (
        <textarea
          ref={inputRef}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClasses} resize-none min-h-[100px]`}
          rows={4}
        />
      );
    }
  
    return (
      <input
        ref={inputRef}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={baseClasses}
      />
    );
  };
  export default ResumeInput;