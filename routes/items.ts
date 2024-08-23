import {Router} from 'express';
import fileDb from '../fileDb';
import {ItemMutation} from '../types';
import {imagesUpload} from '../multer';

const itemsRouter = Router();

itemsRouter.get('/', async (req, res) => {
  try {
    const items = await fileDb.getItems();
    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

itemsRouter.get('/:id', async (req, res) => {
  try {
    const items = await fileDb.getItems();
    const item = items.find(m => m.id === req.params.id);

    if (!item) {
      return res.status(404).json({error: 'Item not found'});
    }

    res.send(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  const {itemsName, itemsDescription, categoryId, placesId} = req.body;
  const image = req.file ? req.file.filename : '';

  if (!itemsName || !categoryId || !placesId) {
    return res.status(400).json({ error: 'Item cannot be empty' });
  }

  try {
    const category = await fileDb.getCategory(categoryId);
    const places = await fileDb.getPlace(placesId);

    if (!category || !places) {
      return res.status(404).json({error: 'Category cannot be empty'});
    }

    const newItem: ItemMutation = {
      itemsName: itemsName,
      itemsDescription: itemsDescription,
      categoryId: categoryId,
      placesId: placesId,
      image: image
    };

    const saveItem = await fileDb.addItem(newItem);
    res.send(saveItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

itemsRouter.delete('/:id', async (req, res) => {
  try {
    const items = await fileDb.getItems();
    const item = items.find(m => m.id === req.params.id);

    if (!item) {
      return res.status(404).send({error: 'Item not found'})
    }

    const deleteItem = await fileDb.deleteItem(req.params.id);
    res.send(deleteItem)
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

itemsRouter.put('/:id', async (req, res) => {
  const itemId = req.params.id;
  const newData = req.body;

  try {
    const updatedItem = await fileDb.updateItem(itemId, newData);

    if (!updatedItem) {
      return res.status(404).send({error: 'Item not found'});
    }

    res.send(updatedItem);
  } catch (e) {
    console.error(e);
    res.status(404).json({error: 'Item not found'});
  }
})

export default itemsRouter;
