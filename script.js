const apiKey="dda41e776c9c7326ccebf0cbcdfd7cdf";

async function getWeather(){

const city=document.getElementById("city").value;

const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

try{

const response=await fetch(url);

const data=await response.json();

if(data.cod!=200){

alert("City not found");

return;

}

document.getElementById("cityName").innerHTML=data.name;

document.getElementById("temp").innerHTML=Math.round(data.main.temp)+"°C";

document.getElementById("condition").innerHTML=data.weather[0].description;

document.getElementById("humidity").innerHTML=data.main.humidity+"%";

document.getElementById("wind").innerHTML=data.wind.speed+" km/h";

document.getElementById("pressure").innerHTML=data.main.pressure+" hPa";

document.getElementById("icon").src=
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

changeBackground(data.weather[0].main);

}catch(error){

console.log(error);

}

}

function changeBackground(weather){

const body=document.body;

switch(weather){

case "Clear":

body.style.background="linear-gradient(135deg,#f6d365,#fda085)";
break;

case "Clouds":

body.style.background="linear-gradient(135deg,#bdc3c7,#2c3e50)";
break;

case "Rain":

body.style.background="linear-gradient(135deg,#4e54c8,#8f94fb)";
break;

case "Snow":

body.style.background="linear-gradient(135deg,#e6dada,#274046)";
break;

case "Thunderstorm":

body.style.background="linear-gradient(135deg,#141E30,#243B55)";
break;

default:

body.style.background="linear-gradient(135deg,#4facfe,#00f2fe)";

}

}