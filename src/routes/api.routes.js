const express = require('express');

const {
  onGetAllVehiclesByGroupId,
  onGetPlaceGroup,
  onGetVehiclesGroups,
  onGetAlertVehicles,
  onGetTrajetCimencam,
  onGetAllTrajets,
  onGetEntryExitNotificationsTest,
  onGetTrajetVehicle,
  onGetAllTrajetCimencam,
  onGetTrajetVehicleByStarttime,
  onGetAllTrajetByStarttime,
  trajetsTest,
  onGetAllNotifTest,
} = require('../controllers/api.controllers');

const trajetRouter = express.Router();

trajetRouter.get('/place_groups', onGetPlaceGroup);

trajetRouter.get('/vehicles_in_group', onGetAllVehiclesByGroupId);

trajetRouter.get('/vehicles_groups', onGetVehiclesGroups);

trajetRouter.get('/alerts_vehicle', onGetAlertVehicles);

trajetRouter.get('/trajetcimencam', onGetAllTrajetCimencam);

trajetRouter.post(
  '/TrajetsByVehicleAndStartDate',
  onGetTrajetVehicleByStarttime
);

trajetRouter.post('/TrajetsByStartDate', onGetAllTrajetByStarttime);

trajetRouter.post('/TrajetsByVehicle', onGetTrajetVehicle);

trajetRouter.get('/test', trajetsTest);

trajetRouter.get('/notitest', onGetEntryExitNotificationsTest);

trajetRouter.get('/allNotifTest', onGetAllNotifTest);

module.exports = trajetRouter;
