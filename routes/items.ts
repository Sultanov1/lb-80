import { Router } from "express";
import fileDb from "../fileDb";
import { ItemMutation } from '../types';

const itemsRouter = Router();

itemsRouter.get('/', async (req, res) => {
  try {
    const items = await fileDb.getItems();
    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

itemsRouter.get('/:id', async (req, res) => {
  try {
    const items = await fileDb.getItems();
    const item = items.find(m => m.id === req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

itemsRouter.post('/',  async (req, res) => {
  const { itemsName, itemsDescription, categoryId, placesId} = req.body;
  const image = req.file ? req.file.filename : '';

  const newItem: ItemMutation = {
    itemsName,
    itemsDescription,
    categoryId,
    placesId,
    image,
  };

  try {
    const savedItem = await fileDb.addItem(newItem);
    res.send(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  if (!itemsName || !itemsDescription || !categoryId || !placesId || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

});

export default itemsRouter;
