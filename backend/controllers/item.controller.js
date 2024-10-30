import Item from "../models/item.model.js";

export const createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
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
