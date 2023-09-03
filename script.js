// C to F conversion
let units = "metric";
let temperature =  0; 
let userCity = "Denver";  

const DegreeUnits = {
   Celsius:"°C ",
   Fahrenheit:"°F "
}

const SpeedUnits = {
   MPH:  " mph",
   KPH:  " km/h"
}

let degreesLabel = DegreeUnits.Celsius;  
let speedLabel = SpeedUnits.KPH;  

function getLocalDate(dt) {
  // let unix_timestamp = 1549312452
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(dt * 1000);
  return date.toLocaleString(); 
}


let weather = {
  apiKey: "82005d27a116c2880c8f0fcb866998a0",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=" + units + "&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        userCity = city;  
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const country = data.sys.country;  
    const { icon, description } = data.weather[0];
    const { temp, temp_min, temp_max, feels_like, humidity } = data.main;
    const { speed, deg } = data.wind;
    const dt = data.dt; 
    if (country !== "") {
      document.querySelector(".city").innerText =  name + ", " + country; 
    }
    else {
      document.querySelector(".city").innerText =  name; 
    } 
   // document.querySelector(".countryName").innerText = country; 
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".time").innerText = getLocalDate(dt); 
     document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + degreesLabel;
    document.querySelector(".temp_min").innerText = "Low " + temp_min + degreesLabel;
    document.querySelector(".temp_max").innerText ="Hi " +  temp_max + degreesLabel;
    document.querySelector(".feels_like").innerText = " Feels like " + feels_like + degreesLabel;
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + speedLabel;  
      document.querySelector(".deg").innerText =
      "Direction: " + deg + " ° "  + getCardinalDirection(deg) + ""
    document.querySelector(".weather").classList.remove("loading");
     document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".temp").addEventListener("click", function () {;
   if (units === "metric") {
       units = "imperial"; 
       degreesLabel = DegreeUnits.Fahrenheit;
       speedLabel = SpeedUnits.MPH; 
    }
    else {
      units = "metric"; 
      degreesLabel = DegreeUnits.Celsius;
      speedLabel = SpeedUnits.KPH; 
    }

     weather.fetchWeather(userCity); 
});

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

  function getCardinalDirection(angle) {
   // const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(angle / 45) % 8];
  }

  function degToCompass(angle) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}


  function  fetchUserCity() {
    let apiKey =  "841afa96ceb940da8f6157a7f16cc527"; 
    fetch("https://api.geoapify.com/v1/ipinfo?apiKey=" + apiKey)
    .then((response) => {
      if (!response.ok) {
        alert("No city found.");
        throw new Error("No city found.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.city.name.trim().length > 0 ) {
        userCity = data.city.name;  
      }
       weather.fetchWeather(userCity);
    })
}

function init() {
  fetchUserCity(); 
  weather.fetchWeather(userCity)
}

window.onload = init;  

