const express = require('express');

const {onGetAllVehiclesByGroupId,onGetPlaceGroup,onGetVehiclesGroups,onGetAlertVehicles,onGetTrajetCimencam,onGetAllTrajets,onGetTrajetVehicle ,onGetAllTrajetCimencam,onGetTrajetVehicleByStarttime,onGetAllTrajetByStarttime}= require('../controllers/api.controllers')

const trajetRouter = express.Router();


trajetRouter.get('/place_groups',onGetPlaceGroup);

trajetRouter.get('/vehicles_in_group',onGetAllVehiclesByGroupId);

trajetRouter.get('/vehicles_groups',onGetVehiclesGroups);


trajetRouter.get('/alerts_vehicle',onGetAlertVehicles);


trajetRouter.get('/trajetcimencam',onGetAllTrajetCimencam);


trajetRouter.post('/TrajetsByVehicleAndStartDate',onGetTrajetVehicleByStarttime);


trajetRouter.post('/TrajetsByStartDate',onGetAllTrajetByStarttime);


trajetRouter.post('/TrajetsByVehicle',onGetTrajetVehicle);

module.exports= trajetRouter