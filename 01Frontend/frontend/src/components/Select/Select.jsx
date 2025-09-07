import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { IoMdArrowDropdown } from "react-icons/io";

import Logo from "../../assets/logoix.png";

function Select() {
  const [formData, setFormData] = useState({
    jobRole: "",
    domain: "",
    mode: "",
  });

  const navigate = useNavigate();

  const jobRoles = [
    "Software Engineer",
    "Data Scientist",
    "DevOps Engineer",
    "Full Stack Developer",
    "AI/ML Engineer",
  ];

  const domains = [
    "Web Development",
    "Data Science",
    "Artificial Intelligence",
    "Machine Learning",
    "Cloud Computing",
  ];

  const modes = ["Technical", "Behavioral"];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Data:", formData);
    navigate("/interview", { state: formData });
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 ">
        <h2 className="text-3xl font-bold text-gray-700 pb-22">
          Pick Your Challenge
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl" 
        >
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Dropdown
              label="Job Role"
              options={jobRoles}
              value={formData.jobRole}
              onChange={(value) => setFormData({ ...formData, jobRole: value })}
            />
            <Dropdown
              label="Domain"
              options={domains}
              value={formData.domain}
              onChange={(value) => setFormData({ ...formData, domain: value })}
            />
            <Dropdown
              label="Mode"
              options={modes}
              value={formData.mode}
              onChange={(value) => setFormData({ ...formData, mode: value })}
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Start Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="w-full relative">
      <Listbox value={value} onChange={onChange}>
        <Listbox.Label className="block text-sm font-medium mb-1">
          {label}
        </Listbox.Label>
        <div className="relative">
          <Listbox.Button className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center">
            <span>{value || `Select ${label}`}</span>
            <IoMdArrowDropdown className="h-5 w-5 text-gray-500" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            
            <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  value={option}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                >
                  {option}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default Select;