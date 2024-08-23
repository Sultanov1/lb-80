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

export default categoriesRouter;