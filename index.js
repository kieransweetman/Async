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

// donnees
const cities = [['Paris','75056'], ['Marseille','13055'], ['Lyon','69123'], ['Toulouse','31555'], ['Nice', '06088'], ['Nantes','44109'], ['Montpellier','34172'], ['Strasbourg','67482'],[ 'Bordeaux','33063'],[ 'Lille' ,'59350']]
const weatherCodes = {
0	:'Soleil',
1	:'Peu nuageux',
2	:'Ciel voilé',
3	:'Nuageux',
4	:'Très nuageux',
5	:'Couvert',
6	:'Brouillard',
7	:'Brouillard givrant',
10:'Pluie faible',
11:'Pluie modérée',
12:'Pluie forte',
13:'Pluie faible verglaçante',
14:'Pluie modérée verglaçante',
15:'Pluie forte verglaçante',
16:'Bruine',
20:'Neige faible',
21:'Neige modérée',
22:'Neige forte',
30:'Pluie et neige mêlées faibles',
31:'Pluie et neige mêlées modérées',
32:'Pluie et neige mêlées fortes',
40:'Averses de pluie locales et faibles',
41:'Averses de pluie locales',
42:'Averses locales et fortes',
43:'Averses de pluie faibles',
44:'Averses de pluie',
45:'Averses de pluie fortes',
46:'Averses de pluie faibles et fréquentes',
47:'Averses de pluie fréquentes',
48:'Averses de pluie fortes et fréquentes',
60:'Averses de neige localisées et faibles',
61:'Averses de neige localisées',
62:'Averses de neige localisées et fortes',
63:'Averses de neige faibles',
64:'Averses de neige',
65:'Averses de neige fortes',
66:'Averses de neige faibles et fréquentes',
67:'Averses de neige fréquentes',
68:'Averses de neige fortes et fréquentes',
70:'Averses de pluie et neige mêlées localisées et faibles',
71:'Averses de pluie et neige mêlées localisées',
72:'Averses de pluie et neige mêlées localisées et fortes',
73:'Averses de pluie et neige mêlées faibles',
74:'Averses de pluie et neige mêlées',
75:'Averses de pluie et neige mêlées fortes',
76:'Averses de pluie et neige mêlées faibles et nombreuses',
77:'Averses de pluie et neige mêlées fréquentes',
78:'Averses de pluie et neige mêlées fortes et fréquentes',
100:'Orages faibles et locaux',
101:'Orages locaux',
102:'Orages fort et locaux',
103:'Orages faibles',
104:'Orages',
105:'Orages forts',
106:'Orages faibles et fréquents',
107:'Orages fréquents',
108:'Orages forts et fréquents',
120:'Orages faibles et locaux de neige ou grésil',
121:'Orages locaux de neige ou grésil',
122:'Orages locaux de neige ou grésil',
123:'Orages faibles de neige ou grésil',
124:'Orages de neige ou grésil',
125:'Orages de neige ou grésil',
126:'Orages faibles et fréquents de neige ou grésil',
127:'Orages fréquents de neige ou grésil',
128:'Orages fréquents de neige ou grésil',
130:'Orages faibles et locaux de pluie et neige mêlées ou grésil',
131:'Orages locaux de pluie et neige mêlées ou grésil',
132:'Orages fort et locaux de pluie et neige mêlées ou grésil',
133:'Orages faibles de pluie et neige mêlées ou grésil',
134:'Orages de pluie et neige mêlées ou grésil',
135:'Orages forts de pluie et neige mêlées ou grésil',
136:'Orages faibles et fréquents de pluie et neige mêlées ou grésil',
137:'Orages fréquents de pluie et neige mêlées ou grésil',
138:'Orages forts et fréquents de pluie et neige mêlées ou grésil',
140:'Pluies orageuses',
141:'Pluie et neige mêlées à caractère orageux',
142:'Neige à caractère orageux',
210:'Pluie faible intermittente',
211:'Pluie modérée intermittente',
212:'Pluie forte intermittente',
220:'Neige faible intermittente',
221:'Neige modérée intermittente',
222:'Neige forte intermittente',
230:'Pluie et neige mêlées',
231:'Pluie et neige mêlées',
232:'Pluie et neige mêlées',
235:'Averses de grêle',
}
const elements = ['o3', 'pm25', 'pm10', 'no2', 'so2', 'co'];

/////////////

let airQualityUrl = (city) =>{
    return `http://api.waqi.info/feed/${city}/?token=${k1}`
}

let meteoUrl = (city) => {
    return `https://api.meteo-concept.com/api/forecast/daily?insee=${city}&token=${k2}`

}

async function requestMeteo(city) {
    let url = meteoUrl(city);
    const req = await fetch(url, options)

    if (!req.ok) {
        const message = `An error has occured: ${req.status}`;
        throw new Error(message);
      }

    let data = await req.json();
    return data;    
};

async function printCities(){

    cities.forEach(async city=>{
        let airQuality = await requestAirQuality(city[0]);
        let airData = await airQuality.data;
        

       let meteoObj = await requestMeteo(city[1]);
        let weatherToday = await meteoObj.forecast[0].weather;
        

        let circle = L.circle([airData.city.geo[0], airData.city.geo[1],] ,{color: airQualityMarker(airData.aqi), radius:20000})
        .addTo(map);

        circle.bindPopup(popupConstruc(airData, weatherToday)).openPopup();
        
    })

    
}


function parseWeather(day){

    //parse weather based on code
   let weather = "";
  console.log(day);
  let code = Object.keys(weatherCodes);
  code = code.map(x => Number(x));
console.log(code);
   
   if(day === code[0]){
    weather += '<i class="wi wi-day-sunny wi-fw"></i>';
    weather+= `<br><span>${weatherCodes[day]}</span>`
    
    
    return weather;
   }

   else if(day >= code[1] && day <= code[7]){
    weather += '<i class="wi wi-day-fog wi-fw"></i>';
    weather+= `<br><span>${weatherCodes[day]}</span>`
    return weather;
   }

   else if(day >= code[8] && day <= code[13] || day >= code[18] && day <= code[29]){
    weather += '<i class="wi wi-rain wi-fw"></i>';
    weather+= `<br><span>${weatherCodes[day]}</span>`
    return weather;
   }
   
   else  if(day >= code[30] && day <= code[47] || day >= code[81] && day <= code[83]){
     weather += '<i class="wi wi-day-snow wi-fw"></i>';
     weather+= `<br><span>${weatherCodes[day]}</span>`
     return weather;
    }
   else if(day >= code[48] && day <= code[76] ){
    weather += '<i class="wi wi-day-storm-showers wi-fw"></i>';
    weather+= `<br><span>${weatherCodes[day]}</span>`

    return weather;
   }

}

function popupConstruc(airData, weather) {
    let iaqi = airData.iaqi;
    
    let today = parseWeather(weather);

    let toPopup = "";
    toPopup += today;
    elements.forEach(el => {
        
        if (iaqi[el]) {
            toPopup += `<p>${el} : ${iaqi[el].v} </p>`;
            
            
        } else {
            
            toPopup += `<p>${el} : N/A </p>`;
            
        }
        
    })
    
    
    return toPopup;
    
}


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

await printCities();


