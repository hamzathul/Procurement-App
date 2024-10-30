import React, { useState } from 'react'
import axios from 'axios'

const Supplier = () => {
    const [formData, setFormData] = useState({
      supplierName: "",
      address: "",
      taxNo: "",
      country: "USA",
      mobileNo: "",
      email: "",
      status: "Active",
    });

     const handleChange = (e) => {
       const { name, value } = e.target;
       setFormData({
         ...formData,
         [name]: value,
       });
     };

      const handleSubmit = (e) => {
        e.preventDefault();
        axios
          .post("http://localhost:5000/suppliers", formData)
          .then((response) => {
            alert("Supplier added successfully");
            setFormData({
              supplierName: "",
              address: "",
              taxNo: "",
              country: "USA",
              mobileNo: "",
              email: "",
              status: "Active",
            });
          })
          .catch((error) => {
            alert("Error adding supplier");
          });
      };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center underline">Add Supplier</h2>

      <div className="mb-4">
        <label className="block mb-1">Supplier Name</label>
        <input
          type="text"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">TAX No</label>
        <input
          type="text"
          name="taxNo"
          value={formData.taxNo}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Country</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        >
          <option value="USA">USA</option>
          <option value="India">India</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Mobile No</label>
        <input
          type="text"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Add Supplier
      </button>
    </form>
  );
}

export default Supplier