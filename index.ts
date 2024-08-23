import express from "express";
import cors from "cors";
import fileDb from './fileDb';
import categoriesRouter from './routes/categories';
import itemsRouter from './routes/items';
import placeRouter from './routes/places';
import config from './config';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors(config.corsOptions));

app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);
app.use('/places', placeRouter);

const run = async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  })
};

run().catch(console.error);