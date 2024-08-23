import {Router} from 'express';
import fileDb from '../fileDb';
import {PlaceMutation} from '../types';

const placeRouter = Router();

placeRouter.get('/', async (req, res) => {
  const places = await fileDb.getPlaces();

  res.send(places);
})

placeRouter.get('/:id', async (req, res) => {
  const places = await fileDb.getPlaces();
  const place = places.find(c => c.id === req.params.id);

  if (!place) {
    return res.status(404).send({error: 'Not found!'});
  }

  res.send(place);
})

placeRouter.post('/', async (req, res) => {
  const {placeName, placeDescription} = req.body

  const newPlace: PlaceMutation = {
    placeName: placeName,
    placeDescription: placeDescription,
  }

  try {
    const savePlaces = await fileDb.addPlace(newPlace);
    res.send(savePlaces);
  } catch (e) {
    console.error(e);
    res.status(404).send({error: 'Not found!'});
  }

  if(!placeName) {
    return res.status(404).send({error: 'place cannot be empty!'});
  }
})

export default placeRouter;