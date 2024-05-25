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


module.exports={insertNotifications,getNotificationsOrderByVehicleID}

 