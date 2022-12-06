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

async function request() {
    let url = buildUrl('Paris');
    const req = await fetch(url)
    let data = await req.json();
    return data;    
};

const city = await request();

console.log(city);