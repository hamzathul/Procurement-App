import React, { useEffect, useState } from "react";
import axios from "axios";

const Item = () => {
      const [formData, setFormData] = useState({
        itemName: "",
        inventoryLocation: "",
        brand: "",
        category: "",
        supplier: "",
        stockUnit: "",
        unitPrice: "",
        status: "Enabled", // default status
        itemImages: [], // for handling multiple image uploads
      });

      const [suppliers, setSuppliers] = useState([]);
      const [categories, setCategories] = useState([
        "Electronics",
        "Furniture",
        "Clothing",
      ]);
      const [stockUnits, setStockUnits] = useState(["Piece", "Box", "Kg"]);

      useEffect(() => {
        axios
          .get("http://localhost:5000/suppliers?status=Active")
          .then((response) => {
            setSuppliers(response.data);
          })
          .catch((error) => {
            console.error("Error fetching suppliers", error);
          });
      }, []);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

      const handleFileChange = (e) => {
        setFormData({
          ...formData,
          itemImages: e.target.files,
        });
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        // Use FormData to handle file uploads
        const formDataObj = new FormData();
        formDataObj.append("itemName", formData.itemName);
        formDataObj.append("inventoryLocation", formData.inventoryLocation);
        formDataObj.append("brand", formData.brand);
        formDataObj.append("category", formData.category);
        formDataObj.append("supplier", formData.supplier);
        formDataObj.append("stockUnit", formData.stockUnit);
        formDataObj.append("unitPrice", formData.unitPrice);
        formDataObj.append("status", formData.status);

        // Append each selected file to FormData
        for (let i = 0; i < formData.itemImages.length; i++) {
          formDataObj.append("itemImages", formData.itemImages[i]);
        }

        axios
          .post("http://localhost:5000/items", formDataObj, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            alert("Item added successfully");
            setFormData({
              itemName: "",
              inventoryLocation: "",
              brand: "",
              category: "",
              supplier: "",
              stockUnit: "",
              unitPrice: "",
              status: "Enabled",
              itemImages: [],
            });
          })
          .catch((error) => {
            alert("Error adding item");
          });
      };

        
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Item</h2>

      <div className="mb-4">
        <label className="block mb-1">Item Name</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Inventory Location</label>
        <input
          type="text"
          name="inventoryLocation"
          value={formData.inventoryLocation}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Supplier</label>
        <select
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Select a supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier._id}>
              {supplier.supplierName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Stock Unit</label>
        <select
          name="stockUnit"
          value={formData.stockUnit}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        >
          <option value="">Select a unit</option>
          {stockUnits.map((unit, index) => (
            <option key={index} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Unit Price</label>
        <input
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Item Images</label>
        <input
          type="file"
          name="itemImages"
          multiple
          onChange={handleFileChange}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        >
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Add Item
      </button>
    </form>
  );
};

export default Item;
