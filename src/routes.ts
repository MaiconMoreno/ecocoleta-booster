import express, { request, response } from 'express';


import PointsController from './controllers/PointsControllers';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const itemsController = new ItemsController();
const pointsController = new PointsController();

// items
routes.get('/items', itemsController.index);

// points 
routes.get('/points/:id', pointsController.show);

routes.get('/points', pointsController.index);

routes.post('/points', pointsController.create);

/*
    Padrões da comunidade para nomeação das classes 

    .index   // retornar items filtrados
    .show    // retornar um unico item
    .create
    .update
    .delete
*/


export default routes;
