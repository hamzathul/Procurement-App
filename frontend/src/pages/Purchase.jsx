import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver"; // For saving the Excel file
import { useReactToPrint } from "react-to-print"; // For printing

const Purchase = () => {
  const [formData, setFormData] = useState({
    orderNo: "", // Auto-generated order number
    supplier: "",
    itemTotal: 0,
    discountTotal: 0,
    netAmount: 0,
    orderDate: new Date().toISOString().slice(0, 10),
    items: [
      {
        itemNo: "",
        itemName: "",
        stockUnit: "",
        unitPrice: 0,
        packingUnit: "",
        orderQty: 0,
        itemAmount: 0,
        discount: 0,
        netAmount: 0,
      },
    ],
  });

  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch suppliers and active items
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/suppliers?status=Active"
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchSuppliers();
    fetchItems();
  }, []);

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const updatedItems = [...formData.items];

    if (name === "itemNo") {
      const selectedItem = items.find((item) => item._id === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemName: selectedItem.itemName,
          unitPrice: selectedItem.unitPrice,
          stockUnit: selectedItem.stockUnit,
          packingUnit: selectedItem.packingUnit || "", // Default to empty if not available
          orderQty: updatedItems[index].orderQty,
          itemAmount: updatedItems[index].orderQty * selectedItem.unitPrice,
          netAmount:
            updatedItems[index].orderQty * selectedItem.unitPrice -
            updatedItems[index].discount,
        };
      }
    } else {
      updatedItems[index][name] = value;

      if (name === "orderQty") {
        updatedItems[index].itemAmount = value * updatedItems[index].unitPrice;
      }

      if (name === "discount") {
        updatedItems[index].netAmount =
          updatedItems[index].itemAmount - parseFloat(value || 0);
      }
    }

    setFormData((prevData) => ({ ...prevData, items: updatedItems }));
    updateTotals(updatedItems);
  };

  const updateTotals = (itemsList) => {
    const itemTotal = itemsList.reduce(
      (sum, item) => sum + parseFloat(item.itemAmount || 0),
      0
    );
    const discountTotal = itemsList.reduce(
      (sum, item) => sum + parseFloat(item.discount || 0),
      0
    );

    setFormData((prevData) => ({
      ...prevData,
      itemTotal,
      discountTotal,
      netAmount: itemTotal - discountTotal,
    }));
  };

  const addItemRow = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          itemNo: "",
          itemName: "",
          stockUnit: "",
          unitPrice: 0,
          packingUnit: "",
          orderQty: 0,
          itemAmount: 0,
          discount: 0,
          netAmount: 0,
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate auto-order number (for demonstration)
    const newOrderNo = `PO-${Math.floor(Math.random() * 10000)}`;

    try {
      await axios.post("http://localhost:5000/purchase-orders", {
        ...formData,
        orderNo: newOrderNo,
      });
      alert("Purchase Order created successfully");

      // Reset form after submission
      setFormData({
        orderNo: "",
        supplier: "",
        itemTotal: 0,
        discountTotal: 0,
        netAmount: 0,
        orderDate: new Date().toISOString().slice(0, 10),
        items: [
          {
            itemNo: "",
            itemName: "",
            stockUnit: "",
            unitPrice: 0,
            packingUnit: "",
            orderQty: 0,
            itemAmount: 0,
            discount: 0,
            netAmount: 0,
          },
        ],
      });
    } catch (error) {
      alert("Error creating purchase order");
      console.error(error);
    }
  };

  // Export to Excel
  const handleExportToExcel = () => {
    const fileName = `PurchaseOrder_${formData.orderDate}.xls`;

    const data = formData.items.map((item) => ({
      ItemNo: item.itemNo,
      ItemName: item.itemName,
      StockUnit: item.stockUnit,
      UnitPrice: item.unitPrice.toFixed(2),
      PackingUnit: item.packingUnit || "", // Ensure it's not undefined
      OrderQty: item.orderQty,
      ItemAmount: item.itemAmount.toFixed(2),
      Discount: item.discount.toFixed(2),
      NetAmount: item.netAmount.toFixed(2),
    }));

    const blob = new Blob([JSON.stringify(data)], {
      type: "application/vnd.ms-excel",
    });

    saveAs(blob, fileName);
  };

  // Print functionality
  const printRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Purchase Order ${formData.orderDate}`,
    onAfterPrint() {
      alert("Print job sent to printer.");
    },
  });

  return (
    <div ref={printRef} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Purchase Order</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Supplier Name</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={(e) =>
              setFormData({ ...formData, supplier: e.target.value })
            }
            className="w-full border p-2 rounded-md"
            required
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
          <label className="block mb-1">Order Date</label>
          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={(e) =>
              setFormData({ ...formData, orderDate: e.target.value })
            }
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <h3 className="text-xl font-semibold mt-4 mb-2">Order Items</h3>

        {formData.items.map((item, index) => (
          <div key={index} className="mb-4 border p-4 rounded-md">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Item No</label>
                <select
                  name="itemNo"
                  value={item.itemNo}
                  onChange={(e) => handleItemChange(index, e)}
                  className="w-full border p-2 rounded-md"
                  required
                >
                  <option value="">Select Item</option>
                  {items.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.itemNo} - {i.itemName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Order Qty</label>
                <input
                  type="number"
                  name="orderQty"
                  value={item.orderQty}
                  onChange={(e) => handleItemChange(index, e)}
                  min="1"
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Packing Unit</label>
                <input
                  type="text"
                  name="packingUnit"
                  value={item.packingUnit}
                  readOnly
                  className="w-full border p-2 rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1">Stock Unit</label>
                <input
                  type="text"
                  name="stockUnit"
                  value={item.stockUnit}
                  readOnly
                  className="w-full border p-2 rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1">Unit Price</label>
                <input
                  type="text"
                  name="unitPrice"
                  value={item.unitPrice.toFixed(2)}
                  readOnly
                  className="w-full border p-2 rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={item.discount}
                  onChange={(e) => handleItemChange(index, e)}
                  min="0"
                  className="w-full border p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1">Net Amount</label>
                <input
                  type="text"
                  name="netAmount"
                  value={item.netAmount.toFixed(2)}
                  readOnly
                  className="w-full border p-2 rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItemRow}
          className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
        >
          Add Item
        </button>

        {/* Totals */}
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span>Item Total:</span>
            <span>{formData.itemTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Discount:</span>
            <span>{formData.discountTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 font-semibold">
            <span>Net Amount:</span>
            <span>{formData.netAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md mr-4"
        >
          Create Purchase Order
        </button>

        <button
          type="button"
          onClick={handleExportToExcel}
          className="bg-yellow-500 text-white py-2 px-4 rounded-md mr-4"
        >
          Export to Excel
        </button>

        {/* Print Button */}
        <button
          type="button"
          onClick={() => {
            if (!formData.items.length || !formData.supplier) {
              alert("Please fill in all required fields before printing.");
              return;
            }
            handlePrint();
          }}
          className="bg-purple-500 text-white py-2 px-4 rounded-md"
        >
          Print
        </button>
      </form>
    </div>
  );
};

export default Purchase;
