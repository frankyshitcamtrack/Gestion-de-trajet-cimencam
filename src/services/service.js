const axios = require('axios');
const {developement}= require('../config/config')

const token = developement.token;
const base_url= developement.base_url
 
//get all vehicles
function getAllVehicles(){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/v2/vehicles.json`,
        headers: {
            'Authorization': `Basic ${token}`
        }
    };

 return axios.request(config)
        .then((response) => {
            const data =response.data.Items;
            return data;
        })
        .catch((error) => {
            console.log(error);
        });
}


//get all groups vehicle
function getVehiclesGroups() {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/v2/vehiclegroups.json`,
        headers: {
            'Authorization': `Basic ${token}`
        }
    };

return axios.request(config)
        .then((response) => {
            const data =response.data;
            return data.Items;
        })
        .catch((error) => {
            console.log(error);
        });
}


//get all vehicles in a goup
function getAllVehiclesByGroupId(groupId){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/v3/vehiclegroups/${groupId}/vehiclesexpanded.json`,
        headers: {
            'Authorization': `Basic ${token}`
        }
    };

 return axios.request(config)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
}


//get all groups points or groupland cimencam
function getPlaceGroup() {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/v2/placegroups.json`,
        headers: {
            'Authorization': `Basic ${token}`
        }

    };

    return axios.request(config)
        .then((response) => {
            const data =response.data.Items
            return data;
        })
        .catch((error) => {
            console.log(error);
        });
}



//get allpoints in a group land 
function getLandPointCimencam(placeGroupId){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/v2/placegroups/${placeGroupId}/places.json`,
        headers: {
            'Authorization': `Basic ${token}`
        }
    };

 return axios.request(config)
        .then((response) => {
            return response.data.Items;
        })
        .catch((error) => {
            console.log(error);
        });
}


function alertVhicles(idVhicle){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${base_url}/v2/vehicles/${idVhicle}/alerts.json`,
        headers: {
            'Authorization': `Basic ${token}`
        }
    };

 return axios.request(config)
        .then((response) => {
            const data = response.data;
            console.log(data)
            return data;
        })
        .catch((error) => {
            console.log(error);
        });
}


function getEntryExitData(id,size,page,firstHourDay,lastHourDay){
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${base_url}/v2/vehiclegroups/${id}/placeentryexit/${firstHourDay}/${lastHourDay}.json?pg=${page}&ps=${size}`,
            headers: {
                'Authorization': `Basic ${token}`
            }

           // https://us.mzoneweb.net/api/v2/vehiclegroups/c820bc02-0eac-4732-9fc3-96ff91dc1b20/placeentryexit/20240520T000000/20240520T235959.json?pg=20&ps=1000
            
        };

    return axios.request(config)
            .then((response) => {
                const data = response.data;
                return data;
            })
            .catch((error) => {
                console.log(error);
            });
}



module.exports={
    getVehiclesGroups,
    getAllVehiclesByGroupId,
    getLandPointCimencam,
    getPlaceGroup,
    getAllVehicles,
    alertVhicles,
    getEntryExitData
}