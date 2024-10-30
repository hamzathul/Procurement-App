import React, { useEffect, useState } from "react";
import axios from "axios";

const Item = () => {
      const [formData, setFormData] = useState({
        itemName: "",
        inventoryLocation: "",
        brand: "",
        supplier: "",
        unitPrice: "",
      });

       const [suppliers, setSuppliers] = useState([]);

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

        const handleSubmit = (e) => {
          e.preventDefault();
          axios
            .post("http://localhost:5000/items", formData)
            .then((response) => {
              alert("Item added successfully");
              setFormData({
                itemName: "",
                inventoryLocation: "",
                brand: "",
                supplier: "",
                unitPrice: "",
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
        <label className="block mb-1">Unit Price</label>
        <input
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          className="w-full border p-2 rounded-md"
        />
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
