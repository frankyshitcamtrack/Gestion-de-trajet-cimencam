const {pool}= require('../config/db')

function insertNotifications(placedescription,vehicleid,driverid,entrytime,exittime){
  const query= pool.query('INSERT INTO notifications (placedescription,vehicleid,driverid,entrytime,exittime) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (vehicleid,entrytime) DO UPDATE SET exittime=EXCLUDED.exittime,driverid=EXCLUDED.driverid', [placedescription,vehicleid,driverid,entrytime,exittime], (error, results) => {
    if (error) {
      throw error
    }
  }
)

 return query; 
}


async function getNotificationsOrderByVehicleID(){
 try{
    const data = await pool.query('SELECT * FROM notifications ORDER BY vehicleid ASC,entrytime ASC,exittime ASC');
    return data.rows;
 }catch(error){
    console.log(error);
 }
}

function insertTrajet(vehicleid,depart,heuredepart,arriver,heuredarriver,trajet){
    const query= pool.query('INSERT INTO trajets (vehicleid,depart,heuredepart,arriver,heuredarriver,trajet) VALUES ($1, $2, $3, $4, $5,$6) ON CONFLICT (heuredepart,heuredarriver) DO NOTHING', [vehicleid,depart,heuredepart,arriver,heuredarriver,trajet], (error, results) => {
      if (error) {
        throw error
      }
    }
  )
  
   return query; 
  }

  async function getAllTrajets(){
    try{
        const data = await pool.query('SELECT * FROM trajets ORDER BY vehicleid,heuredepart');
        return data.rows;
     }catch(error){
        console.log(error);
     }
  }

  async function getTrajetsByVehicleIdStartTimeEndTime(vehicleId,start,end){
    try{
        const data = await pool.query('SELECT * FROM trajets WHERE (TRIM(heuredepart) BETWEEN $2 AND $3 ) AND TRIM(vehicleid)=$1 ORDER BY heuredepart',[vehicleId,start,end]);
        return data.rows;
     }catch(error){
        console.log('sql error'+ '' +error);
     }
  }

  async function getTrajetsByStartTimeEndTime(start,end){
    try{
        const data = await pool.query('SELECT * FROM trajets WHERE (TRIM(heuredepart) BETWEEN $1 AND $2 ) ORDER BY heuredepart',[start,end]);
        return data.rows;
     }catch(error){
        console.log('sql error'+ '' +error);
     }
  }
  
  async function getTrajetsByVehicleId(vehicleId){
    try{
        const data = await pool.query('SELECT * FROM trajets  WHERE TRIM(vehicleid)=$1 ORDER BY heuredepart',[vehicleId]);
        return data.rows;
     }catch(error){
        console.log('sql error'+ '' +error);
     }
  }


module.exports={insertNotifications,getNotificationsOrderByVehicleID,insertTrajet,getTrajetsByVehicleIdStartTimeEndTime,getAllTrajets,getTrajetsByStartTimeEndTime,getTrajetsByVehicleId}

 