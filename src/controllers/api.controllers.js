const {
  getAllVehiclesByGroupId,
  getLandPointCimencam,
  getPlaceGroup,
  getVehiclesGroups,
  alertVhicles,
  getAllVehicles,
  getEntryExitData,
} = require('../services/service');
const {
  POINT_CHARGEMENT_CIMENCAM,
  ALL_VEHICLE,
  PAGES,
  GEOFENCE,
} = require('../constants/constant');
const {
  insertNotifications,
  getNotificationsOrderByVehicleID,
  insertTrajet,
  getAllTrajets,
  getTrajetsByVehicleIdStartTimeEndTime,
  getTrajetsByStartTimeEndTime,
  getTrajetsByVehicleId,
} = require('../models/model');
const { chunk } = require('../utils/basichuncks');
const { getFistAndLastHourDay } = require('../utils/getfirstlasthourday');
const { dateInYyyyMmDdHhMmSs2 } = require('../utils/formatdate');
const _ = require('lodash');

async function onGetAllVehiclesByGroupId(req, res) {
  const vehiclesByGroupId = getAllVehiclesByGroupId();
  return res.status(200).json(vehiclesByGroupId);
}

async function onGetPlaceGroup(req, res) {
  return res.status(200).json(await getPlaceGroup());
}

async function onGetVehiclesGroups(req, res) {
  const vehiclesGroups = getVehiclesGroups();
  return res.status(200).json(vehiclesGroups);
}

async function onGetAlertVehicles(req, res) {
  try {
    const allVehicles = await getAllVehicles();
    if (allVehicles) {
      const alert = allVehicles.map(async (item) => {
        const vehicleId = item.Id;
        const alertVehicle = await alertVhicles(vehicleId);
        if (alertVehicle) {
          return alertVehicle;
        }
      });
      return res.status(200).json(alert);
    }
  } catch (error) {
    console.error('error of: ', error);
    return res.status(500).send('Post received, but we have an error!');
  }
}

// get all notif entry Exit cimencam and strore in database
async function onGetEntryExitNotifications() {
  const date = getFistAndLastHourDay();

  try {
    const notifEntryExitCimencam = [];

    const vehiclegroups = await getVehiclesGroups();

    if (vehiclegroups) {
      //Extract All vehicle Group Id
      const AllVehicleGroupId = vehiclegroups.filter(
        (item) => item.Description === ALL_VEHICLE
      )[0].Id;

      //all EntryNotifications
      const newData = await getEntryExitData(
        AllVehicleGroupId,
        1000,
        0,
        date.firstHourDayFormat,
        date.lasthourDayFormat
      );

      if (newData) {
        const pages = newData.TotalResults / newData.PageSize;
        const arr = Array.apply(null, { length: pages + 2 }).map(
          Number.call,
          Number
        );

        const allNotifications = await Promise.all(
          arr.map(async (item) => {
            const data = await getEntryExitData(
              AllVehicleGroupId,
              1000,
              item,
              date.firstHourDayFormat,
              date.lasthourDayFormat
            );
            if (data) {
              data.Items.map((it) => {
                if (it) {
                  notifEntryExitCimencam.push(it);
                  insertNotifications(
                    it.PlaceDescription,
                    it.VehicleId,
                    it.DriverId,
                    it.PlaceEntryLocalTimestamp,
                    it.PlaceExitLocalTimestamp
                  );
                  //console.log(notifEntryExitCimencam.length);
                }
              });
            }
          })
        );

        /*   if (allNotifications) {
                    notifEntryExitCimencam.map(item => insertNotifications(item.PlaceDescription, item.VehicleId, item.DriverId, item.PlaceEntryLocalTimestamp, item.PlaceExitLocalTimestamp));
              } 
     */
      }
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

//Get all trajet
async function onGetAllTrajets(req, res) {
  const trajets = [];
  try {
    const result = await getNotificationsOrderByVehicleID();
    if (result) {
      //Group notifications By VehicleID
      const groupNotifByVehicleId = _.groupBy(result, (resu) => resu.vehicleid);

      //change objects to arr and remove key
      const arrData = Object.keys(groupNotifByVehicleId).map((key) => {
        return Object.values(groupNotifByVehicleId[[key]]);
      });

      //sort notif by exit time
      const sortByEntryTime = arrData.map((item) => {
        return item.sort((a, b) => {
          const dateA = new Date(b['entrytime']);
          const dateB = new Date(a['entrytime']);

          return dateB.getTime() - dateA.getTime();
        });
      });

      //Create chunks of notifications by vehicle id
      const chunks = sortByEntryTime.map((item) => {
        return chunk(item, 2);
      });

      //creates trajet cimecam
      const Arrtrajet = chunks.map((item) => {
        return item.map((it) => {
          if (it.length > 1) {
            var trajet = {
              vehicleid: it[0].vehicleid,
              id: it[0].id + it[1].id,
              depart: it[0].placedescription,
              heureDepart: it[0].exittime,
              arriver: it[1].placedescription,
              heureDarriver: it[1].entrytime,
            };
            return trajet;
          } else {
            return {
              vehicleid: it[0].vehicleid,
              id: it[0].id,
              arriver: it[0].placedescription,
              heureDarriver: it[0].entrytime,
              depart: it[0].placedescription,
              heureDepart: it[0].exittime,
            };
          }
        });
      });

      if (Arrtrajet && chunks) {
        const obj = Arrtrajet.map((item) => {
          return item.map((it) => {
            trajets.push(it);
          });
        });
        if (obj) {
          //return res.status(200).json(chunks)
          return trajets;
        }
      }
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

//Get trajet cimencam and transporteur
async function onGetTrajetCimencam() {
  const getAllTrajets = await onGetAllTrajets();

  //get placesGroup
  const placeGoup = await getPlaceGroup();
  const vehiclegroups = await getVehiclesGroups();

  if (placeGoup && vehiclegroups && getAllTrajets) {
    //Extract point de chargement group Id
    const pointChargementGroupId = placeGoup.filter(
      (item) => item.Description === POINT_CHARGEMENT_CIMENCAM
    )[0].Id;

    //Extract geofence group Id
    const geofenceGroupId = placeGoup.filter(
      (item) => item.Description === GEOFENCE
    )[0].Id;

    //ExtractGeofence
    const geofences = await getLandPointCimencam(geofenceGroupId);

    //Extract point de chargement places
    const pointChargementPlaces = await getLandPointCimencam(
      pointChargementGroupId
    );
    const chargementPlaceDescription = pointChargementPlaces.map((item) => {
      return item.Description;
    });

    //Extract points de dechargement places
    const pointDeChargementPlaces = geofences.filter(
      (it) => !chargementPlaceDescription.includes(it.Description)
    );
    const pointDeChargementDescription = pointDeChargementPlaces.map((item) => {
      return item.Description;
    });

    if (geofences && pointChargementPlaces && pointDeChargementPlaces) {
      const trajet = getAllTrajets.filter(
        (item) =>
          (chargementPlaceDescription.includes(item.depart) &&
            pointDeChargementDescription.includes(item.arriver)) ||
          (chargementPlaceDescription.includes(item.depart) &&
            chargementPlaceDescription.includes(item.arriver)) ||
          (pointDeChargementDescription.includes(item.depart) &&
            pointDeChargementDescription.includes(item.arriver))
      );

      const cimencamTrajet = trajet.map((item) => {
        if (
          pointDeChargementDescription.includes(item.depart) &&
          chargementPlaceDescription.includes(item.arriver)
        ) {
          return {
            ...item,
            Trajet: 'Transporteur',
          };
        } else {
          return {
            ...item,
            Trajet: 'Cimencam',
          };
        }
      });

      if (cimencamTrajet) {
        const trajet = cimencamTrajet.filter(
          (item) => item.heureDepart && item.heureDarriver
        );
        trajet.map((item) => {
          const dateDapartTimstap = Date.parse(item.heureDepart);
          const newDateDepart = new Date(dateDapartTimstap);
          const formatDateDepart = dateInYyyyMmDdHhMmSs2(newDateDepart);

          const dateArriverTimstap = Date.parse(item.heureDarriver);
          const newDateArriver = new Date(dateArriverTimstap);
          const formatDateArriver = dateInYyyyMmDdHhMmSs2(newDateArriver);
          insertTrajet(
            item.vehicleid,
            item.depart,
            formatDateDepart,
            item.arriver,
            formatDateArriver,
            item.Trajet
          );
        });
        return trajet;
      }
    }
  }
}

async function onGetAllTrajetCimencam(req, res) {
  try {
    const result = await getAllTrajets();
    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

async function onGetTrajetVehicleByStarttime(req, res) {
  try {
    const vehicleId = req.body.vehicleId;
    const start = req.body.startDate;
    const end = req.body.enDate;

    if (!vehicleId || !start || !end) {
      return res.status(400).json({
        error: 'Missing require a parameter',
      });
    }

    const result = await getTrajetsByVehicleIdStartTimeEndTime(
      vehicleId,
      start,
      end
    );

    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

async function onGetAllTrajetByStarttime(req, res) {
  try {
    const start = req.body.startDate;
    const end = req.body.enDate;

    if (!start || !end) {
      return res.status(400).json({
        error: 'Missing require a parameter',
      });
    }

    const result = await getTrajetsByStartTimeEndTime(start, end);

    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

async function onGetTrajetVehicle(req, res) {
  try {
    const vehicleId = req.body.vehicleId;

    if (!vehicleId) {
      return res.status(400).json({
        error: 'Missing require a parameter',
      });
    }

    const result = await getTrajetsByVehicleId(vehicleId);

    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

//Get all trajet test
async function trajetsTest(req, res) {
  const trajets = [];
  try {
    const result = await getNotificationsOrderByVehicleID();

    if (result) {
      //Group notifications By VehicleID
      const groupNotifByVehicleId = _.groupBy(result, (resu) => resu.vehicleid);

      //change objects to arr and remove key
      const arrData = Object.keys(groupNotifByVehicleId).map((key) => {
        return Object.values(groupNotifByVehicleId[[key]]);
      });

      //sort notif by exit time
      const sortByEntryTime = arrData.map((item) => {
        return item.sort((a, b) => {
          const dateA = new Date(b['entrytime']);
          const dateB = new Date(a['entrytime']);

          return dateB.getTime() - dateA.getTime();
        });
      });

      //Create chunks of notifications by vehicle id
      const chunks = sortByEntryTime.map((item) => {
        return chunk(item, 2);
      });

      //creates trajet cimecam
      const Arrtrajet = chunks.map((item) => {
        if (item.length > 0) {
          return item.map((it) => {
            if (it.length > 1) {
              var trajet = {
                vehicleid: it[0].vehicleid,
                id: it[0].id + it[1].id,
                depart: it[0].placedescription,
                heureDepart: it[0].exittime,
                arriver: it[1].placedescription,
                heureDarriver: it[1].entrytime,
              };
              return trajet;
            } else {
              return {
                vehicleid: it[0].vehicleid,
                id: it[0].id,
                arriver: it[0].placedescription,
                heureDarriver: it[0].entrytime,
                depart: it[0].placedescription,
                heureDepart: it[0].exittime,
              };
            }
          });
        }
      });

      const Arrtrajets = chunks.map((item) => item);

      if (Arrtrajet && chunks) {
        const obj = Arrtrajet.map((item) => {
          return item.map((it) => {
            trajets.push(it);
          });
        });
        //console.log(Arrtrajet);

        return res.status(200).json(chunks);
      }
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

//Get all notifs from databases
async function onGetAllNotifTest(req, res) {
  const trajets = [];
  try {
    const result = await getNotificationsOrderByVehicleID();

    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

// get all notif entry Exit cimencam and strore in database
async function onGetEntryExitNotificationsTest(req, res) {
  const date = getFistAndLastHourDay();
  try {
    const notifEntryExitCimencam = [];

    const vehiclegroups = await getVehiclesGroups();

    if (vehiclegroups) {
      //Extract All vehicle Group Id
      const AllVehicleGroupId = vehiclegroups.filter(
        (item) => item.Description === ALL_VEHICLE
      )[0].Id;
      //all EntryNotifications
      const dataTest = await getEntryExitData(
        AllVehicleGroupId,
        1000,
        20,
        date.firstHourDayFormat,
        date.lasthourDayFormat
      );
      if (dataTest) {
        return res.status(200).json(AllVehicleGroupId);
      }

      /*  const allNotifications = await Promise.all(PAGES.map(async item => {
                const data = await getEntryExitData(AllVehicleGroupId, 1000, item,date.firstHourDayFormat,date.lasthourDayFormat);
                
                if (data) {
                    data.map(it => {
                       
                        if (it) {
                            notifEntryExitCimencam.push(it);
                            //console.log(notifEntryExitCimencam.length);
                        }
                    })
                }
            }
            ));

            if (allNotifications) {
                notifEntryExitCimencam.map(item => insertNotifications(item.PlaceDescription, item.VehicleId, item.DriverId, item.PlaceEntryLocalTimestamp, item.PlaceExitLocalTimestamp));
            } */
    }
  } catch (error) {
    console.error('error of: ', error);
  }
}

module.exports = {
  onGetAllVehiclesByGroupId,
  onGetPlaceGroup,
  onGetVehiclesGroups,
  onGetAlertVehicles,
  onGetTrajetCimencam,
  onGetEntryExitNotifications,
  onGetAllTrajets,
  onGetAllTrajetCimencam,
  onGetTrajetVehicleByStarttime,
  onGetAllTrajetByStarttime,
  onGetTrajetVehicle,
  trajetsTest,
  onGetEntryExitNotificationsTest,
  onGetAllNotifTest,
};
