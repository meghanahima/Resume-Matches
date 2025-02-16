import { cn } from "../utils/classConditionalJoin";
import React, { useState } from "react";

function Button({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ label, type = "text", className, ...props }) {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          type={type}
          className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...props}
        />
      </div>
    );
}  

function Switch({ checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
          checked ? "bg-green-500" : ""
        }`}
      >
        <span
          className={`w-4 h-4 bg-white rounded-full shadow-md transform ${
            checked ? "translate-x-5" : "translate-x-0"
          } transition`}
        ></span>
      </span>
    </label>
  );
}

function Textarea({ label, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <textarea
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      ></textarea>
    </div>
  );
}

export {Textarea, Switch, Input, Button};