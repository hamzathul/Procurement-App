import Item from "../models/item.model.js";

export const createItem = async (req, res) => {
  try {
     const {
       itemName,
       inventoryLocation,
       brand,
       category,
       supplier,
       stockUnit,
       unitPrice,
       status,
     } = req.body;

     // Get uploaded image paths from Multer
     const itemImages = req.files.map((file) => file.path);

     const newItem = new Item({
       itemName,
       inventoryLocation,
       brand,
       category,
       supplier,
       stockUnit,
       unitPrice,
       itemImages,
       status,
     });

     const savedItem = await newItem.save();
     res.status(201).json(savedItem);
  } catch (error) {
    console.log("Error in createItem controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("supplier");
    res.json(items);
  } catch (error) {
    console.log("Error in getItems controller:", error.message);
    res.status(400).json({ error: error.message });
  }
};
