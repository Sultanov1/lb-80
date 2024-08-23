import {Router} from 'express';
import fileDb from '../fileDb';
import {CategoryMutation} from '../types';

const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
  const categories = await fileDb.getCategories();

  res.send(categories)
});

categoriesRouter.get('/:id', async (req, res) => {
  const categories = await fileDb.getCategories();
  const category = categories.find(c => c.id === req.params.id);

  if (!category) {
    return res.status(404).send({error: 'Category not found'});
  }
});

categoriesRouter.post('/', async (req, res) => {
  const {categoryName, categoryDescription} = req.body

  const newCategory: CategoryMutation = {
    categoryName: categoryName,
    categoryDescription: categoryDescription,
  };

  try {
    const saveCategory = await fileDb.addCategory(newCategory);
    res.send(saveCategory);
  } catch (e) {
    console.error(e);
    res.status(404).send({error: 'Category not found'});
  }

  if (!categoryName) {
    return res.status(404).send({error: 'Categories cannot be empty'});
  }
})

categoriesRouter.delete('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const categoryItems = await fileDb.getCategory(categoryId);
    const categories = await fileDb.getCategories();
    const category = categories.find(c => c.id === req.params.id);

    if (!category || !categoryItems) {
      return res.status(404).send({error: 'Category not found'});
    }

    const deleteCategory = await fileDb.deleteCategory(categoryId);
    res.send(deleteCategory);
  } catch (e) {
    console.error(e);
    res.status(500).send({error: 'Internal Server Error'});
  }
});

categoriesRouter.put('/:id', async (req, res) => {
  const categoryId = req.params.id;
  const newData = req.body;

  try {
    const updatedCategory = await fileDb.updateCategory(categoryId, newData);

    if (!updatedCategory) {
      return res.status(404).send({error: 'Category not found'});
    }

   res.send(updatedCategory);
  } catch (e) {
    console.error(e);
    res.status(404).send({error: 'Category not found'});
  }
})

export default categoriesRouter;