"use strict";
import { k1, k2 } from "./config.js";

const map = L.map('map').setView([46.2276, 2.2137], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


let options = {
    
    headers : {
        Authorization : `Bearer ${k2}`,
       
    }
    
}

///////////////////

// villes par population en ordre



const cities = ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille' ]

let airQualityUrl = (city) =>{
    return `http://api.waqi.info/feed/${city}/?token=${k1}`
}

let meteoUrl = (city) => {
    return `https://api.meteo-concept.com/api/forecast/daily?insee=${city}`

}

// async function requestMeteo(city) {
//     let url = meteoUrl(city);
//     console.log(url);
//     const req = await fetch(url, options)

//     if (!req.ok) {
//         const message = `An error has occured: ${req.status}`;
//         throw new Error(message);
//       }

//     let data = await req.json();
//     return data;    
// };

// let data = await requestMeteo('34172');
// console.log(await data);





async function requestAirQuality(city) {
    let url = airQualityUrl(city);
    const req = await fetch(url)

    if (!req.ok) {
        const message = `An error has occured: ${req.status}`;
        throw new Error(message);
      }

    let data = await req.json();
    return data;    
};

function popupConstruc(data) {
    let iaqi = data.iaqi;
    
    const elements = ['o3', 'pm25', 'pm10', 'no2', 'so2', 'co'];
    
    let toPopup = '';
    elements.forEach(el => {
        
        if (iaqi[el]) {
            toPopup += `${el} : ${iaqi[el].v} <br>`;
            
            
        } else {
            
            toPopup += `${el} : N/A <br>`;
            
        }
        
    })
    
    return toPopup;
    
}

function airQualityMarker(aqi){
    
    let color;
    
    if(aqi < 25){
        color = 'blue';
        return color;
        
    }
    if(aqi < 50){
        color = 'green';
        return color;
        
    }
    if(aqi < 75){
        color = 'yellow';
        return color;
        
    }
    if(aqi < 100){
        color = 'orange';
        return color;
        
    }
    if(aqi < 125){
        color = 'red';
        return color;
        
    }
    
    if(aqi ==="-"){
        color = 'black';
        return color;
    }
    
    return color;
    
}

async function printCities(){

    cities.forEach(async city=>{
        let req = await requestAirQuality(city);
        let data = await req.data;

        let circle = L.circle([data.city.geo[0], data.city.geo[1],] ,{color: airQualityMarker(data.aqi), radius:20000})
        .addTo(map);

        circle.bindPopup(popupConstruc(data)).openPopup();

        
       
        
    })
}

await printCities();

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer 7e8edc5e3355f1c8215eca41afbd40321407d3e8147977c60c3fb5a8499bdf82");
myHeaders.append('Access-Control-Allow-Origin','*')


var raw = JSON.stringify({
  "UserId": 21,
  "captchaId": 18,
  "captcha": "78",
  "comment": "testsss (***isweetman@gmail.com)",
  "rating": 3
});

var requestOptions = {
  headers: myHeaders,

  
};

fetch("https://api.meteo-concept.com/api/forecast/daily?insee=34172", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));