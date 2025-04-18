"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: "",
    amountToRaise: "",
    reason: "",
    equity: "",
    sector: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate project name
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    // Validate amount to raise
    if (!formData.amountToRaise) {
      newErrors.amountToRaise = "Amount is required";
    } else if (isNaN(formData.amountToRaise) || Number.parseFloat(formData.amountToRaise) <= 0) {
      newErrors.amountToRaise = "Amount must be a positive number";
    }

    // Validate reason
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    // Validate equity percentage
    if (!formData.equityPercentage) {
      newErrors.equityPercentage = "Equity percentage is required";
    } else if (
      isNaN(formData.equityPercentage) ||
      Number.parseFloat(formData.equityPercentage) <= 0 ||
      Number.parseFloat(formData.equityPercentage) > 100
    ) {
      newErrors.equityPercentage = "Equity must be between 0 and 100";
    }

    // Validate sector
    if (!formData.sector.trim()) {
      newErrors.sector = "Sector is required";
    }

    // Validate dates
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      } else if (diffDays > 5) {
        newErrors.endDate = "End date must be within 5 days of start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const startupId = localStorage.getItem("startupId");

      if (!startupId) {
        alert("Startup ID not found. Please log in again.");
        return;
      }

      const proposalData = {
        projectName: formData.projectName,
        amountToRaise: parseFloat(formData.amountToRaise),
        reason: formData.reason,
        equityPercentage: parseFloat(formData.equityPercentage),
        sector: formData.sector,
        startDate: new Date(formData.startDate).toISOString(), // ISO format
        endDate: new Date(formData.endDate).toISOString(),
      };
      

      try {
        const response = await axios.post(
          `${API_BASE_URL}/startup/add-proposal/${startupId}`,
          proposalData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Proposal submitted:", response.data);
        navigate("/startup");
      } catch (error) {
        console.error("Error submitting proposal:", error);
        alert("Failed to submit proposal. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Project</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.projectName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-500">{errors.projectName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="amountToRaise"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount to Raise (ETH)
              </label>
              <input
                type="number"
                id="amountToRaise"
                name="amountToRaise"
                value={formData.amountToRaise}
                onChange={handleChange}
                step="0.01"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.amountToRaise ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.amountToRaise && (
                <p className="mt-1 text-sm text-red-500">{errors.amountToRaise}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="equityPercentage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Equity Percentage (%)
              </label>
              <input
                type="number"
                id="equityPercentage"
                name="equityPercentage"
                value={formData.equityPercentage}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="100"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.equityPercentage ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.equityPercentage && (
                <p className="mt-1 text-sm text-red-500">{errors.equityPercentage}</p>
              )}
            </div>

            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                Sector
              </label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.sector ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a sector</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
              {errors.sector && <p className="mt-1 text-sm text-red-500">{errors.sector}</p>}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date (within 5 days of start)
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
            </div>

            <div className="col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Fundraising
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.reason ? "border-red-500" : "border-gray-300"
                }`}
              ></textarea>
              {errors.reason && <p className="mt-1 text-sm text-red-500">{errors.reason}</p>}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
            >
              Submit Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProject;
