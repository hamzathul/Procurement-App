import React, { useState, useEffect } from "react";
import axios from "axios";

const Purchase = () => {
  const [formData, setFormData] = useState({
    supplier: "",
    items: [
      {
        item: "",
        orderQty: 0,
        packingUnit: "",
        unitPrice: 0,
        itemAmount: 0,
        discount: 0,
        netAmount: 0,
      },
    ],
    itemTotal: 0,
    discountTotal: 0,
    netAmount: 0,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/suppliers?status=Active")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error fetching suppliers:", error));

    axios
      .get("http://localhost:5000/items")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;

    if (name === "orderQty" || name === "discount") {
      const item = items.find((i) => i._id === updatedItems[index].item);
      if (item) {
        updatedItems[index].unitPrice = item.unitPrice;
        const itemAmount = updatedItems[index].orderQty * item.unitPrice;
        const discount = updatedItems[index].discount || 0;
        const netAmount = itemAmount - discount;

        updatedItems[index].itemAmount = itemAmount;
        updatedItems[index].netAmount = netAmount;
      }
    }

    const itemTotal = updatedItems.reduce(
      (total, item) => total + item.itemAmount,
      0
    );
    const discountTotal = updatedItems.reduce(
      (total, item) => total + item.discount,
      0
    );
    const netAmount = itemTotal - discountTotal;

    setFormData({
      ...formData,
      items: updatedItems,
      itemTotal,
      discountTotal,
      netAmount,
    });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          item: "",
          orderQty: 0,
          packingUnit: "",
          unitPrice: 0,
          itemAmount: 0,
          discount: 0,
          netAmount: 0,
        },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/purchase-orders", formData)
      .then((response) => alert("Purchase Order created successfully"))
      .catch((error) => alert("Error creating purchase order"));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Purchase Order</h2>

      <div className="mb-4">
        <label className="block mb-1">Supplier</label>
        <select
          name="supplier"
          value={formData.supplier}
          onChange={(e) =>
            setFormData({ ...formData, supplier: e.target.value })
          }
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

      <h3 className="text-xl font-bold mb-2">Items</h3>
      {formData.items.map((item, index) => (
        <div key={index} className="grid grid-cols-6 gap-4 mb-4">
          <select
            name="item"
            value={item.item}
            onChange={(e) => handleItemChange(index, e)}
            className="col-span-1 border p-2 rounded-md"
          >
            <option value="">Select an item</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.itemName}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="orderQty"
            value={item.orderQty}
            onChange={(e) => handleItemChange(index, e)}
            placeholder="Qty"
            className="col-span-1 border p-2 rounded-md"
          />

          <input
            type="text"
            name="packingUnit"
            value={item.packingUnit}
            onChange={(e) => handleItemChange(index, e)}
            placeholder="Packing Unit"
            className="col-span-1 border p-2 rounded-md"
          />

          <input
            type="number"
            name="unitPrice"
            value={item.unitPrice}
            readOnly
            className="col-span-1 border p-2 rounded-md"
          />

          <input
            type="number"
            name="discount"
            value={item.discount}
            onChange={(e) => handleItemChange(index, e)}
            placeholder="Discount"
            className="col-span-1 border p-2 rounded-md"
          />

          <input
            type="number"
            name="netAmount"
            value={item.netAmount}
            readOnly
            className="col-span-1 border p-2 rounded-md"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItemRow}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Add Item
      </button>

      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span>Item Total:</span>
          <span>{formData.itemTotal}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Discount Total:</span>
          <span>{formData.discountTotal}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Net Amount:</span>
          <span>{formData.netAmount}</span>
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded-md mt-4"
      >
        Submit Purchase Order
      </button>
    </form>
  );
};

export default Purchase;
