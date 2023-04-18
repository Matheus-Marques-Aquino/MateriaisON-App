import React, { Component } from 'react';
import { HTTP } from 'meteor/http';

class GeoNamesHelper{
    constructor(page){        
        this.username = 'matheus_';
        this.page = page;      
    }
    findLocationCEP(lat, lng){
        let url = 'http://api.geonames.org/findNearbyPostalCodesJSON?lat='+lat+'&lng='+lng+'&username='+this.username
        let cepRequest = HTTP.post(url, {timeout: 10000}, (error, result)=>{
            if (!error){
                console.log(result);
            }else{
                console.log(error)
            }
        })                
    }
    findNearByCity(lat,lng,rad){
        let url = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat='+lat+'&lng='+lng+'&radius=20&maxRows=1000&username='+this.username
        let cityRequest = HTTP.post(url, {timeout: 10000}, (error, result)=>{
            if (!error){
                console.log(result);
                let geonames = result.data.geonames;
                let stateArray = []
                geonames.map(data=>{
                    let state = data.adminCodes1.ISO3166_2;
                    if (state){
                        if (!stateArray.includes(state)){ stateArray.push(state)}
                    }
                })
                return(stateArray)
            }else{
                console.log(error)
            }
        })
    }
}
export default GeoNamesHelper;