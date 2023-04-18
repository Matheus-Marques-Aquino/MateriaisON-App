export const distanceTo = (places) => {
    let lat = [places[0].lat, places[1].lat];
    let lng = [places[0].lng, places[1].lng];

    let p = 0.017453292519943295;
    let c = Math.cos;
    let x = 0.5 - c((lat[1] - lat[0]) * p) / 2 + c(lat[0] * p) * c(lat[1] * p) * (1 - c((lng[1] - lng[0]) * p)) / 2;  
    let distance = (12742 * Math.asin(Math.sqrt(x))).toFixed(2);

    return distance;
}