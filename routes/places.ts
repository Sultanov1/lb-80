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

  if (!placeName) {
    return res.status(404).send({error: 'place cannot be empty!'});
  }
})

placeRouter.delete('/:id', async (req, res) => {
  try {
    const placeId = req.params.id;

    const placeItems = await fileDb.getPlace(placeId);
    const places = await fileDb.getPlaces();
    const place = places.find(c => c.id === req.params.id);

    if (!place || !placeItems) {
      return res.status(404).send({error: 'Not found!'});
    }

    const deletePlace = await fileDb.deletePlace(placeId);
    res.send(deletePlace);
  } catch (e) {
    console.error(e);
    res.status(404).send({error: 'Not found!'});
  }
});

placeRouter.put('/:id', async (req, res) => {
  const placeId = req.params.id;
  const newData = req.body;

  try {
    const updatePlace = await fileDb.updatePlace(placeId, newData);

    if (!updatePlace) {
      return res.status(404).send({error: 'Not found!'});
    }

    res.send(updatePlace);
  } catch (e) {
    console.error(e);
    res.status(404).send({error: 'Not found!'});
  }
})

export default placeRouter;