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

const city = await request().catch(error => {
    error.message;
});

async function printCities(){

    cities.forEach(async city=>{
        let req = await request(city);
        console.log(req);
    })
}