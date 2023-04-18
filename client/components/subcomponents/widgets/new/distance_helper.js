class DistanceHelper{
    constructor(page){
        this.url = 'http://api.geonames.org/findNearbyPlaceNameJSON?';
        this.username = 'matheus_'
        this.page = page;
    }
    /*nearbyMe(radius, callback){           

        Meteor.subscribe('profileFields', 'ProfileCoords', Meteor.userId(), ()=>{

            let profile = Profile.find({'_id': Meteor.userId()}).fetch();
            profile = profile[0].profile
            let mainAddress = profile.mainAddress;
            let position = profile.address[mainAddress].coords.selected;
            let _radius = radius + 4;
            let citiesCache = CitiesCache.find({}).fetch();
            if (citiesCache.length > 1){
                CitiesCache.remove({});
            }
            if (citiesCache.length == 0){
                this.returnCities(position, radius, (cities)=>{
                    CitiesCache.insert({
                        lat: position.lat,
                        lng: position.lng,
                        radius: radius,
                        cities: cities
                    });
                    if (callback){ callback(cities); }
                    return;
                })                    
            } 
            if (citiesCache.length == 1){
                if (position.lat == citiesCache[0].lat && position.lng == cities[0].lng &&cities[0].radius == radius){
                    if (callback){ callback(citiesCache[0].cities); }                    
                    return;
                }else{  
                    citiesCache.remove({});                  
                    this.returnCities(position, _radius, (cities)=>{
                        CitiesCache.insert({
                            lat: position.lat,
                            lng: position.lng,
                            radius: radius,
                            cities: cities
                        });                        
                        if (callback){ callback(cities); }
                    })
                    
                    return;
                } 
            }
                 
        });
    } 

    returnCities(position, radius, callback){
        let _url = this.url + 'lat='+ position.lat +'&lng=' + position.lng + '&radius=' + radius + '&style=short&maxRows=10000&username=' + this.username;
                    HTTP.post(_url, {timeout: 10000}, (error, result)=>{
                        if (!error){
                            if (result.statusCode == 200){
                                let geonames = result.data.geonames;
                                let cities = [];
                                if (geonames.length > 0){
                                    geonames.map(city=>{
                                        cities.push(city);
                                    });
                                    if (callback){ callback(cities); }
                                    if (cities.length == 0){
                                    }
                                    return;                                    
                                }                        
                            }else{
                                if (callback){ callback([]); }
                                return;
                            }                    
                        }else{
                            if (callback){ callback([]); }
                            return;
                        }
                    });
    } 


    distanceBetweenMe(place, callback){
        Meteor.subscribe('profileFields', 'ProfileCoords', Meteor.userId(), ()=>{
            let profile = Profile.find({'_id': Meteor.userId()}).fetch();
            profile = profile[0].profile
            let mainAddress = profile.mainAddress;
            let position = profile.address[mainAddress].coords.selected;

            let lat1 = position.lat;
            let lng1 = position.lng

            let lat2 = place.lat;
            let lng2 = place.lng;

            var p = 0.017453292519943295;    
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lng2 - lng1) * p))/2;  
            var distance = Math.ceil(12742 * Math.asin(Math.sqrt(a)) * 10)/10;

            if (this.page) { this.page.setState({distance: distance}); }
            else{
                return ( distance );
            }
            if (callback) { callback(); }
        });        
    }*/ 

    distanceTo(place1, place2){

        var lat1 = parseFloat(place1.lat);
        var lat2 = parseFloat(place2.lat);

        var lng1 = parseFloat(place1.lng);
        var lng2 = parseFloat(place2.lng);

        var p = 0.017453292519943295;    
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lng2 - lng1) * p))/2;  
        var distance = Math.ceil(12742 * Math.asin(Math.sqrt(a)) * 10)/10;

        return(distance);
    }
    distanceBetween(place1, place2){

        var lat1 = place1.lat;
        var lat2 = place2.lat;

        var lng1 = place1.lng;
        var lng2 = place2.lng

        var p = 0.017453292519943295;    
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lng2 - lng1) * p))/2;  
        var distance = Math.ceil(12742 * Math.asin(Math.sqrt(a)) * 10)/10;

        return(distance);
    }   
}
export default DistanceHelper;