const {dateInYyyyMmDdHhMmSs}=require('./formatdate')


function getFistAndLastHourDay(){
    let startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    let firstHourDayFormat=dateInYyyyMmDdHhMmSs(startOfDay);

    let endofDay = new Date();
    endofDay.setHours(23, 59, 59, 999);   
    let lasthourDayFormat =dateInYyyyMmDdHhMmSs(endofDay);

    return {firstHourDayFormat,lasthourDayFormat}
}

module.exports={getFistAndLastHourDay}