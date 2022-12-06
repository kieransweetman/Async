"use strict";
import { k1, k2 } from "./config.js";

const map = L.map('map').setView([46.2276, 2.2137], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// villes par population en ordre



const cities = ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille' ]

let buildUrl = (city) =>{
    return `http://api.waqi.info/feed/${city}/?token=${k1}`
}

async function request(city) {
    let url = buildUrl(city);
    const req = await fetch(url)

    if (!req.ok) {
        const message = `An error has occured: ${req.status}`;
        throw new Error(message);
      }

    let data = await req.json();
    return data;    
};


async function printCities(){

    cities.forEach(async city=>{
        let req = await request(city);
        let data = await req.data;
        console.log(data);

        let circle = L.circle([data.city.geo[0], data.city.geo[1],] ,{color: airQualityMarker(data.aqi), radius:20000})
        .bindPopup(`o3 :${data.iaqi.o3.v}<br>
                    pm25 :${data.iaqi.pm25.v}<br> 
                    pm10 :${data.iaqi.pm10.v}<br> 
                    NO2 :${data.iaqi.no2.v}<br> 
                    SO2 :${data.iaqi}v<br> 
                    co :${data.iaqi}<br> `)
        .openPopup().addTo(map);
        // pm25 pm10-> data.forecast.daily.pm10 03 no2 so2 co
        
    })
}


async function airQuality(){
     cities.forEach(async city => {
        let req = await request(city);
        let data = await req.data;
     })
}

function airQualityMarker(aqi){

    let color = ""

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
    

}



await printCities();

